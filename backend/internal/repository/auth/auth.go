package auth

import (
	"database/sql"
	"fmt"
	"shelter/internal/models"
)

type AuthRepo struct {
	DB *sql.DB
}

func NewAuthRepo(db *sql.DB) *AuthRepo {
	return &AuthRepo{
		DB: db,
	}
}

type Authorization interface {
	CreateUser(user models.User) error
	GetUserByEmail(email string) (*models.User, error)
}

func (auth *AuthRepo) CreateUser(user models.User) error {
	query := `INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)`
	_, err := auth.DB.Exec(query, user.Username, user.Email, user.Password, "user")
	if err != nil {
		return fmt.Errorf("unable to create user: %w", err)
	}
	return nil
}

func (auth *AuthRepo) GetUserByEmail(email string) (*models.User, error) {
	query := `SELECT ID, username, email, password, role FROM users WHERE email = $1`
	row := auth.DB.QueryRow(query, email)
	var user models.User
	if err := row.Scan(&user.ID, &user.Username, &user.Email, &user.Password, &user.Role); err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("user not found")
		}
		return nil, err
	}
	return &user, nil
}
