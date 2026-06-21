package handlers

import (
	"fmt"
	"net/http"
	"strconv"

	"almarent/internal/models"
	"almarent/internal/repository"

	"github.com/gin-gonic/gin"
)

type ListingHandler struct {
	repo *repository.ListingRepo
}

func NewListingHandler(repo *repository.ListingRepo) *ListingHandler {
	return &ListingHandler{repo: repo}
}

func (h *ListingHandler) GetAll(c *gin.Context) {
	filter := repository.ListingFilter{
		District: c.Query("district"),
		SortBy:   c.Query("sort"),
	}
	if v, err := strconv.ParseFloat(c.Query("price_min"), 64); err == nil {
		filter.PriceMin = v
	}
	if v, err := strconv.ParseFloat(c.Query("price_max"), 64); err == nil {
		filter.PriceMax = v
	}
	if v, err := strconv.Atoi(c.Query("rooms")); err == nil {
		filter.Rooms = v
	}

	listings, err := h.repo.GetAll(c.Request.Context(), filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, listings)
}

func (h *ListingHandler) GetByID(c *gin.Context) {
	listing, err := h.repo.GetByID(c.Request.Context(), c.Param("id"))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	c.JSON(http.StatusOK, listing)
}

func (h *ListingHandler) Create(c *gin.Context) {
	var input models.Listing
	if err := c.ShouldBindJSON(&input); err != nil {
		fmt.Println("BIND ERROR:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	input.OwnerID = c.GetString("user_id")

	listing, err := h.repo.Create(c.Request.Context(), &input)
	if err != nil {
		fmt.Println("CREATE LISTING ERROR:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, listing)
}

func (h *ListingHandler) Update(c *gin.Context) {
	var input models.Listing
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	input.ID = c.Param("id")
	input.OwnerID = c.GetString("user_id")

	if err := h.repo.Update(c.Request.Context(), &input); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "updated"})
}

func (h *ListingHandler) Delete(c *gin.Context) {
	if err := h.repo.Delete(c.Request.Context(), c.Param("id"), c.GetString("user_id")); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "deleted"})
}