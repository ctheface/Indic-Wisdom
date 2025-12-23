import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parse } from "csv-parse/sync";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configuration: Toggle between Supabase and CSV
// Set USE_CSV=true to use CSV file, false or unset to use Supabase
const USE_CSV = process.env.USE_CSV === "true" || process.env.USE_CSV === "1";

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to CSV file (in root directory, one level up from src/)
const CSV_FILE_PATH = path.join(__dirname, "..", "wisdom_posts_rows.csv");

// Cache for CSV data
let csvDataCache = null;

// Initialize Supabase client with proper error handling
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_KEY || process.env.SUPABASE_KEY;

let supabase = null;
if (!USE_CSV) {
  if (!supabaseUrl || !supabaseKey) {
    console.warn("Warning: Supabase credentials are missing!");
    console.warn("Please set VITE_SUPABASE_URL and VITE_SUPABASE_KEY environment variables");
    console.warn("Falling back to CSV mode. Set USE_CSV=true to explicitly use CSV.");
  } else {
    supabase = createClient(supabaseUrl, supabaseKey);
  }
}

// Function to load and parse CSV data
const loadCSVData = () => {
  try {
    if (csvDataCache) {
      return csvDataCache;
    }

    if (!fs.existsSync(CSV_FILE_PATH)) {
      console.error(`Error: CSV file not found at ${CSV_FILE_PATH}`);
      return null;
    }

    const fileContent = fs.readFileSync(CSV_FILE_PATH, "utf-8");
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    // Sort by created_at descending (most recent first)
    records.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return dateB - dateA;
    });

    csvDataCache = records;
    console.log(`Loaded ${records.length} wisdom posts from CSV`);
    return records;
  } catch (error) {
    console.error("Error loading CSV data:", error);
    return null;
  }
};

// Log current data source on startup
if (USE_CSV) {
  console.log("📄 Using CSV file as data source (USE_CSV=true)");
  loadCSVData(); // Pre-load CSV data
} else {
  console.log("🗄️  Using Supabase as data source (USE_CSV=false or unset)");
}

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
    // Use gemini-2.5-flash directly
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;
    
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `Explain this verse from ${post.source || 'ancient Hindu scripture'} in clear, simple language that anyone can understand.

Sanskrit Verse: ${post.sanskrit}
English Translation: ${post.translation}
What it teaches: ${post.explanation || 'This verse contains important wisdom'}

Provide a straightforward explanation that:
- Explains what this verse actually means in plain English
- Breaks down any complex concepts into simple terms
- Shows how this teaching applies to everyday life
- Uses concrete examples when helpful
- Avoids flowery language or excessive formality - be direct and clear
- Do NOT use markdown formatting (no **, no *, no #, etc.) - write plain text only

Write 2-3 concise paragraphs. Focus on clarity and practical understanding, not poetic language. Use plain text only - no formatting symbols.`,
            },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: 5000,
        temperature: 0.8,
      },
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Gemini API error:", response.status, errorData);
      return res.status(response.status).json({ 
        error: "AI service is currently unavailable. Please try again later.",
        details: errorData 
      });
    }

    const data = await response.json();
    
    // Strip markdown formatting from the response text
    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content?.parts?.[0]?.text) {
      let text = data.candidates[0].content.parts[0].text;
      // Remove markdown bold (**text** or __text__)
      text = text.replace(/\*\*(.*?)\*\*/g, '$1');
      text = text.replace(/__(.*?)__/g, '$1');
      // Remove markdown italic (*text* or _text_)
      text = text.replace(/\*(.*?)\*/g, '$1');
      text = text.replace(/_(.*?)_/g, '$1');
      // Remove markdown headers (# Header)
      text = text.replace(/^#{1,6}\s+/gm, '');
      // Remove markdown code blocks
      text = text.replace(/```[\s\S]*?```/g, '');
      text = text.replace(/`([^`]+)`/g, '$1');
      
      data.candidates[0].content.parts[0].text = text;
    }
    
    res.json(data);
  } catch (error) {
    console.error("Error fetching insight:", error);
    res.status(500).json({ error: `Failed to fetch insight: ${error.message}` });
  }
});

// Route to fetch posts
app.get("/api/posts", async (req, res) => {
  try {
    // Use CSV if explicitly enabled
    if (USE_CSV) {
      const data = loadCSVData();
      if (!data || data.length === 0) {
        return res.status(404).json({ error: "No posts found in CSV file" });
      }
      return res.json(data);
    }

    // Try Supabase first
    if (supabase && supabaseUrl && supabaseKey) {
      try {
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

        return res.json(data);
      } catch (supabaseError) {
        console.error("Supabase request failed:", supabaseError);
        // Fallback to CSV if Supabase fails
        console.log("Falling back to CSV file...");
        const csvData = loadCSVData();
        if (csvData && csvData.length > 0) {
          return res.json(csvData);
        }
        throw supabaseError;
      }
    }

    // If Supabase is not configured, try CSV as fallback
    const csvData = loadCSVData();
    if (csvData && csvData.length > 0) {
      return res.json(csvData);
    }

    return res.status(500).json({ 
      error: "Database connection not configured. Neither Supabase nor CSV file is available." 
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: `Failed to fetch posts: ${error.message}` });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({ 
    message: "Indic Wisdom Backend API",
    dataSource: USE_CSV ? "CSV" : "Supabase",
    endpoints: {
      health: "/health",
      posts: "/api/posts",
      insight: "/api/insight (POST)"
    },
    timestamp: new Date().toISOString()
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ 
    error: "Route not found",
    path: req.path,
    method: req.method,
    availableEndpoints: ["/health", "/api/posts", "/api/insight"]
  });
});

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API endpoints available at: http://localhost:${PORT}/api/*`);
});