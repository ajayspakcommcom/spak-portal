import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../libs/mongodb';
import { ObjectId } from 'mongodb';
import { verifyToken } from '../libs/verifyToken';
import runMiddleware from '@/libs/runMiddleware';
import Cors from 'cors';

// Define a type for the user object
//type Task = { _id: ObjectId; name: string; age: number; };

type Task = {
  _id: ObjectId;
  clientName: string;
  username: string;
  taskName: string;
  taskDescription: string;
  startDate: Date;
  endDate: Date;
  status: string;
  deadLine: string;
  imageDataUrl: string;
};

// Define a type for the API response in various cases
type ApiResponse = | { message: string } | Task | Task[] | { data: any } | { error: string };

const cors = Cors({
  // Only allow requests with GET, POST and OPTIONS
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {

  await runMiddleware(req, res, cors);

  const user = verifyToken(req);

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  } else {

    switch (req.method) {
      case 'GET':
        try {
          const client = await clientPromise;
          const db = client.db("Spak");
          const collection = db.collection<Task>("task");
          const data = await collection.find({}).toArray();
          res.status(200).json(data);
        } catch (err) {
          if (err instanceof Error) {
            // Now TypeScript knows err is an Error and has a message property
            res.status(500).json({ error: err.message });
          } else {
            // Handle the case where the error is not an Error object
            res.status(500).json({ error: 'An unknown error occurred' });
          }
        }
        break;

      case 'POST':
        try {
          console.log('post');
          console.log(req.body);
          const client = await clientPromise;
          const db = client.db("Spak");
          const collection = db.collection<Task>("task");
          const result = await collection.insertOne(req.body);
          res.status(200).json({ data: result });
        } catch (err) {
          if (err instanceof Error) {
            // Now TypeScript knows err is an Error and has a message property
            res.status(500).json({ error: err.message });
          } else {
            // Handle the case where the error is not an Error object
            res.status(500).json({ error: 'An unknown error occurred' });
          }
        }
        break;

      case 'PUT':
        try {
          const client = await clientPromise;
          const db = client.db("Spak");
          const collection = db.collection<Task>("task");
          //const result = await collection.updateOne({ _id: new ObjectId(req.body.id) }, { $set: { name: req.body.name, age: req.body.age } });
          console.log('Update', req.body.id);
          const result = await collection.replaceOne({ _id: new ObjectId(req.body.id) }, req.body);
          res.status(200).json({ data: result });
        } catch (err) {
          if (err instanceof Error) {
            // Now TypeScript knows err is an Error and has a message property
            res.status(500).json({ error: err.message });
          } else {
            // Handle the case where the error is not an Error object
            res.status(500).json({ error: 'An unknown error occurred' });
          }
        }
        break;

      case 'DELETE':
        try {
          const client = await clientPromise;
          const db = client.db("Spak");
          const collection = db.collection<Task>("task");

          console.log(req.body.id);

          const result = await collection.deleteOne({ _id: new ObjectId(req.body.id) });
          res.status(200).json({ data: result });
        } catch (err) {
          if (err instanceof Error) {
            // Now TypeScript knows err is an Error and has a message property
            res.status(500).json({ error: err.message });
          } else {
            // Handle the case where the error is not an Error object
            res.status(500).json({ error: 'An unknown error occurred' });
          }
        }
        break;

      default:
        res.status(500).json({ data: '' });
    }

  }
}
