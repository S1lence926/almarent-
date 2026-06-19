package main

import (
	"log"

	"almarent/internal/config"
	mydb "almarent/internal/db"
	myredis "almarent/internal/redis"
	"almarent/internal/router"
)

func main() {
	cfg := config.Load()

	database, err := mydb.Connect(cfg.DatabaseURL)
	if err != nil {
		log.Fatal("DB error:", err)
	}
	defer database.Close()

	rdb := myredis.Connect(cfg.RedisURL)

	r := router.Setup(database, rdb, cfg)
	log.Printf("Server on :%s", cfg.Port)
	r.Run(":" + cfg.Port)
}