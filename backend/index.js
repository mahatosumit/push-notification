const express = require('express');
const bodyParser = require('body-parser');
const webPush = require('web-push');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Replace with your generated VAPID keys
const publicVapidKey = 'BIhjnVd3imttnv0aCYKbhKjt6AxpfTCjpSWGmZmzwms40IG8A3AD0f19kFyGu9ift48reTFz2t88RDGnT2B-wNY';
const privateVapidKey = 'UVW481qQHGUhba6oKk_DrnCvXPKDTihzuwwXIH1wfq0';

webPush.setVapidDetails(
    'mailto:your-email@example.com', // Replace with your email
    publicVapidKey,
    privateVapidKey
);

const subscriptions = [];

// Endpoint to handle subscription
app.post('/subscribe', (req, res) => {
    const subscription = req.body;

    if (!subscription) {
        return res.status(400).send('Subscription data is required');
    }

    subscriptions.push(subscription);
    res.status(201).json({ message: 'Subscription received!' });
});

// Endpoint to send push notifications
app.post('/sendNotification', (req, res) => {
    const { title, body, icon, url } = req.body;

    if (!title || !body || !icon || !url) {
        return res.status(400).send('Notification payload is missing required fields');
    }

    const notificationPayload = {
        title,
        body,
        icon,
        url,
    };

    subscriptions.forEach(subscription => {
        webPush.sendNotification(subscription, JSON.stringify(notificationPayload))
            .catch(err => console.error('Error sending notification:', err));
    });

    res.status(200).send('Notification sent!');
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
