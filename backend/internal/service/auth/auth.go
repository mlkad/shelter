package auth

import (
	"fmt"
	"shelter/internal/models"
	"shelter/internal/repository/auth"
	"time"

	"github.com/dgrijalva/jwt-go"
)

type Auth interface {
	CreateUser(user models.User) error
	ValidateJWT(tokenString string) (*Claims, error)
	GenerateJWT(user models.User) (string, error)
	GetUserByEmail(email string) (*models.User, error)
}

type AuthService struct {
	repo auth.Authorization
}

func NewAuthService(repo auth.Authorization) *AuthService {
	return &AuthService{
		repo: repo,
	}
}

var jwtKey = []byte("your_secret_key")

func (s *AuthService) CreateUser(user models.User) error {

	return s.repo.CreateUser(user)
}

type Claims struct {
	UserID   int    `json:"user_id"`
	Username string `json:"username"`
	Role     string `json:"role"`
	jwt.StandardClaims
}

func (s *AuthService) GenerateJWT(user models.User) (string, error) {
	claims := &Claims{
		UserID:   user.ID,
		Username: user.Username,
		Role:     user.Role,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(24 * time.Hour).Unix(),
			Issuer:    "shelter-app",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		return "", fmt.Errorf("failed to generate token: %w", err)
	}

	return tokenString, nil
}

func (s *AuthService) ValidateJWT(tokenString string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	if err != nil {
		return nil, fmt.Errorf("failed to parse token: %w", err)
	}

	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return claims, nil
	}
	return nil, fmt.Errorf("invalid token")
}

func (s *AuthService) GetUserByEmail(email string) (*models.User, error) {
	return s.repo.GetUserByEmail(email)
}
