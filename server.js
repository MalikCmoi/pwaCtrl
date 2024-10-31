  // Use the web-push library to hide the implementation details of the communication
  // between the application server and the push service.
  // For details, see https://tools.ietf.org/html/draft-ietf-webpush-protocol and
  // https://tools.ietf.org/html/draft-ietf-webpush-encryption.
  const webPush = require("web-push");
  const fs = require('fs');
  const express = require('express');
  const mysql = require('mysql2');

  const app = express();
  const port = process.env.PORT || 3000;
  app.use(express.json()); 
  app.use(express.static('public'));

  require('dotenv').config();
  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    console.log(
      "You must set the VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY " +
        "environment variables. You can use the following ones:"
    );
    console.log(webPush.generateVAPIDKeys());
    return;
  }
  // Set the keys used for encrypting the push messages.
  webPush.setVapidDetails(
    "https://localhost:3000/",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );

  // Configuration de la connexion MySQL
  const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',     // Remplacez par votre nom d'utilisateur MySQL
    password: '',     // Remplacez par votre mot de passe MySQL
    database: 'wpa'       // Remplacez par le nom de votre base de données
  });


  db.connect((err) => {
    if (err) {
      console.error('Erreur de connexion à la base de données:', err);
      return;
    }
    console.log('Connecté à la base de données MySQL');
  });


  app.get('/jobs', (req, res) => {
    const sql = 'SELECT * FROM job';  // Requête pour obtenir toutes les offres d'emploi
  
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Erreur lors de la récupération des offres d\'emploi:', err);
        res.status(500).json({ error: 'Erreur serveur' });
        return;
      }
      res.json(results); // Renvoie les données en JSON
    });
  });


  app.get("/vapidPublicKey", function (req, res) {
    res.send(process.env.VAPID_PUBLIC_KEY);
  });

  app.post("/register", function (req, res) {
    // A real world application would store the subscription info.
    console.log(req.body)
    res.sendStatus(201);
  });


  app.post("/sendNotification", function (req, res) {
    const subscription = req.body.subscription;
    const payload = JSON.stringify({
      title: "Notification de test",
      message: "Ceci est un exemple de notification push.",
      url: "https://example.com/notification"
  });
  
  const options = {
      TTL: 3600  // Durée de vie en secondes (ici, 1 heure)
  };
    console.log("Is right")
    console.log(req.body)
    setTimeout(function () {
      webPush
        .sendNotification(subscription, payload, options)
        .then(function () {

          res.sendStatus(201);
        })
        .catch(function (error) {
          console.log(error);
          res.sendStatus(500);
        });
    }, req.body.delay * 1000);
  });

  module.exports = function (app, route) {
   
  };

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
