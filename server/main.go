package main

import (
	"log"
	"net/http"
)

func main() {
	mux := http.NewServeMux()

	// Routes API
	mux.HandleFunc("/sendmail", sendMailRoute)
	mux.HandleFunc("/getcarrouselimages", getCarouselItemsRoute)

	// Servir les fichiers statiques
	fs := http.FileServer(http.Dir("./home"))
	mux.Handle("/", fs)

	// Appliquer le middleware de logging
	handler := LoggingMiddleware(mux)

	log.Println("Serveur démarré sur http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
