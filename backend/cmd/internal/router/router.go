package router

import (
	"strings"

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
		origin := c.Request.Header.Get("Origin")
		if origin == "http://localhost:5173" ||
			strings.HasSuffix(origin, ".vercel.app") ||
			origin == "https://almarent.vercel.app" {
			c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
		}
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
	chatRepo := repository.NewChatRepo(db)
	favoriteRepo := repository.NewFavoriteRepo(db)

	authHandler := handlers.NewAuthHandler(userRepo, cfg.JWTSecret)
	listingHandler := handlers.NewListingHandler(listingRepo)
	photoHandler := handlers.NewPhotoHandler(photoRepo)
	chatHandler := handlers.NewChatHandler(chatRepo, listingRepo)
	favoriteHandler := handlers.NewFavoriteHandler(favoriteRepo, listingRepo)

	authMW := middleware.Auth(cfg.JWTSecret)

	api := r.Group("/api")
	{
		// Auth
		api.POST("/auth/register", authHandler.Register)
		api.POST("/auth/login", authHandler.Login)

		// Listings — публичные
		api.GET("/listings", listingHandler.GetAll)
		api.GET("/listings/map", listingHandler.GetForMap)
		api.GET("/listings/:id", listingHandler.GetByID)
		api.GET("/listings/:id/photos", photoHandler.GetByListing)

		// Favorites check — с опциональной авторизацией (обрабатывается внутри хендлера)
		api.GET("/listings/:id/favorite", authMW, favoriteHandler.Check)

		// Listings — защищённые
		api.POST("/listings", authMW, listingHandler.Create)
		api.PUT("/listings/:id", authMW, listingHandler.Update)
		api.DELETE("/listings/:id", authMW, listingHandler.Delete)
		api.GET("/my-listings", authMW, listingHandler.GetMyListings)
		api.POST("/listings/:id/archive", authMW, listingHandler.Archive)
		api.POST("/listings/:id/restore", authMW, listingHandler.Restore)
		api.DELETE("/listings/:id/hard", authMW, listingHandler.HardDelete)

		// Photos
		api.POST("/upload", authMW, handlers.UploadPhoto)
		api.POST("/listings/:id/photos", authMW, photoHandler.Add)

		// Favorites — защищённые
		api.POST("/listings/:id/favorite", authMW, favoriteHandler.Add)
		api.DELETE("/listings/:id/favorite", authMW, favoriteHandler.Remove)
		api.GET("/favorites", authMW, favoriteHandler.GetMyFavorites)

		// Me
		api.GET("/me", authMW, authHandler.GetMe)

		// Chats
		api.POST("/chats", authMW, chatHandler.StartChat)
		api.GET("/chats", authMW, chatHandler.GetMyChats)
		api.GET("/chats/:id/messages", authMW, chatHandler.GetMessages)
		api.POST("/chats/:id/messages", authMW, chatHandler.SendMessage)
	}

	_ = rdb
	return r
}