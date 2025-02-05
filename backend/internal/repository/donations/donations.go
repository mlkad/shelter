package donations

import (
	"database/sql"
	"fmt"
	"shelter/internal/models"
)

type DonationsRepo struct {
	DB *sql.DB
}

func NewDonationsRepo(db *sql.DB) *DonationsRepo {
	return &DonationsRepo{
		DB: db,
	}
}

type Donations interface {
	CreateDonation(donation models.Donation) error
	GetDonations() ([]models.Donation, error)
}

func (r *DonationsRepo) CreateDonation(donation models.Donation) error {
	query := `INSERT INTO donations (user_id, donation_type, amount) VALUES ($1, $2, $3)`
	_, err := r.DB.Exec(query, donation.UserID, donation.DonationType, donation.Amount)
	if err != nil {
		return fmt.Errorf("failed to insert donation: %w", err)
	}
	return nil
}

func (r *DonationsRepo) GetDonations() ([]models.Donation, error) {
	query := `SELECT ID, user_id, donation_type, amount, created_at FROM donations`
	rows, err := r.DB.Query(query)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch donations: %w", err)
	}
	defer rows.Close()

	var donations []models.Donation
	for rows.Next() {
		var donation models.Donation
		if err := rows.Scan(&donation.ID, &donation.UserID, &donation.DonationType, &donation.Amount, &donation.CreatedAt); err != nil {
			return nil, err
		}
		donations = append(donations, donation)
	}

	return donations, nil
}
