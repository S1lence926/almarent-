package handlers

import (
	"net/http"
	"time"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"almarent/internal/models"
	"almarent/internal/repository"
)

type AuthHandler struct {
	userRepo  *repository.UserRepo
	jwtSecret string
}

func NewAuthHandler(userRepo *repository.UserRepo, jwtSecret string) *AuthHandler {
	return &AuthHandler{userRepo: userRepo, jwtSecret: jwtSecret}
}

func (h *AuthHandler) Register(c *gin.Context) {
	var input struct {
		Name     string      `json:"name" binding:"required"`
		Email    string      `json:"email" binding:"required,email"`
		Password string      `json:"password" binding:"required,min=6"`
		Role     models.Role `json:"role" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	hash, _ := bcrypt.GenerateFromPassword([]byte(input.Password), 12)

	user, err := h.userRepo.Create(c.Request.Context(), &models.User{
		Name:         input.Name,
		Email:        input.Email,
		PasswordHash: string(hash),
		Role:         input.Role,
	})
	if err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": "email already exists"})
		return
	}

	token := h.generateToken(user)
	c.JSON(http.StatusCreated, gin.H{"token": token, "user": user})
}

func (h *AuthHandler) Login(c *gin.Context) {
	var input struct {
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := h.userRepo.FindByEmail(c.Request.Context(), input.Email)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(input.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		return
	}

	token := h.generateToken(user)
	c.JSON(http.StatusOK, gin.H{"token": token, "user": user})
}

func (h *AuthHandler) generateToken(user *models.User) string {
	claims := jwt.MapClaims{
		"user_id": user.ID,
		"role":    user.Role,
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
	}
	token, _ := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte(h.jwtSecret))
	return token
}