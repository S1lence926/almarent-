package repository

import (
	"context"
	"fmt"
	"github.com/jmoiron/sqlx"
	"almarent/internal/models"
)

type ListingRepo struct {
	db *sqlx.DB
}

func NewListingRepo(db *sqlx.DB) *ListingRepo {
	return &ListingRepo{db: db}
}

type ListingFilter struct {
	District     string
	PriceMin     float64
	PriceMax     float64
	Rooms        int
	HasFurniture *bool
	HasWifi      *bool
	SortBy       string // price_asc, price_desc, newest
}

func (r *ListingRepo) GetAll(ctx context.Context, f ListingFilter) ([]models.Listing, error) {
	query := "SELECT * FROM listings WHERE is_active = true"
	args := []interface{}{}
	i := 1

	if f.District != "" {
		query += fmt.Sprintf(" AND district = $%d", i)
		args = append(args, f.District)
		i++
	}
	if f.PriceMin > 0 {
		query += fmt.Sprintf(" AND price >= $%d", i)
		args = append(args, f.PriceMin)
		i++
	}
	if f.PriceMax > 0 {
		query += fmt.Sprintf(" AND price <= $%d", i)
		args = append(args, f.PriceMax)
		i++
	}
	if f.Rooms > 0 {
		query += fmt.Sprintf(" AND rooms = $%d", i)
		args = append(args, f.Rooms)
		i++
	}

	switch f.SortBy {
	case "price_asc":
		query += " ORDER BY price ASC"
	case "price_desc":
		query += " ORDER BY price DESC"
	default:
		query += " ORDER BY created_at DESC"
	}

	var listings []models.Listing
	err := r.db.SelectContext(ctx, &listings, query, args...)
	return listings, err
}

func (r *ListingRepo) GetByID(ctx context.Context, id string) (*models.Listing, error) {
	listing := &models.Listing{}
	err := r.db.GetContext(ctx, listing, "SELECT * FROM listings WHERE id = $1", id)
	return listing, err
}

func (r *ListingRepo) Create(ctx context.Context, l *models.Listing) (*models.Listing, error) {
	query := `INSERT INTO listings (owner_id, title, description, price, district, address, rooms, floor, has_furniture, has_wifi, has_washer)
	          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
	          RETURNING *`
	result := &models.Listing{}
	err := r.db.QueryRowxContext(ctx, query,
		l.OwnerID, l.Title, l.Description, l.Price,
		l.District, l.Address, l.Rooms, l.Floor,
		l.HasFurniture, l.HasWifi, l.HasWasher,
	).StructScan(result)
	return result, err
}

func (r *ListingRepo) Update(ctx context.Context, l *models.Listing) error {
	_, err := r.db.ExecContext(ctx, `UPDATE listings SET title=$1, description=$2, price=$3, district=$4,
	address=$5, rooms=$6, floor=$7, has_furniture=$8, has_wifi=$9, has_washer=$10, updated_at=NOW()
	WHERE id=$11 AND owner_id=$12`,
		l.Title, l.Description, l.Price, l.District,
		l.Address, l.Rooms, l.Floor, l.HasFurniture,
		l.HasWifi, l.HasWasher, l.ID, l.OwnerID)
	return err
}

func (r *ListingRepo) Delete(ctx context.Context, id, ownerID string) error {
	_, err := r.db.ExecContext(ctx, "UPDATE listings SET is_active=false WHERE id=$1 AND owner_id=$2", id, ownerID)
	return err
}