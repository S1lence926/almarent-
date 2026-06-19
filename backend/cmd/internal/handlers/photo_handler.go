package handlers

import (
	"net/http"

	"almarent/internal/repository"

	"github.com/gin-gonic/gin"
)

type PhotoHandler struct {
	repo *repository.PhotoRepo
}

func NewPhotoHandler(repo *repository.PhotoRepo) *PhotoHandler {
	return &PhotoHandler{repo: repo}
}

func (h *PhotoHandler) Add(c *gin.Context) {
	var input struct {
		URL    string `json:"url" binding:"required"`
		IsMain bool   `json:"is_main"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	listingID := c.Param("id")
	if err := h.repo.Add(c.Request.Context(), listingID, input.URL, input.IsMain); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "added"})
}

func (h *PhotoHandler) GetByListing(c *gin.Context) {
	listingID := c.Param("id")
	urls, err := h.repo.GetByListingID(c.Request.Context(), listingID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, urls)
}