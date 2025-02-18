package donations

import (
	"shelter/internal/models"
	"shelter/internal/repository/donations"
)

type Donations interface {
	CreateDonation(donation models.Donation) error
	GetDonations() ([]models.Donation, error)
}

type DonationsService struct {
	repo donations.Donations
}

func NewDonationsService(repo donations.Donations) *DonationsService {
	return &DonationsService{
		repo: repo,
	}
}

func (s *DonationsService) CreateDonation(donation models.Donation) error {
	return s.repo.CreateDonation(donation)
}

func (s *DonationsService) GetDonations() ([]models.Donation, error) {
	return s.repo.GetDonations()
}
