package redisdb

import (
	"github.com/redis/go-redis/v9"
)

func Connect(url string) *redis.Client {
	opts, err := redis.ParseURL(url)
	if err != nil {
		panic("Redis URL parse error: " + err.Error())
	}
	return redis.NewClient(opts)
}