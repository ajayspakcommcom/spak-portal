// pages/api/logout.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import runMiddleware from '@/libs/runMiddleware';

const cors = Cors({
    methods: ['POST', 'OPTIONS'], // Restrict to POST and OPTIONS
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await runMiddleware(req, res, cors);

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests allowed' });
    }

    try {
        // Clear the cookie or token here
        // Example: Clear a cookie named 'token'
        res.setHeader('Set-Cookie', 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT');

        // Optionally, add a response message
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
}
