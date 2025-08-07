import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Charge les variables d'environnement
dotenv.config();

// Fonction de test de connexion et d'envoi de l'email
async function testEmail() {
  try {
    // Vérifie que les variables sont chargées correctement
    console.log("GMAIL_USER:", process.env.GMAIL_USER);
    console.log("GMAIL_APP_PASSWORD:", process.env.GMAIL_APP_PASSWORD);

    // Crée un transporteur avec les informations d'identification
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,  // Assure-toi que ce mot de passe d'application est valide
      },
    });

    // Vérification de la connexion
    await transporter.verify();
    console.log('Connexion réussie à Gmail ✅');

    // Envoi d'un test d'email
    const mailOptions = {
      from: process.env.GMAIL_USER,  // Expéditeur (ton email)
      to: 'destinataire@example.com',  // Remplace par un vrai destinataire
      subject: 'Test Email Nodemailer',
      text: 'Ceci est un test d\'envoi d\'email avec Nodemailer.',
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email envoyé : ', info.response);
  } catch (error) {
    console.error('Erreur de connexion ou d\'envoi d\'email :', error);
  }
}

// Appelle la fonction pour tester
testEmail();