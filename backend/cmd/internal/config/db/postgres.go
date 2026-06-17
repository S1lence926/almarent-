package db

import (
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

func Connect(url string) (*sqlx.DB, error) {
	db, err := sqlx.Connect("postgres", url)
	if err != nil {
		return nil, err
	}
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(5)
	return db, nil
}