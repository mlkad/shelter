package main

import (
	"log"
	"shelter/internal/server"
	"shelter/pkg/config"
)

func main() {

	config, err := config.NewConfig()

	if err != nil {
		log.Println(err)
	}

	app := server.NewApp(*config)
	if err := app.Run(); err != nil {
		log.Println(err)
		return
	}

}
