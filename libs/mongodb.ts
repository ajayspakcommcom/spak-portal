import { MongoClient, MongoClientOptions } from 'mongodb';

// Define the type for the global variable in development mode
declare global {
    var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Retrieve the MongoDB URI from the environment variables
const uri = process.env.MONGODB_URI;

// Specify MongoClient options
const options: MongoClientOptions = {};

// Declare the client and clientPromise variables
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Ensure the MongoDB URI is provided
if (!uri) {
    throw new Error('Please add your Mongo URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

export default clientPromise;