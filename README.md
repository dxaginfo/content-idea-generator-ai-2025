# AI Content Idea Generator

An AI-powered web application for generating creative, engaging, and optimized content ideas for blogs, videos, and social media posts.

## Overview

The AI Content Idea Generator helps content creators, marketers, and social media managers generate fresh, relevant, and engaging content ideas tailored to their industry, audience, and goals. Leveraging advanced AI technology, the application analyzes trending topics, researches keywords, and suggests optimized content ideas that resonate with target audiences.

## Features

- **AI-Powered Idea Generation**: Generate creative content ideas for blogs, videos, and social media
- **Industry-Specific Suggestions**: Tailored ideas based on your industry and niche
- **Trending Topic Analysis**: Incorporate current trends into your content strategy
- **Keyword Optimization**: SEO-friendly content ideas with relevant keywords
- **Content Calendar Planning**: Schedule and organize your content strategy
- **Analytics & Performance Prediction**: Get insights on potential engagement and performance

## Technology Stack

### Frontend
- React.js with TypeScript
- Material-UI for responsive design
- Redux for state management
- Axios for API requests

### Backend
- Node.js with Express.js
- MongoDB for data storage
- OpenAI API integration
- JWT authentication

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- MongoDB
- OpenAI API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/dxaginfo/content-idea-generator-ai-2025.git
cd content-idea-generator-ai-2025
```

2. Install dependencies
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Set up environment variables
```bash
# Create .env file in the backend directory
touch backend/.env

# Add the following variables to the .env file
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
PORT=5000
```

4. Start the development servers
```bash
# Start backend server
cd backend
npm run dev

# Start frontend server (in a new terminal)
cd frontend
npm start
```

5. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
content-idea-generator-ai-2025/
├── frontend/                # React frontend application
│   ├── public/              # Public assets
│   ├── src/                 # Source files
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── redux/           # Redux state management
│   │   ├── services/        # API services
│   │   ├── styles/          # CSS and styled components
│   │   └── utils/           # Utility functions
│   └── package.json         # Frontend dependencies
│
├── backend/                 # Node.js backend application
│   ├── src/                 # Source files
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utility functions
│   │   └── app.js           # Express application
│   └── package.json         # Backend dependencies
│
├── .gitignore               # Git ignore file
└── README.md                # Project documentation
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for providing the AI capabilities
- The open-source community for the amazing tools and libraries used in this project