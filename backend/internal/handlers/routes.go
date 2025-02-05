package handlers

import (
	"net/http"
)

func (h *Handler) Router() http.Handler {
	mux := http.NewServeMux()

	mux.Handle("/pets", h.AuthMiddleware(h.RoleMiddleware("admin")(http.HandlerFunc(h.CreatePet))))
	mux.Handle("/pets/update", h.AuthMiddleware(h.RoleMiddleware("admin")(http.HandlerFunc(h.UpdatePetDescription))))
	mux.Handle("/pets/delete", h.AuthMiddleware(h.RoleMiddleware("admin")(http.HandlerFunc(h.DeletePet))))

	mux.Handle("/pets/book", h.AuthMiddleware(http.HandlerFunc(h.BookPet)))
	mux.Handle("/pets/view", h.AuthMiddleware(http.HandlerFunc(h.GetAllPets)))
	mux.Handle("/donate", h.AuthMiddleware(http.HandlerFunc(h.CreateDonation)))
	mux.Handle("/donate/view", h.AuthMiddleware(http.HandlerFunc(h.GetDonations)))

	mux.HandleFunc("/login", h.LoginHandler)
	mux.HandleFunc("/register", h.CreateUser)

	return h.AllHandler(mux)
}
