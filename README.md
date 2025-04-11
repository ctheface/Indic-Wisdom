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
- **Database**: Supabase
- **AI Integration**: Google Gemini API
- **Backend**: Node.js with Express

## Getting Started

1. **Clone the repository**
```bash
git clone https://github.com/ctheface/Indic-Wisdom.git
cd indic-wisdom
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env` file in the root directory with:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

4. **Start the development server**
```bash
npm run dev
```

5. **Start the backend server**
```bash
node src/server.js
```

## Project Structure

```
indic-wisdom/
├── src/
│   ├── components/
│   │   ├── WisdomCard.jsx
│   │   └── LikedWisdom.jsx
│   ├── pages/
│   │   └── About.jsx
│   ├── App.jsx
│   ├── index.css
│   └── server.js
├── public/
│   ├── blue-texture.jpg
│   ├── paper-texture.jpg
│   └── logo.png
└── bhagavad_gita_verses.csv
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Bhagavad Gita verses and translations
- Google Gemini API for AI insights
- Supabase for database management
- Bootstrap for UI components

