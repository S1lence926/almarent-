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
		allowedOrigins := map[string]bool{
			"http://localhost:5173":       true,
			"https://almarent.vercel.app": true,
		}
		origin := c.Request.Header.Get("Origin")
		if allowedOrigins[origin] {
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
			listings.GET("/map", listingHandler.GetForMap)
			listings.GET("/:id", listingHandler.GetByID)
			listings.GET("/:id/photos", photoHandler.GetByListing)
		}

		protected := api.Group("/")
		protected.Use(middleware.Auth(cfg.JWTSecret))
		{
			protected.GET("/me", authHandler.GetMe)

			protected.POST("/listings", listingHandler.Create)
			protected.PUT("/listings/:id", listingHandler.Update)
			protected.DELETE("/listings/:id", listingHandler.Delete)
			protected.GET("/my-listings", listingHandler.GetMyListings)
			protected.POST("/listings/:id/archive", listingHandler.Archive)
			protected.POST("/listings/:id/restore", listingHandler.Restore)
			protected.DELETE("/listings/:id/hard", listingHandler.HardDelete)

			protected.POST("/upload", handlers.UploadPhoto)
			protected.POST("/listings/:id/photos", photoHandler.Add)

			protected.POST("/listings/:id/favorite", favoriteHandler.Add)
			protected.DELETE("/listings/:id/favorite", favoriteHandler.Remove)
			protected.GET("/listings/:id/favorite", favoriteHandler.Check)
			protected.GET("/favorites", favoriteHandler.GetMyFavorites)

			protected.POST("/chats", chatHandler.StartChat)
			protected.GET("/chats", chatHandler.GetMyChats)
			protected.GET("/chats/:id/messages", chatHandler.GetMessages)
			protected.POST("/chats/:id/messages", chatHandler.SendMessage)
		}
	}

	_ = rdb
	return r
}