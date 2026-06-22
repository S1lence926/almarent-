package repository

import (
	"context"

	"almarent/internal/models"

	"github.com/jmoiron/sqlx"
)

type FavoriteRepo struct {
	db *sqlx.DB
}

func NewFavoriteRepo(db *sqlx.DB) *FavoriteRepo {
	return &FavoriteRepo{db: db}
}

func (r *FavoriteRepo) Add(ctx context.Context, userID, listingID string) error {
	_, err := r.db.ExecContext(ctx,
		"INSERT INTO favorites (user_id, listing_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
		userID, listingID,
	)
	return err
}

func (r *FavoriteRepo) Remove(ctx context.Context, userID, listingID string) error {
	_, err := r.db.ExecContext(ctx,
		"DELETE FROM favorites WHERE user_id=$1 AND listing_id=$2",
		userID, listingID,
	)
	return err
}

func (r *FavoriteRepo) GetByUser(ctx context.Context, userID string) ([]models.Listing, error) {
	var listings []models.Listing
	err := r.db.SelectContext(ctx, &listings,
		`SELECT l.* FROM listings l
		 INNER JOIN favorites f ON f.listing_id = l.id
		 WHERE f.user_id = $1`, userID,
	)
	return listings, err
}

func (r *FavoriteRepo) IsFavorite(ctx context.Context, userID, listingID string) (bool, error) {
	var count int
	err := r.db.GetContext(ctx, &count,
		"SELECT COUNT(*) FROM favorites WHERE user_id=$1 AND listing_id=$2",
		userID, listingID,
	)
	return count > 0, err
}