package pet

import (
	"database/sql"
	"fmt"
	"shelter/internal/models"
)

type PetRepo struct {
	DB *sql.DB
}

func NewPetRepo(db *sql.DB) *PetRepo {
	return &PetRepo{
		DB: db,
	}
}

type Pet interface {
	CreatePet(user models.Pet) error
	UpdatePetDescription(petID int, description string) error
	DeletePet(petID int) error
	GetAllPets() ([]models.Pet, error)
	BookPet(petID int) error
}

func (r *PetRepo) CreatePet(pet models.Pet) error {
	query := `INSERT INTO pets (name, description) VALUES ($1, $2)`
	_, err := r.DB.Exec(query, pet.Name, pet.Description)
	if err != nil {
		return fmt.Errorf("failed to create pet: %w", err)
	}
	return nil
}

func (r *PetRepo) UpdatePetDescription(petID int, description string) error {
	query := `UPDATE pets SET description = $1 WHERE id = $2`
	_, err := r.DB.Exec(query, description, petID)
	if err != nil {
		return fmt.Errorf("failed to update pet description: %w", err)
	}
	return nil
}

func (r *PetRepo) DeletePet(petID int) error {
	query := `DELETE FROM pets WHERE id = $1`
	_, err := r.DB.Exec(query, petID)
	if err != nil {
		return fmt.Errorf("failed to delete pet: %w", err)
	}
	return nil
}

func (r *PetRepo) GetAllPets() ([]models.Pet, error) {
	query := `SELECT id, name, description, is_booked FROM pets`
	rows, err := r.DB.Query(query)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch pets: %w", err)
	}
	defer rows.Close()

	var pets []models.Pet
	for rows.Next() {
		var pet models.Pet
		if err := rows.Scan(&pet.ID, &pet.Name, &pet.Description, &pet.IsBooked); err != nil {
			return nil, fmt.Errorf("failed to scan pet: %w", err)
		}
		pets = append(pets, pet)
	}

	return pets, nil
}

func (r *PetRepo) BookPet(petID int) error {
	query := `UPDATE pets SET is_booked = true WHERE id = $1 AND is_booked = false`
	result, err := r.DB.Exec(query, petID)
	if err != nil {
		return fmt.Errorf("failed to book pet: %w", err)
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return fmt.Errorf("pet already booked or not found")
	}

	return nil
}
