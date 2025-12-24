package main

import "net/http"

type EmailRequest struct {
	Name    string `json:"name"`
	Surname string `json:"surname"`
	Email   string `json:"email"`
	Message string `json:"message"`
}

type EmailResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

type ImageInfo struct {
	Name string `json:"name"`
	Path string `json:"path"`
	Size int64  `json:"size"`
}

type responseWriter struct {
	http.ResponseWriter
	statusCode int
}

type EmailConfig struct {
	From         string
	To           string
	SmtpServer   string
	SmtpUser     string
	SmtpPassword string
	SmtpPort     int
}
