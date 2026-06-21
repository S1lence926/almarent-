package repository

import (
	"context"

	"almarent/internal/models"

	"github.com/jmoiron/sqlx"
)

type ChatRepo struct {
	db *sqlx.DB
}

func NewChatRepo(db *sqlx.DB) *ChatRepo {
	return &ChatRepo{db: db}
}

func (r *ChatRepo) GetOrCreate(ctx context.Context, tenantID, landlordID, listingID string) (*models.Chat, error) {
	chat := &models.Chat{}
	err := r.db.GetContext(ctx, chat,
		"SELECT * FROM chats WHERE tenant_id=$1 AND landlord_id=$2 AND listing_id=$3",
		tenantID, landlordID, listingID,
	)
	if err == nil {
		return chat, nil
	}

	err = r.db.QueryRowxContext(ctx,
		`INSERT INTO chats (tenant_id, landlord_id, listing_id) VALUES ($1,$2,$3) RETURNING *`,
		tenantID, landlordID, listingID,
	).StructScan(chat)
	return chat, err
}

func (r *ChatRepo) GetByUser(ctx context.Context, userID string) ([]models.Chat, error) {
	var chats []models.Chat
	err := r.db.SelectContext(ctx, &chats,
		"SELECT * FROM chats WHERE tenant_id=$1 OR landlord_id=$1 ORDER BY created_at DESC", userID)
	return chats, err
}

func (r *ChatRepo) GetByID(ctx context.Context, id string) (*models.Chat, error) {
	chat := &models.Chat{}
	err := r.db.GetContext(ctx, chat, "SELECT * FROM chats WHERE id=$1", id)
	return chat, err
}

func (r *ChatRepo) AddMessage(ctx context.Context, chatID, senderID, content string) (*models.Message, error) {
	msg := &models.Message{}
	err := r.db.QueryRowxContext(ctx,
		`INSERT INTO messages (chat_id, sender_id, content) VALUES ($1,$2,$3) RETURNING *`,
		chatID, senderID, content,
	).StructScan(msg)
	return msg, err
}

func (r *ChatRepo) GetMessages(ctx context.Context, chatID string) ([]models.Message, error) {
	var messages []models.Message
	err := r.db.SelectContext(ctx, &messages,
		"SELECT * FROM messages WHERE chat_id=$1 ORDER BY created_at ASC", chatID)
	return messages, err
}