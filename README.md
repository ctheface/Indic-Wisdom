# Indic Wisdom

A modern web application that brings ancient Indian wisdom from the Bhagavad Gita to the digital age, featuring AI-powered insights and an interactive user interface.

## Features

- **Wisdom Cards**: Browse through verses from the Bhagavad Gita with original Sanskrit text and English translations
- **AI Insights**: Get modern interpretations and insights for each verse powered by Google's Gemini AI
- **Like System**: Save your favorite verses for future reference
- **Infinite Scroll**: Seamlessly discover new verses as you scroll

## Tech Stack

- **Frontend**: React.js with Vite
- **Styling**: Bootstrap 5 + Custom CSS
- **Database**: Supabase (with CSV fallback)
- **AI Integration**: Google Gemini API
- **Backend**: Node.js with Express

## Data Source Configuration

The backend supports toggling between Supabase and CSV file as the data source. This is useful when Supabase free tier is disabled or unavailable.

### Using CSV File

Set the `USE_CSV` environment variable to `true`:

```bash
USE_CSV=true
```

When enabled, the server will read from `wisdom_posts_rows.csv` in the root directory instead of Supabase.

### Using Supabase (Default)

Leave `USE_CSV` unset or set to `false`:

```bash
USE_CSV=false
# or simply don't set it
```

### Automatic Fallback

If Supabase is configured but fails (e.g., free tier disabled), the server will automatically fall back to the CSV file if available.

### Environment Variables

```bash
# Data source toggle (optional, defaults to Supabase)
USE_CSV=true  # or false

# Supabase configuration (required if USE_CSV=false)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_key

# Gemini API (required for AI insights)
GEMINI_API_KEY=your_gemini_api_key

# Server port (optional, defaults to 5000)
PORT=5000
```

## Running Locally

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Gemini API key (for AI insights feature)

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
# Backend API URL (for frontend to connect to backend)
VITE_API_URL=http://localhost:5000

# Data source toggle (optional, defaults to Supabase)
USE_CSV=true  # Set to true to use CSV file, false for Supabase

# Supabase configuration (required if USE_CSV=false)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_key

# Gemini API (required for AI insights)
GEMINI_API_KEY=your_gemini_api_key

# Backend server port (optional, defaults to 5000)
PORT=5000
```

**Note**: For local development with CSV, you only need:
- `VITE_API_URL=http://localhost:5000`
- `USE_CSV=true`
- `GEMINI_API_KEY=your_key` (if you want AI insights)

### Step 3: Run the Backend Server

Open a terminal and run:

```bash
# Run backend server (with auto-reload on changes)
npm run server:dev

# Or run without auto-reload
npm run server
```

The backend will start on `http://localhost:5000` (or the port specified in your `.env` file).

### Step 4: Run the Frontend

Open a **new terminal** and run:

```bash
npm run dev
```

The frontend will start on `http://localhost:5173` (Vite's default port).

### Step 5: Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

### Quick Start (Using CSV - No Supabase Required)

For the quickest local setup without Supabase:

1. Create `.env` file:
```bash
VITE_API_URL=http://localhost:5000
USE_CSV=true
GEMINI_API_KEY=your_gemini_api_key
```

2. Run backend:
```bash
npm run server:dev
```

3. Run frontend (in another terminal):
```bash
npm run dev
```

### Troubleshooting

- **Backend not starting**: Make sure port 5000 (or your configured port) is not already in use
- **Frontend can't connect to backend**: Verify `VITE_API_URL` in `.env` matches your backend URL
- **CSV file not found**: Ensure `wisdom_posts_rows.csv` is in the root directory
- **AI insights not working**: Check that `GEMINI_API_KEY` is set correctly

## Deployment

- **Frontend**: [https://indic-wisdom.vercel.app](https://indic-wisdom.vercel.app)
- **Backend**: [https://indic-wisdom-backend.onrender.com](https://indic-wisdom-backend.onrender.com)




