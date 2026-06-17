package main

import (
	"log"
	"almarent/internal/config"
	"almarent/internal/db"
	"almarent/internal/redis"
	"almarent/internal/router"
)

func main() {
	cfg := config.Load()

	database, err := db.Connect(cfg.DatabaseURL)
	if err != nil {
		log.Fatal("DB connect error:", err)
	}
	defer database.Close()

	rdb := redis.Connect(cfg.RedisURL)

	r := router.Setup(database, rdb)
	log.Printf("Server running on port %s", cfg.Port)
	r.Run(":" + cfg.Port)
}