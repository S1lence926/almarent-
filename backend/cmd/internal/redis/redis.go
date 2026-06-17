package redis

import (
	"github.com/redis/go-redis/v9"
)

func Connect(url string) *redis.Client {
	opts, _ := redis.ParseURL(url)
	return redis.NewClient(opts)
}