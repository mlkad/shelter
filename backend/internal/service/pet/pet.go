package pet

import (
	"shelter/internal/models"
	"shelter/internal/repository/pet"
)

type Pet interface {
	CreatePet(pet models.Pet) error
	UpdatePetDescription(petID int, description string) error
	DeletePet(petID int) error
	GetAllPets() ([]models.Pet, error)
	BookPet(petID int) error
}

type PetService struct {
	repo pet.Pet
}

func NewPetService(repo pet.Pet) *PetService {
	return &PetService{
		repo: repo,
	}
}

func (s *PetService) CreatePet(pet models.Pet) error {
	return s.repo.CreatePet(pet)
}

func (s *PetService) UpdatePetDescription(petID int, description string) error {
	return s.repo.UpdatePetDescription(petID, description)
}

func (s *PetService) DeletePet(petID int) error {
	return s.repo.DeletePet(petID)
}

func (s *PetService) GetAllPets() ([]models.Pet, error) {
	return s.repo.GetAllPets()
}

func (s *PetService) BookPet(petID int) error {
	return s.repo.BookPet(petID)
}
