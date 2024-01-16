import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../libs/mongodb';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import Cors from 'cors';
import runMiddleware from '@/libs/runMiddleware';

// Define a type for the user object
type User = {
    id: ObjectId;
    username: string;
    password: string;
};

// Define a type for the request body
type LoginRequest = {
    username: string;
    password: string;
};

const cors = Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ['GET', 'POST', 'OPTIONS'],
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Only allow POST requests

    await runMiddleware(req, res, cors);

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests allowed' });
    }

    // Connect to the database
    const client = await clientPromise;
    const db = client.db("Spak");
    const collection = db.collection<User>("user");

    // Fetch all users (consider using a more efficient query in a real-world application)
    const users = await collection.find({}).toArray();

    // Extract username and password from request body
    const { username, password } = req.body as LoginRequest;

    // Find the user with the provided credentials
    const user = users.find(u => u.username === username && u.password === password);

    // Generate a token if the user is found
    if (user) {

        try {
            //const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET as string, { expiresIn: '10h' });
            const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET as string);
            return res.status(200).json({ token, user: user });
        } catch (err) {
            if (err instanceof Error) {
                res.status(500).json({ error: err.message });
            } else {
                res.status(500).json({ error: 'An unknown error occurred' });
            }
        }


    } else {
        // Handle invalid credentials        
        return res.status(401).json({ message: 'Invalid credentials' });
    }
}
