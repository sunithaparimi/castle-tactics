// service-worker.js
self.addEventListener('push', function(event) {
    const options = {
        body: event.data.text(),
        icon: 'icon.png',  // Specify an icon for the notification
        badge: 'badge.png', // Specify a badge image for the notification
    };

    // Show the notification
    event.waitUntil(
        self.registration.showNotification('Castle Tactics', options)
    );
});

// Optional: Handle click events on the notification
self.addEventListener('notificationclick', function(event) {
    event.notification.close(); // Close the notification
    event.waitUntil(
        clients.openWindow('duringgame')  // Open your app or a specific page
    );
});
