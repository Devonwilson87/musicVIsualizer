const express = require("express");
const cors = require("cors");
const path = require("path");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for your frontend domain
app.use(cors({ origin: "https://cnnrclvll.github.io/musicVisualizer/" }));
// use assets
app.use(express.static(path.join(__dirname, "../assets")));

// Spotify API Proxy Route
app.get("/api/spotify-data", async (req, res) => {
    const SPOTIFY_API_URL = `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchInputSg)}&type=track`;
    const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

    try {
        const response = await fetch(SPOTIFY_API_URL, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
        });

        if (!ACCESS_TOKEN) {
            return res.status(400).json({ error: "Access Token Error."})
        }

        if (!response.ok) {
            return res.status(response.status).json({ error: "Failed to fetch data from Spotify API" });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error fetching Spotify API data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));