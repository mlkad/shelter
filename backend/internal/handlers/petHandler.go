package handlers

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"

	"shelter/internal/models"
)

func (h *Handler) CreatePet(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	r.ParseMultipartForm(5 << 20)

	name := r.FormValue("name")
	description := r.FormValue("description")

	file, handler, err := r.FormFile("image")
	if err != nil {
		http.Error(w, "Invalid image file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	filePath := "uploads/" + handler.Filename
	outFile, err := os.Create(filePath)
	if err != nil {
		http.Error(w, "Failed to save image", http.StatusInternalServerError)
		return
	}
	defer outFile.Close()

	if _, err := io.Copy(outFile, file); err != nil {
		http.Error(w, "Failed to save image", http.StatusInternalServerError)
		return
	}

	pet := models.Pet{
		Name:        name,
		Description: description,
		ImageURL:    filePath,
	}

	if err := h.service.CreatePet(pet); err != nil {
		log.Fatal(err)
		http.Error(w, "Failed to create pet", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	w.Write([]byte("Pet created successfully"))
}

func (h *Handler) UpdatePetDescription(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPatch {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	petID, err := strconv.Atoi(r.URL.Query().Get("id"))
	if err != nil {
		http.Error(w, "Invalid pet ID", http.StatusBadRequest)
		return
	}

	var request struct {
		Description string `json:"description"`
	}
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "Invalid JSON body", http.StatusBadRequest)
		return
	}

	if err := h.service.UpdatePetDescription(petID, request.Description); err != nil {
		http.Error(w, "Failed to update pet description", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Pet description updated successfully"))
}

func (h *Handler) UpdateImageURL(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPatch {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	petID, err := strconv.Atoi(r.URL.Query().Get("id"))
	if err != nil {
		http.Error(w, "Invalid pet ID", http.StatusBadRequest)
		return
	}

	var request struct {
		ImageURL string `json:"image_url"`
	}
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "Invalid JSON body", http.StatusBadRequest)
		return
	}

	if err := h.service.UpdatePetDescription(petID, request.ImageURL); err != nil {
		http.Error(w, "Failed to update pet description", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Pet description updated successfully"))
}

func (h *Handler) DeletePet(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	petID, err := strconv.Atoi(r.URL.Query().Get("id"))
	if err != nil {
		http.Error(w, "Invalid pet ID", http.StatusBadRequest)
		return
	}

	if err := h.service.DeletePet(petID); err != nil {
		http.Error(w, "Failed to delete pet", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Pet deleted successfully"))
}

func (h *Handler) GetAllPets(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	pets, err := h.service.GetAllPets()
	if err != nil {
		log.Fatal(err)
		http.Error(w, "Failed to fetch pets", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(pets)
}

func (h *Handler) BookPet(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	petID, err := strconv.Atoi(r.URL.Query().Get("id"))
	if err != nil {
		http.Error(w, "Invalid pet ID", http.StatusBadRequest)
		return
	}

	if err := h.service.BookPet(petID); err != nil {
		http.Error(w, err.Error(), http.StatusConflict)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Pet booked successfully"))
}
