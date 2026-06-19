package repository

import (
	"context"

	"github.com/jmoiron/sqlx"
)

type PhotoRepo struct {
	db *sqlx.DB
}

func NewPhotoRepo(db *sqlx.DB) *PhotoRepo {
	return &PhotoRepo{db: db}
}

func (r *PhotoRepo) Add(ctx context.Context, listingID, url string, isMain bool) error {
	_, err := r.db.ExecContext(ctx,
		"INSERT INTO listing_photos (listing_id, url, is_main) VALUES ($1, $2, $3)",
		listingID, url, isMain,
	)
	return err
}

func (r *PhotoRepo) GetByListingID(ctx context.Context, listingID string) ([]string, error) {
	var urls []string
	err := r.db.SelectContext(ctx,
		&urls, "SELECT url FROM listing_photos WHERE listing_id = $1 ORDER BY is_main DESC", listingID,
	)
	return urls, err
}

func (r *PhotoRepo) Delete(ctx context.Context, listingID, url string) error {
	_, err := r.db.ExecContext(ctx,
		"DELETE FROM listing_photos WHERE listing_id = $1 AND url = $2", listingID, url,
	)
	return err
}