package models

import "time"

type Listing struct {
	ID           string   `json:"id" db:"id"`
	OwnerID      string   `json:"owner_id" db:"owner_id"`
	Title        string   `json:"title" db:"title"`
	Description  string   `json:"description" db:"description"`
	Price        float64  `json:"price" db:"price"`
	District     string   `json:"district" db:"district"`
	Address      string   `json:"address" db:"address"`
	Rooms        int      `json:"rooms" db:"rooms"`
	Floor        int      `json:"floor" db:"floor"`
	HasFurniture bool     `json:"has_furniture" db:"has_furniture"`
	HasWifi      bool     `json:"has_wifi" db:"has_wifi"`
	HasWasher    bool     `json:"has_washer" db:"has_washer"`
	IsActive     bool     `json:"is_active" db:"is_active"`
	Status       string   `json:"status" db:"status"`
	Latitude     *float64 `json:"latitude" db:"latitude"`
	Longitude    *float64 `json:"longitude" db:"longitude"`
	Photos       []string `json:"photos" db:"-"`
	CreatedAt    time.Time `json:"created_at" db:"created_at"`
	UpdatedAt    time.Time `json:"updated_at" db:"updated_at"`
}