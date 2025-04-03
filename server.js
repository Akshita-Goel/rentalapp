const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));


const UserPreferencesSchema = new mongoose.Schema({
    user: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        moveInDate: { type: Date, required: true }
    },
    location: {
        city: { type: String, required: true },
        maxCommuteTime: { type: Number, required: true },
        commuteLocation: { type: String, required: false }
    },
    property: {
        type: { type: String, required: false },
        bedrooms: { type: Number, required: false },
        bathrooms: { type: Number, required: false },
        priceRange: {
            min: { type: Number, required: false },
            max: { type: Number, required: false }
        }
    },
    amenities: [{ type: String, required: false }]
});

const UserPreferences = mongoose.model('UserPreferences', UserPreferencesSchema);

// API to Retrieve Stored Preferences
app.get('/api/preferences', async (req, res) => {
    try {
        const preferences = await UserPreferences.find();
        res.json(preferences);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching preferences' });
    }
});

app.post('/api/preferences', async (req, res) => {
    try {
        console.log("Received Data:", req.body);
        const newPreferences = new UserPreferences(req.body);
       
        await newPreferences.save();

        console.log("Preferences Saved:", newPreferences);
        res.status(200).json({ message: "Preferences saved successfully!" });

    } catch (error) {
        console.error("Error saving preferences:", error);
        console.log(error);
        res.status(500).json({ error: "Failed to save preferences" });
    }
});

// Serve React frontend in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'public')));
    app.get('/*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
    });
}

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});