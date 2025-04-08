import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// OAuth Token Exchange Endpoint
app.post("/auth/token", async (req, res) => {
  const { code } = req.body;

  console.log("🔐 Received authorization code:", code);
  console.log("🔧 Env values being used:");
  console.log("CLIENT_ID:", process.env.CLIENT_ID);
  console.log("CLIENT_SECRET:", process.env.CLIENT_SECRET);
  console.log("REDIRECT_URI:", process.env.REDIRECT_URI);

  if (!code || !process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.REDIRECT_URI) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    const response = await axios.post("https://todoist.com/oauth/access_token", {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code: code,
      redirect_uri: process.env.REDIRECT_URI,
    });

    const access_token = response.data.access_token;
    console.log("✅ Access token received:", access_token);

    res.json({ access_token });
  } catch (err) {
    console.error("❌ Error exchanging code with Todoist:");
    console.error(err.response?.data || err.message);

    res.status(500).json({ error: err.response?.data || "Failed to exchange code" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
