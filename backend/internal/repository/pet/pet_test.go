package pet_test

import (
	"shelter/internal/models"
	"shelter/internal/repository/pet"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/stretchr/testify/assert"
)

func TestCreatePet(t *testing.T) {
	mockDB, mock, _ := sqlmock.New()
	defer mockDB.Close()

	petRepo := pet.NewPetRepo(mockDB)
	newPet := models.Pet{Name: "Buddy", Description: "Friendly dog"}

	mock.ExpectExec("INSERT INTO pets").
		WithArgs(newPet.Name, newPet.Description).
		WillReturnResult(sqlmock.NewResult(1, 1))

	err := petRepo.CreatePet(newPet)
	assert.NoError(t, err)
}

func TestGetAllPets(t *testing.T) {
	mockDB, mock, _ := sqlmock.New()
	defer mockDB.Close()

	petRepo := pet.NewPetRepo(mockDB)

	rows := sqlmock.NewRows([]string{"id", "name", "description", "is_booked"}).
		AddRow(1, "Buddy", "Friendly dog", false)

	mock.ExpectQuery("SELECT id, name, description, is_booked FROM pets").WillReturnRows(rows)

	pets, err := petRepo.GetAllPets()
	assert.NoError(t, err)
	assert.Len(t, pets, 1)
}
