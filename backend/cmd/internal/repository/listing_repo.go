package repository

import (
	"context"
	"fmt"

	"almarent/internal/models"

	"github.com/jmoiron/sqlx"
)

type ListingRepo struct {
	db *sqlx.DB
}

func NewListingRepo(db *sqlx.DB) *ListingRepo {
	return &ListingRepo{db: db}
}

type ListingFilter struct {
	District string
	PriceMin float64
	PriceMax float64
	Rooms    int
	SortBy   string
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
	if err != nil {
		return nil, err
	}

	for i := range listings {
		photos, perr := r.getPhotos(ctx, listings[i].ID)
		if perr == nil {
			listings[i].Photos = photos
		}
	}

	return listings, nil
}

func (r *ListingRepo) GetByID(ctx context.Context, id string) (*models.Listing, error) {
	listing := &models.Listing{}
	err := r.db.GetContext(ctx, listing, "SELECT * FROM listings WHERE id = $1", id)
	if err != nil {
		return nil, err
	}

	photos, err := r.getPhotos(ctx, listing.ID)
	if err == nil {
		listing.Photos = photos
	}

	return listing, nil
}

func (r *ListingRepo) getPhotos(ctx context.Context, listingID string) ([]string, error) {
	var urls []string
	err := r.db.SelectContext(ctx, &urls,
		"SELECT url FROM listing_photos WHERE listing_id = $1 ORDER BY is_main DESC", listingID)
	return urls, err
}

func (r *ListingRepo) Create(ctx context.Context, l *models.Listing) (*models.Listing, error) {
	query := `INSERT INTO listings
	          (owner_id, title, description, price, district, address, rooms, floor, has_furniture, has_wifi, has_washer)
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
	_, err := r.db.ExecContext(ctx,
		`UPDATE listings SET title=$1, description=$2, price=$3, district=$4,
		 address=$5, rooms=$6, floor=$7, has_furniture=$8, has_wifi=$9,
		 has_washer=$10, updated_at=NOW()
		 WHERE id=$11 AND owner_id=$12`,
		l.Title, l.Description, l.Price, l.District,
		l.Address, l.Rooms, l.Floor,
		l.HasFurniture, l.HasWifi, l.HasWasher,
		l.ID, l.OwnerID,
	)
	return err
}

func (r *ListingRepo) Delete(ctx context.Context, id, ownerID string) error {
	_, err := r.db.ExecContext(ctx,
		"UPDATE listings SET is_active=false WHERE id=$1 AND owner_id=$2",
		id, ownerID,
	)
	return err
}
// Получить объявления пользователя (все статусы)
func (r *ListingRepo) GetByOwner(ctx context.Context, ownerID string) ([]models.Listing, error) {
	var listings []models.Listing
	err := r.db.SelectContext(ctx, &listings,
		"SELECT * FROM listings WHERE owner_id = $1 AND status != 'deleted' ORDER BY created_at DESC",
		ownerID,
	)
	if err != nil {
		return nil, err
	}
	for i := range listings {
		photos, _ := r.getPhotos(ctx, listings[i].ID)
		listings[i].Photos = photos
	}
	return listings, nil
}

// Архивировать объявление
func (r *ListingRepo) Archive(ctx context.Context, id, ownerID string) error {
	_, err := r.db.ExecContext(ctx,
		"UPDATE listings SET status='archived', is_active=false WHERE id=$1 AND owner_id=$2",
		id, ownerID,
	)
	return err
}

// Восстановить из архива
func (r *ListingRepo) Restore(ctx context.Context, id, ownerID string) error {
	_, err := r.db.ExecContext(ctx,
		"UPDATE listings SET status='active', is_active=true WHERE id=$1 AND owner_id=$2",
		id, ownerID,
	)
	return err
}

// Hard delete
func (r *ListingRepo) HardDelete(ctx context.Context, id, ownerID string) error {
	_, err := r.db.ExecContext(ctx,
		"UPDATE listings SET status='deleted', is_active=false WHERE id=$1 AND owner_id=$2",
		id, ownerID,
	)
	return err
}

// Для карты — все активные с координатами
func (r *ListingRepo) GetForMap(ctx context.Context) ([]models.Listing, error) {
	var listings []models.Listing
	err := r.db.SelectContext(ctx, &listings,
		"SELECT * FROM listings WHERE status='active' AND latitude IS NOT NULL AND longitude IS NOT NULL",
	)
	if err != nil {
		return nil, err
	}
	for i := range listings {
		photos, _ := r.getPhotos(ctx, listings[i].ID)
		listings[i].Photos = photos
	}
	return listings, nil
}