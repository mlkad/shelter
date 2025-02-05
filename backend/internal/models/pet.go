package models

type Pet struct {
	ID          int    `json:"ID"`
	Name        string `json:"Name"`
	Description string `json:"Description"`
	IsBooked    bool   `json:"is_booked"`
}
