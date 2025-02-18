package repository

import (
	"database/sql"
	"shelter/internal/repository/auth"
	"shelter/internal/repository/donations"
	"shelter/internal/repository/pet"
)

type Repository struct {
	auth.Authorization
	pet.Pet
	donations.Donations
}

func NewRepository(db *sql.DB) *Repository {
	return &Repository{
		Authorization: auth.NewAuthRepo(db),
		Pet:           pet.NewPetRepo(db),
		Donations:     donations.NewDonationsRepo(db),
	}
}
