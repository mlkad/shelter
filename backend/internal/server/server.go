package server

import (
	"fmt"
	"net/http"

	"shelter/internal/storage"
	"shelter/logger"
	"shelter/pkg/config"

	"shelter/internal/handlers"
	"shelter/internal/repository"
	"shelter/internal/service"
)

type App struct {
	cfg config.Config
}

func NewApp(cfg config.Config) *App {
	return &App{cfg: cfg}
}

func (app *App) Run() error {
	logger := logger.NewLogger()

	db, err := storage.NewPostgresDB(app.cfg)
	if err != nil {
		return err
	}
	logger.Info("Database successfully connected!")

	repo := repository.NewRepository(db)

	logger.Info("Repository working...")

	service := service.NewService(repo)

	logger.Info("Service working...")

	handler := handlers.NewHandler(service)

	logger.Info("Handler working...")

	logger.Info("Server successfully started!")
	fmt.Printf("Server running on http://localhost:%v\n", app.cfg.Port)

	return http.ListenAndServe(":"+app.cfg.Port, handler.Router())

}
