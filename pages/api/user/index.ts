import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../libs/mongodb';
import { ObjectId } from 'mongodb';
import { verifyToken } from '../libs/verifyToken';


// Define a type for the user object
type User = { id: ObjectId; name: string; age: number; };

// Define a type for the API response in various cases
type ApiResponse = | { message: string } | User | User[] | { data: any } | { error: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {

  console.log(req.query);


  const user = verifyToken(req);

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  } else {

    switch (req.method) {
      case 'GET':
        if (req.body.getById) {
          try {
            const client = await clientPromise;
            const db = client.db("user");
            const collection = db.collection<User>("users");
            const item = await collection.findOne({ _id: new ObjectId(req.body.getById) });

            if (!item) {
              return res.status(404).json({ message: 'Item not found' });
            }

            res.status(200).json(item);
          } catch (err) {
            if (err instanceof Error) {
              // Now TypeScript knows err is an Error and has a message property
              res.status(500).json({ error: err.message });
            } else {
              // Handle the case where the error is not an Error object
              res.status(500).json({ error: 'An unknown error occurred' });
            }
          }
        } else {
          try {
            const client = await clientPromise;
            const db = client.db("user");
            const collection = db.collection<User>("users");
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
        }
        break;

      case 'POST':
        try {
          const client = await clientPromise;
          const db = client.db("user");
          const collection = db.collection<User>("users");
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
          const db = client.db("user");
          const collection = db.collection<User>("users");
          const result = await collection.updateOne({ _id: new ObjectId(req.body.id) }, { $set: { name: req.body.name, age: req.body.age } });
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
          const db = client.db("user");
          const collection = db.collection<User>("users");
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
