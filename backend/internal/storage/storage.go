package storage

import (
	"database/sql"
	"log"

	_ "github.com/lib/pq" // PostgreSQL драйвер

	"shelter/pkg/config"
)

func NewPostgresDB(config config.Config) (*sql.DB, error) {
	dbURL := "postgres://postgres:522057@localhost:5433/shelter?sslmode=disable"
	if dbURL == "" {
		dbURL = config.DSN
	}

	log.Printf("Connecting to database: %s", dbURL)

	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Printf("Failed to open database: %v", err)
		return nil, err
	}

	if err = db.Ping(); err != nil {
		log.Printf("Failed to connect to database: %v", err)
		return nil, err
	}

	// Создаем таблицы
	if err = CreateTables(db); err != nil {
		log.Printf("Failed to create tables: %v", err)
		return nil, err
	}

	log.Println("Database successfully connected and initialized")
	return db, nil
}

// Функция для создания таблиц
func CreateTables(db *sql.DB) error {
	schema := `
	CREATE TABLE IF NOT EXISTS users (
	    id SERIAL PRIMARY KEY,
	    username TEXT NOT NULL,
	    email TEXT NOT NULL UNIQUE,
	    password TEXT NOT NULL,
	    role TEXT NOT NULL DEFAULT 'user'
	);

	CREATE TABLE IF NOT EXISTS pets (
	    id SERIAL PRIMARY KEY,
	    name TEXT NOT NULL,
	    description TEXT NOT NULL,
	    is_booked BOOLEAN NOT NULL DEFAULT false
	);

	CREATE TABLE IF NOT EXISTS donations (
	    id SERIAL PRIMARY KEY,
	    user_id INTEGER NOT NULL REFERENCES users(id),
	    donation_type TEXT NOT NULL,
	    amount INTEGER NOT NULL CHECK(amount > 0),
	    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);`

	_, err := db.Exec(schema)
	return err
}
