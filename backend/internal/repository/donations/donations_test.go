package donations_test

import (
	"shelter/internal/models"
	"shelter/internal/repository/donations"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/stretchr/testify/assert"
)

func TestCreateDonation(t *testing.T) {
	mockDB, mock, _ := sqlmock.New()
	defer mockDB.Close()

	donationRepo := donations.NewDonationsRepo(mockDB)
	donation := models.Donation{
		UserID:       "1",
		DonationType: "money",
		Amount:       100,
	}

	mock.ExpectExec("INSERT INTO donations").
		WithArgs(donation.UserID, donation.DonationType, donation.Amount).
		WillReturnResult(sqlmock.NewResult(1, 1))

	err := donationRepo.CreateDonation(donation)
	assert.NoError(t, err)
}

func TestGetDonations(t *testing.T) {
	mockDB, mock, _ := sqlmock.New()
	defer mockDB.Close()

	donationRepo := donations.NewDonationsRepo(mockDB)

	rows := sqlmock.NewRows([]string{"id", "user_id", "donation_type", "amount", "created_at"}).
		AddRow(1, "1", "money", 100, "2025-02-05 12:00:00")

	mock.ExpectQuery("SELECT id, user_id, donation_type, amount, created_at FROM donations").WillReturnRows(rows)

	donations, err := donationRepo.GetDonations()
	assert.NoError(t, err)
	assert.Len(t, donations, 1)
}
