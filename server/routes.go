package main

import (
	"encoding/json"
	"log"
	"net/http"
)

func sendMailRoute(w http.ResponseWriter, r *http.Request) {
	var emailReq EmailRequest

	err := json.NewDecoder(r.Body).Decode(&emailReq)
	if err != nil {
		http.Error(w, "Données invalides", http.StatusBadRequest)
		return
	}

	log.Printf("Email reçu de: %s (%s) - Message: %s",
		emailReq.Name, emailReq.Email, emailReq.Message)

	response, err := sendMail(emailReq)
	if err != nil {
		log.Printf("Erreur send mail: %e", err)
		http.Error(w, "Erreur lors de l'envoi du mail", http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	err2 := json.NewEncoder(w).Encode(response)
	if err2 != nil {
		http.Error(w, "Erreur lors de l'encodage des données", http.StatusInternalServerError)
		return
	}
}

func getCarouselItemsRoute(w http.ResponseWriter, r *http.Request) {
	items, err := getCarouselItems()
	if err != nil {
		http.Error(w, "Erreur lors de la récupération des images du carroussel", http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	err2 := json.NewEncoder(w).Encode(items)
	if err2 != nil {
		http.Error(w, "Erreur lors de l'encodage des données", http.StatusInternalServerError)
		return
	}
}
