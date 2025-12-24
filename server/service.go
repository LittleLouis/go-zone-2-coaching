package main

import (
	"crypto/tls"
	"fmt"
	"log"
	"net"
	"net/mail"
	"net/smtp"
	"os"
)

func sendMail(request EmailRequest) (EmailResponse, error) {
	var emailConfig = EmailConfig{
		From:         "Zone 2 coaching <bastien.guilbaud@gmail.com>",
		To:           "bastien.guilbaud@gmail.com",
		SmtpServer:   "smtp.gmail.com",
		SmtpUser:     "bastien.guilbaud@gmail.com",
		SmtpPassword: "pkbx ikbs gbpc zjvv",
		SmtpPort:     587,
	}

	from, err := mail.ParseAddress(emailConfig.From)
	if err != nil {
		return EmailResponse{}, fmt.Errorf("adresse from invalide: %w", err)
	}

	to, err := mail.ParseAddress(emailConfig.To)
	if err != nil {
		return EmailResponse{}, fmt.Errorf("adresse to invalide: %w", err)
	}

	replyTo, err := mail.ParseAddress(fmt.Sprintf("%s %s <%s>",
		request.Name,
		request.Surname,
		request.Email,
	))
	if err != nil {
		return EmailResponse{}, fmt.Errorf("adresse reply-to invalide: %w", err)
	}

	// Construction du message
	subject := fmt.Sprintf(
		"Zone 2 coaching - Demande de contacte %s %s",
		request.Name,
		request.Surname,
	)

	body := fmt.Sprintf(
		"%s\n\nEmail de l'expéditeur/trice: %s",
		request.Message,
		request.Email,
	)

	msg := []byte(
		fmt.Sprintf("From: %s\r\n", from.String()) +
			fmt.Sprintf("To: %s\r\n", to.String()) +
			fmt.Sprintf("Reply-To: %s\r\n", replyTo.String()) +
			fmt.Sprintf("Subject: %s\r\n", subject) +
			"Content-Type: text/plain; charset=\"UTF-8\"\r\n" +
			"\r\n" +
			body,
	)

	// Connexion SMTP avec STARTTLS
	addr := fmt.Sprintf("%s:%d", emailConfig.SmtpServer, emailConfig.SmtpPort)

	conn, err := net.Dial("tcp", addr)
	if err != nil {
		return EmailResponse{}, fmt.Errorf("connexion SMTP échouée: %w", err)
	}

	client, err := smtp.NewClient(conn, emailConfig.SmtpServer)
	if err != nil {
		return EmailResponse{}, fmt.Errorf("client SMTP invalide: %w", err)
	}
	defer client.Close()

	// STARTTLS explicite
	tlsConfig := &tls.Config{
		ServerName: emailConfig.SmtpServer,
	}

	if err := client.StartTLS(tlsConfig); err != nil {
		return EmailResponse{}, fmt.Errorf("STARTTLS échoué: %w", err)
	}

	// Authentification
	auth := smtp.PlainAuth(
		"",
		emailConfig.SmtpUser,
		emailConfig.SmtpPassword,
		emailConfig.SmtpServer,
	)

	if err := client.Auth(auth); err != nil {
		return EmailResponse{}, fmt.Errorf("auth SMTP échouée: %w", err)
	}

	// Envoi
	if err := client.Mail(from.Address); err != nil {
		return EmailResponse{}, err
	}

	if err := client.Rcpt(to.Address); err != nil {
		return EmailResponse{}, err
	}

	w, err := client.Data()
	if err != nil {
		return EmailResponse{}, err
	}

	_, err = w.Write(msg)
	if err != nil {
		return EmailResponse{}, err
	}

	err = w.Close()
	if err != nil {
		return EmailResponse{}, err
	}

	client.Quit()

	return EmailResponse{Status: "Email envoyé avec succès"}, nil
}

func getCarouselItems() ([]ImageInfo, error) {
	items := []ImageInfo{}

	folderPath := "./home/img/carrousel"

	entries, err := os.ReadDir(folderPath)
	if err != nil {
		log.Printf("Erreur lors de la récupération des informations du fichier: %v", err)
		return nil, fmt.Errorf("erreur lors de la récupération des informations du fichier: %v", err)
	}

	for _, e := range entries {
		info, err := e.Info()
		if err != nil {
			log.Printf("Erreur lors de la récupération des informations du fichier: %v", err)
			return nil, fmt.Errorf("erreur lors de la récupération des informations du fichier: %v", err)
		}

		items = append(items, ImageInfo{
			Name: e.Name(),
			Size: info.Size(),
			Path: "/img/carrousel/" + e.Name(),
		})
	}

	return items, nil
}
