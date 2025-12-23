import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Supabase client with proper error handling
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Error: Supabase credentials are missing!");
  console.error("Please set VITE_SUPABASE_URL and VITE_SUPABASE_KEY environment variables");
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Route to handle Gemini API requests
app.post("/api/insight", async (req, res) => {
  const { post } = req.body;

  if (!post || !post.sanskrit || !post.translation) {
    return res.status(400).json({ error: "Invalid post data" });
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    console.error("Error: GEMINI_API_KEY is not set");
    return res.status(500).json({ error: "AI service is not configured. Please set GEMINI_API_KEY." });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
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

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Gemini API error:", response.status, errorData);
      return res.status(response.status).json({ 
        error: `AI service error: ${response.statusText}`,
        details: errorData 
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching insight:", error);
    res.status(500).json({ error: `Failed to fetch insight: ${error.message}` });
  }
});

// Route to fetch posts
app.get("/api/posts", async (req, res) => {
  try {
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: "Database connection not configured" });
    }

    const { data, error } = await supabase
      .from("wisdom_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    if (!data) {
      return res.status(404).json({ error: "No posts found" });
    }

    res.json(data);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: `Failed to fetch posts: ${error.message}` });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});