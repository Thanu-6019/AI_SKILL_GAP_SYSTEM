import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Determine which MongoDB to use based on environment
    let mongoURI;
    let connectionType;

    // In production, always use Atlas
    if (process.env.NODE_ENV === 'production') {
      mongoURI = process.env.MONGO_URI_ATLAS || process.env.MONGO_URI;
      connectionType = 'MongoDB Atlas (Production)';
    } else {
      // In development, try local first, fallback to Atlas
      mongoURI = process.env.MONGO_URI_LOCAL || process.env.MONGO_URI;
      connectionType = mongoURI.includes('localhost') ? 'Local MongoDB (Development)' : 'MongoDB Atlas';
    }

    // Enhanced connection options
    const options = {
      serverSelectionTimeoutMS: 5000, // Fail fast in development
      socketTimeoutMS: 45000,
      family: 4, // Force IPv4
    };

    console.log(`🔄 Attempting connection to ${connectionType}...`);
    const conn = await mongoose.connect(mongoURI, options);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    
    // In development, suggest fallback
    if (process.env.NODE_ENV !== 'production' && error.message.includes('ECONNREFUSED')) {
      console.warn(`\n⚠️  Local MongoDB not available. To use MongoDB Atlas:`);
      console.warn(`   Set: MONGO_URI=${process.env.MONGO_URI_ATLAS || 'mongodb+srv://...'}`);
      console.warn(`   Or ensure local MongoDB is running: net start MongoDB\n`);
    } else {
      console.error(`\n🔍 Troubleshooting tips:`);
      console.error(`   1. Check MongoDB Atlas Network Access settings`);
      console.error(`   2. Verify IP address is whitelisted`);
      console.error(`   3. Ensure cluster is running (not paused)`);
      console.error(`   4. Verify credentials in .env file\n`);
    }
    
    process.exit(1);
  }
};

export default connectDB;
