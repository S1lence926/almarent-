package repository

import (
	"context"
	"github.com/jmoiron/sqlx"
	"almarent/internal/models"
)

type UserRepo struct {
	db *sqlx.DB
}

func NewUserRepo(db *sqlx.DB) *UserRepo {
	return &UserRepo{db: db}
}

func (r *UserRepo) Create(ctx context.Context, user *models.User) (*models.User, error) {
	query := `INSERT INTO users (name, email, password_hash, role)
	          VALUES ($1, $2, $3, $4)
	          RETURNING id, name, email, role, created_at`
	result := &models.User{}
	err := r.db.QueryRowxContext(ctx, query, user.Name, user.Email, user.PasswordHash, user.Role).StructScan(result)
	return result, err
}

func (r *UserRepo) FindByEmail(ctx context.Context, email string) (*models.User, error) {
	user := &models.User{}
	err := r.db.GetContext(ctx, user, "SELECT * FROM users WHERE email = $1", email)
	return user, err
}

func (r *UserRepo) FindByID(ctx context.Context, id string) (*models.User, error) {
	user := &models.User{}
	err := r.db.GetContext(ctx, user, "SELECT * FROM users WHERE id = $1", id)
	return user, err
}