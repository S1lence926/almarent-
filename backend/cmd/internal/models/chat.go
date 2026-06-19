package models

import "time"

type Chat struct {
	ID         string    `json:"id" db:"id"`
	TenantID   string    `json:"tenant_id" db:"tenant_id"`
	LandlordID string    `json:"landlord_id" db:"landlord_id"`
	ListingID  string    `json:"listing_id" db:"listing_id"`
	CreatedAt  time.Time `json:"created_at" db:"created_at"`
}

type Message struct {
	ID        string    `json:"id" db:"id"`
	ChatID    string    `json:"chat_id" db:"chat_id"`
	SenderID  string    `json:"sender_id" db:"sender_id"`
	Content   string    `json:"content" db:"content"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}
