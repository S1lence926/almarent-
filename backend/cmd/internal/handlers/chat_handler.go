package handlers

import (
	"net/http"

	"almarent/internal/repository"

	"github.com/gin-gonic/gin"
)

type ChatHandler struct {
	repo        *repository.ChatRepo
	listingRepo *repository.ListingRepo
}

func NewChatHandler(repo *repository.ChatRepo, listingRepo *repository.ListingRepo) *ChatHandler {
	return &ChatHandler{repo: repo, listingRepo: listingRepo}
}

func (h *ChatHandler) StartChat(c *gin.Context) {
	var input struct {
		ListingID string `json:"listing_id" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID := c.GetString("user_id")

	listing, err := h.listingRepo.GetByID(c.Request.Context(), input.ListingID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "объявление не найдено"})
		return
	}

	if listing.OwnerID == userID {
		c.JSON(http.StatusBadRequest, gin.H{"error": "нельзя написать самому себе"})
		return
	}

	chat, err := h.repo.GetOrCreate(c.Request.Context(), userID, listing.OwnerID, listing.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, chat)
}

func (h *ChatHandler) GetMyChats(c *gin.Context) {
	userID := c.GetString("user_id")
	chats, err := h.repo.GetByUser(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, chats)
}

func (h *ChatHandler) GetMessages(c *gin.Context) {
	chatID := c.Param("id")
	messages, err := h.repo.GetMessages(c.Request.Context(), chatID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, messages)
}

func (h *ChatHandler) SendMessage(c *gin.Context) {
	chatID := c.Param("id")
	userID := c.GetString("user_id")

	var input struct {
		Content string `json:"content" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	msg, err := h.repo.AddMessage(c.Request.Context(), chatID, userID, input.Content)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, msg)
}