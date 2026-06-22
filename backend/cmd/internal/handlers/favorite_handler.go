package handlers

import (
	"net/http"

	"almarent/internal/repository"

	"github.com/gin-gonic/gin"
)

type FavoriteHandler struct {
	repo        *repository.FavoriteRepo
	listingRepo *repository.ListingRepo
}

func NewFavoriteHandler(repo *repository.FavoriteRepo, listingRepo *repository.ListingRepo) *FavoriteHandler {
	return &FavoriteHandler{repo: repo, listingRepo: listingRepo}
}

func (h *FavoriteHandler) Add(c *gin.Context) {
	userID := c.GetString("user_id")
	listingID := c.Param("id")

	if err := h.repo.Add(c.Request.Context(), userID, listingID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "added"})
}

func (h *FavoriteHandler) Remove(c *gin.Context) {
	userID := c.GetString("user_id")
	listingID := c.Param("id")

	if err := h.repo.Remove(c.Request.Context(), userID, listingID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "removed"})
}

func (h *FavoriteHandler) GetMyFavorites(c *gin.Context) {
	userID := c.GetString("user_id")
	listings, err := h.repo.GetByUser(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if listings == nil {
    c.JSON(http.StatusOK, []map[string]interface{}{})
    return
}
}

func (h *FavoriteHandler) Check(c *gin.Context) {
	userID := c.GetString("user_id")
	listingID := c.Param("id")
	isFav, err := h.repo.IsFavorite(c.Request.Context(), userID, listingID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"is_favorite": isFav})
}