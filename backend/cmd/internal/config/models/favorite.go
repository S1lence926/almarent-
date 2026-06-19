package models

type Favorite struct {
	ID         int    `json:"id"`
	UserID     int    `json:"user_id"`
	PropertyID int    `json:"property_id"`
	CreatedAt  string `json:"created_at"`
}
