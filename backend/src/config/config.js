// Configuration settings for the application

const config = {
  // Server configuration
  server: {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  
  // MongoDB configuration
  mongo: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/content-idea-generator',
  },
  
  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_dev_only',
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  },
  
  // OpenAI configuration
  openai: {
    apiKey: process.env.OPENAI_API_KEY || 'your_openai_key_here',
    model: process.env.OPENAI_MODEL || 'gpt-4',
    maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 1500,
  },
  
  // CORS configuration
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
  
  // Email configuration
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM || 'noreply@contentideagenerator.com',
  },
};

module.exports = config;