package models

import "time"

type Role string

const (
	RoleTenant   Role = "tenant"
	RoleLandlord Role = "landlord"
)

type User struct {
	ID           string    `json:"id" db:"id"`
	Name         string    `json:"name" db:"name"`
	Email        string    `json:"email" db:"email"`
	PasswordHash string    `json:"-" db:"password_hash"`
	Role         Role      `json:"role" db:"role"`
	Phone        string    `json:"phone" db:"phone"`
	AvatarURL    string    `json:"avatar_url" db:"avatar_url"`
	CreatedAt    time.Time `json:"created_at" db:"created_at"`
}