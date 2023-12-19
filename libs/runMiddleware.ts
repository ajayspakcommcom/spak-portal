import { NextApiRequest, NextApiResponse } from 'next';

// Define a generic type for the middleware function
type Middleware = (req: NextApiRequest, res: NextApiResponse, next: (result: any) => void) => void;

export default function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: Middleware) {
    return new Promise<void>((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
}
