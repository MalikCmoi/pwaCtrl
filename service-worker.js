
import {precacheAndRoute} from 'workbox-precaching';

precacheAndRoute(self.__WB_MANIFEST);

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

workbox.routing.registerRoute(
  ({ request }) => request.destination === 'image',
  new workbox.strategies.CacheFirst()
);

workbox.routing.registerRoute(
  ({ request }) => request.destination === 'script' || request.destination === 'style',
  new workbox.strategies.StaleWhileRevalidate()
);

workbox.routing.registerRoute(
  ({ request }) => request.mode === 'navigate',
  new workbox.strategies.StaleWhileRevalidate()
);

precacheAndRoute([
    { url: '/index.html', revision: '3' },
    { url: '/index.js', revision: '2' },
    { url: './styles/styles.css', revision: '2' },
    { url: './assets/icons/icon.png', revision: '2' },
    { url: './assets/nike1.jpeg', revision: '2' },
    { url: './assets/nike2.jpeg', revision: '2' },
    { url: './assets/nike3.jpeg', revision: '2' },
    { url: './assets/nike4.jpeg', revision: '2' },
    { url: './assets/nike5.jpeg', revision: '2' },
    { url: './assets/nike6.jpeg', revision: '2' }
    // Ajoutez d'autres fichiers selon vos besoins
  ]);



// Register event listener for the 'push' event.
self.addEventListener('push', function(event) {
    // Vérifier si le payload est présent dans l'événement push
    let data = {};
    if (event.data) {
        data = event.data.json();  // Parse le payload JSON envoyé par le serveur
    }

    // Définit les options de la notification
    const title = data.title || 'Nouvelle notification';
    const options = {
        body: data.message || 'Vous avez reçu une notification push.',
        icon: data.icon || '/images/notification-icon.png', // URL d’une icône de notification (facultatif)
        badge: data.badge || '/images/notification-badge.png', // URL d’un badge de notification (facultatif)
        data: {
            url: data.url || '/'  // Lien à ouvrir lors d'un clic
        }
    };

    // Affiche la notification
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});