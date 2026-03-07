import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cathy-decor';

    const connection = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB connected: ${connection.connection.host}`);
    console.log(`📊 Database: ${connection.connection.name}`);

    return connection;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Disconnect from database (for testing or cleanup)
export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('✅ MongoDB disconnected');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error.message);
  }
};

// Get database stats
export const getDBStats = async () => {
  try {
    const stats = await mongoose.connection.db.stats();
    return {
      databases: stats.databases,
      dataSize: `${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`,
      indexes: stats.indexes,
      collections: stats.collections
    };
  } catch (error) {
    console.error('Error getting DB stats:', error.message);
    return null;
  }
};

// Drop database (use with caution - only for development)
export const dropDatabase = async () => {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Cannot drop database in production');
  }

  try {
    await mongoose.connection.dropDatabase();
    console.log('⚠️ Database dropped');
  } catch (error) {
    console.error('Error dropping database:', error.message);
  }
};

// Connection event handlers
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('🔴 Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose disconnected from MongoDB');
});

// Handle process termination
process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});
