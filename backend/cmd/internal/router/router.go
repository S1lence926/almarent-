package router

import (
	"almarent/internal/config"
	"almarent/internal/handlers"
	"almarent/internal/middleware"
	"almarent/internal/repository"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	"github.com/redis/go-redis/v9"
)

func Setup(db *sqlx.DB, rdb *redis.Client, cfg *config.Config) *gin.Engine {
	r := gin.Default()

	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Authorization, Content-Type")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	r.Static("/uploads", "./uploads")

	userRepo := repository.NewUserRepo(db)
	listingRepo := repository.NewListingRepo(db)
	photoRepo := repository.NewPhotoRepo(db)

	authHandler := handlers.NewAuthHandler(userRepo, cfg.JWTSecret)
	listingHandler := handlers.NewListingHandler(listingRepo)
	photoHandler := handlers.NewPhotoHandler(photoRepo)

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
			listings.GET("/:id/photos", photoHandler.GetByListing)
		}

		protected := api.Group("/")
		protected.Use(middleware.Auth(cfg.JWTSecret))
		{
			protected.POST("/listings", listingHandler.Create)
			protected.PUT("/listings/:id", listingHandler.Update)
			protected.DELETE("/listings/:id", listingHandler.Delete)
			protected.POST("/upload", handlers.UploadPhoto)
			protected.POST("/listings/:id/photos", photoHandler.Add)
		}
	}

	_ = rdb
	return r
}