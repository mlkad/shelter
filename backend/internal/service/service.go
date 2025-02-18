package service

import (
	repo "shelter/internal/repository"
	"shelter/internal/repository/donations"
	"shelter/internal/repository/pet"
	authService "shelter/internal/service/auth"
	donationsService "shelter/internal/service/donations"
	petService "shelter/internal/service/pet"
)

type Service struct {
	authService.Auth
	pet.Pet
	donations.Donations
}

func NewService(repo *repo.Repository) *Service {

	return &Service{
		Auth:      authService.NewAuthService(repo.Authorization),
		Pet:       petService.NewPetService(repo.Pet),
		Donations: donationsService.NewDonationsService(repo.Donations),
	}
}
