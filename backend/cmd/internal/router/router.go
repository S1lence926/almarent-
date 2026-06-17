package router

import (
	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
	"github.com/jmoiron/sqlx"
	"github.com/redis/go-redis/v9"
	"almarent/internal/handlers"
	"almarent/internal/middleware"
	"almarent/internal/repository"
	"almarent/internal/config"
)
func Setup(db *sqlx.DB, rdb *redis.Client, cfg *config.Config) *gin.Engine {
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
	}))

	jwtSecret := cfg.JWTSecret

	userRepo := repository.NewUserRepo(db)
	listingRepo := repository.NewListingRepo(db)

	authHandler := handlers.NewAuthHandler(userRepo, jwtSecret)
	listingHandler := handlers.NewListingHandler(listingRepo)

	api := r.Group("/api")
	{
		auth := api.Group("/auth")
		{
			auth.POST("/register", authHandler.Register)
			auth.POST("/login", authHandler.Login)
		}

		listings := api.Group("/listings")
		{
			listings.GET("", listingHandler.GetAll)
			listings.GET("/:id", listingHandler.GetByID)
		}

		protected := api.Group("/")
		protected.Use(middleware.Auth(jwtSecret))
		{
			protected.POST("/listings", listingHandler.Create)
			protected.PUT("/listings/:id", listingHandler.Update)
			protected.DELETE("/listings/:id", listingHandler.Delete)
		}
	}

	return r
}