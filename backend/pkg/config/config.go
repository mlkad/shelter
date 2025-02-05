package config

import (
	"encoding/json"
	"log"
	"os"
)

type Config struct {
	Host     string `json:"Host"`
	Port     string `json:"Port"`
	Driver   string `json:"Driver"`
	DSN      string `json:"DSN"`
	Database string `json:"Database"`
}

func NewConfig() (*Config, error) {
	configFilePath := "pkg/config/config.json"

	data, err := os.ReadFile(configFilePath)
	if err != nil {
		log.Printf("ERROR: Read file in config encountered problem: %v", err)
		return nil, err
	}

	var config Config
	if err := json.Unmarshal(data, &config); err != nil {
		log.Printf("ERROR: Unmarshalling in config encountered problem: %v", err)
		return nil, err
	}
	return &config, nil
}
