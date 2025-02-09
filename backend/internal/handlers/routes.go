package handlers

import (
	"net/http"
)

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func (h *Handler) Router() http.Handler {
	mux := http.NewServeMux()

	mux.Handle("/pets", h.AuthMiddleware(h.RoleMiddleware("admin")(http.HandlerFunc(h.CreatePet))))
	mux.Handle("/pets/update/description", h.AuthMiddleware(h.RoleMiddleware("admin")(http.HandlerFunc(h.UpdatePetDescription))))
	mux.Handle("/pets/update/image", h.AuthMiddleware(h.RoleMiddleware("admin")(http.HandlerFunc(h.UpdatePetDescription))))
	mux.Handle("/pets/delete", h.AuthMiddleware(h.RoleMiddleware("admin")(http.HandlerFunc(h.DeletePet))))

	mux.Handle("/pets/book", h.AuthMiddleware(http.HandlerFunc(h.BookPet)))
	mux.Handle("/pets/view", h.AuthMiddleware(http.HandlerFunc(h.GetAllPets)))
	mux.Handle("/donate", h.AuthMiddleware(http.HandlerFunc(h.CreateDonation)))
	mux.Handle("/donate/view", h.AuthMiddleware(http.HandlerFunc(h.GetDonations)))

	mux.HandleFunc("/login", h.LoginHandler)
	mux.HandleFunc("/register", h.CreateUser)

	return enableCORS(mux)
}
