const webPush = require('web-push');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const publicVapidKey = 'YOUR_PUBLIC_VAPID_KEY';
const privateVapidKey = 'YOUR_PRIVATE_VAPID_KEY';

webPush.setVapidDetails(
    'mailto:your-email@example.com',
    publicVapidKey,
    privateVapidKey
);

app.post('/subscribe', (req, res) => {
    const subscription = req.body;

    const payload = JSON.stringify({
        title: 'Push Notification Title',
        body: 'This is the body of the notification',
        icon: '/path/to/icon.png',
        url: 'https://example.com',
    });

    webPush.sendNotification(subscription, payload)
        .then(() => res.status(200).json({ message: 'Notification sent successfully!' }))
        .catch(error => {
            console.error('Error sending notification:', error);
            res.sendStatus(500);
        });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
