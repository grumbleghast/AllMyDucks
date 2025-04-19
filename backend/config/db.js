/**
 * Database connection configuration
 * Establishes and manages MongoDB connection using Mongoose
 */
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

/**
 * Attempts to load MongoDB connection string from compass-connections.json
 * Falls back to environment variable or default connection string
 * @returns {string} MongoDB connection string
 */
const getConnectionString = () => {
  try {
    // Path to compass-connections.json in project root
    const compassConfigPath = path.join(__dirname, '../../compass-connections.json');
    
    // Check if file exists
    if (fs.existsSync(compassConfigPath)) {
      // Read and parse the connections file
      const compassConfig = JSON.parse(fs.readFileSync(compassConfigPath, 'utf-8'));
      
      // Extract connection string from first connection if available
      if (compassConfig.connections && compassConfig.connections.length > 0) {
        const firstConnection = compassConfig.connections[0];
        if (firstConnection.connectionOptions && firstConnection.connectionOptions.connectionString) {
          console.log('Using connection string from compass-connections.json');
          return firstConnection.connectionOptions.connectionString;
        }
      }
    }
  } catch (error) {
    console.warn('Error reading compass-connections.json:', error.message);
  }
  
  // Fall back to environment variable or default
  return process.env.MONGODB_URI || 'mongodb://localhost:27017/todo-app';
};

/**
 * Connects to MongoDB using the connection string from config or environment
 * Includes error handling and connection status logging
 * @returns {Promise} Mongoose connection promise
 */
const connectDB = async () => {
  try {
    // Get connection string
    const connectionString = getConnectionString();
    
    // Connect to MongoDB
    const conn = await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Function to clear existing collections if specified in environment
    if (process.env.CLEAR_DB === 'true') {
      console.log('Clearing existing collections...');
      await clearCollections(conn);
    }
    
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

/**
 * Clears all collections in the connected database
 * @param {Object} conn - Mongoose connection object 
 */
const clearCollections = async (conn) => {
  try {
    const collections = await conn.connection.db.collections();
    
    for (let collection of collections) {
      await collection.deleteMany({});
      console.log(`Cleared collection: ${collection.collectionName}`);
    }
    
    console.log('All collections have been cleared.');
  } catch (error) {
    console.error(`Error clearing collections: ${error.message}`);
  }
};

module.exports = connectDB; 