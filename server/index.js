import express from 'express';
import bodyParser from "body-parser";
import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import 'dotenv/config';
import cors from 'cors';

// Initialize Express app
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Initialize Firebase Admin with Service Account
const serviceAccount = JSON.parse(readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, 'utf-8'));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

app.get('/api/users', async (req, res) => {
try {
    const listUsersResult = await admin.auth().listUsers();
    res.json(listUsersResult.users);
} catch (error) {
    console.log('Failed Server response');
    res.status(500).json({ error: error.message });
}
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
