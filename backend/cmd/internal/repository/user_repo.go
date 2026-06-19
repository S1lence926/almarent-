package repository

import (
	"context"

	"almarent/internal/models"

	"github.com/jmoiron/sqlx"
)

type UserRepo struct {
	db *sqlx.DB
}

func NewUserRepo(db *sqlx.DB) *UserRepo {
	return &UserRepo{db: db}
}

func (r *UserRepo) Create(ctx context.Context, u *models.User) (*models.User, error) {
	result := &models.User{}
	err := r.db.QueryRowxContext(ctx,
		`INSERT INTO users (name, email, password_hash, role)
		 VALUES ($1, $2, $3, $4)
		 RETURNING id, name, email, role, phone, avatar_url, created_at`,
		u.Name, u.Email, u.PasswordHash, u.Role,
	).StructScan(result)
	return result, err
}

func (r *UserRepo) FindByEmail(ctx context.Context, email string) (*models.User, error) {
	u := &models.User{}
	err := r.db.GetContext(ctx, u, "SELECT * FROM users WHERE email = $1", email)
	return u, err
}

func (r *UserRepo) FindByID(ctx context.Context, id string) (*models.User, error) {
	u := &models.User{}
	err := r.db.GetContext(ctx, u, "SELECT * FROM users WHERE id = $1", id)
	return u, err
}