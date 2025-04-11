import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";

// Load environment variables
dotenv.config();

// Debugging: Check if environment variables are loaded
console.log("Supabase URL:", process.env.VITE_SUPABASE_URL);
console.log("Supabase Key:", process.env.VITE_SUPABASE_KEY);

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Supabase client
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_KEY);

// Middleware
app.use(cors({
  origin: ['https://indic-wisdom.vercel.app', 'http://localhost:5173'], // Add your Vercel URL
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(bodyParser.json());

// Route to handle Gemini API requests
app.post("/api/insight", async (req, res) => {
  const { post } = req.body;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Provide a concise insight on this Sanskrit verse and its translation: Sanskrit: ${post.sanskrit}, Translation: ${post.translation}`,
                },
              ],
            },
          ],
          generationConfig: {
            maxOutputTokens: 150,
            temperature: 0.7,
          },
        }),
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching insight:", error);
    res.status(500).json({ error: "Failed to fetch insight" });
  }
});

// Route to fetch posts
app.get("/api/posts", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("wisdom_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});