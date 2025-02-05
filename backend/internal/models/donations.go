package models

import "time"

type Donation struct {
	ID           int       `json:"id"`
	UserID       string    `json:"user_id"`
	DonationType string    `json:"donation_type"`
	Amount       int       `json:"amount"`
	CreatedAt    time.Time `json:"created_at"`
}
