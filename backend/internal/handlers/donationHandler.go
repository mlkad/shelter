package handlers

import (
	"encoding/json"
	"net/http"
	"shelter/internal/models"
)

func (h *Handler) CreateDonation(w http.ResponseWriter, r *http.Request) {

	userID := r.Header.Get("X-User-ID")
	if userID == "" {
		http.Error(w, "Unauthorized DSAD", http.StatusUnauthorized)
		return
	}

	var donation models.Donation
	if err := json.NewDecoder(r.Body).Decode(&donation); err != nil {
		http.Error(w, "Invalid JSON body", http.StatusBadRequest)
		return
	}

	donation.UserID = userID

	if err := h.service.CreateDonation(donation); err != nil {
		http.Error(w, "Failed to create donation", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	w.Write([]byte("Donation created successfully"))
}

func (h *Handler) GetDonations(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	donations, err := h.service.GetDonations()
	if err != nil {
		http.Error(w, "Failed to fetch donations", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(donations)
}
