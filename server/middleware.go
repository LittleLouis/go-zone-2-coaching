package main

import (
	"log"
	"net/http"
	"time"
)

func LoggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		// Log de la requête entrante
		log.Printf("[REQUEST] %s %s", r.Method, r.URL.Path)

		// Créer un wrapper pour capturer le status code
		wrapper := &responseWriter{ResponseWriter: w, statusCode: http.StatusOK}

		// Appeler le handler suivant
		next.ServeHTTP(wrapper, r)

		// Log de la réponse
		duration := time.Since(start)
		log.Printf("[RESPONSE] %s %s - Status: %d - Durée: %v",
			r.Method, r.URL.Path, wrapper.statusCode, duration)
	})
}
