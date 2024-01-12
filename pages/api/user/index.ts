import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../libs/mongodb';
import { ObjectId } from 'mongodb';
import { verifyToken } from '../libs/verifyToken';
import runMiddleware from '@/libs/runMiddleware';
import Cors from 'cors';

type User = { id: ObjectId; firstName: string; lastName: string; username: string; password: string; imgUrl: string; date: Date, designation: string };

type ApiResponse = | { message: string } | User | User[] | { data: any } | { error: string };

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

    if (req.method === 'POST') {

      console.log(req.method);


      switch (req.body.type) {

        case 'LIST':
          try {

            if (req.body.userList === 'Task') {
              const client = await clientPromise;
              const db = client.db("Spak");
              const collection = db.collection<User>("user");
              const data = await collection.find({}, {
                projection: {
                  _id: 1, username: 1, name: {
                    $concat: [{ $substrBytes: ["$firstName", 0, 1] }, '.', "$lastName"]
                  }
                }
              }).toArray();
              res.status(200).json(data);
            } else {
              const client = await clientPromise;
              const db = client.db("Spak");
              const collection = db.collection<User>("user");
              const data = await collection.find({}).toArray();
              res.status(200).json(data);
            }
          }
          catch (err) {
            if (err instanceof Error) {
              res.status(500).json({ error: err.message });
            } else {
              res.status(500).json({ error: 'An unknown error occurred' });
            }
          }
          break;

        case 'DETAIL':
          const { id } = req.body;
          try {
            const client = await clientPromise;
            const db = client.db("Spak");
            const collection = db.collection<User>("user");
            const item = await collection.findOne({ _id: new ObjectId(id?.toString()) });

            if (!item) {
              return res.status(404).json({ message: 'Item not found' });
            }

            res.status(200).json(item);
          } catch (err) {
            if (err instanceof Error) {
              res.status(500).json({ error: err.message });
            } else {
              res.status(500).json({ error: 'An unknown error occurred' });
            }
          }
          break;

        case 'CREATE':
          try {
            const client = await clientPromise;
            const db = client.db("Spak");
            const collection = db.collection<User>("user");
            const result = await collection.insertOne(req.body);
            res.status(200).json({ data: result });
          } catch (err) {
            if (err instanceof Error) {
              res.status(500).json({ error: err.message });
            } else {
              res.status(500).json({ error: 'An unknown error occurred' });
            }
          }
          break;

        case 'UPDATE':
          try {
            const client = await clientPromise;
            const db = client.db("Spak");
            const collection = db.collection<User>("user");
            //const result = await collection.replaceOne({ _id: new ObjectId(req.body.id) }, req.body);

            const result = await collection.updateOne(
              { _id: new ObjectId(req.body.id) },
              {
                $set: {
                  firstName: req.body.firstName,
                  lastName: req.body.lastName,
                  password: req.body.password,
                  imgUrl: req.body.imgUrl,
                  date: req.body.date,
                  designation: req.body.designation,
                  doj: req.body.doj,
                  uploadDocument: req.body.uploadDocument
                }
              }
            );


            const updatedItem = await collection.findOne({ _id: new ObjectId(req.body._id) });

            res.status(200).json({ data: updatedItem });
          } catch (err) {
            if (err instanceof Error) {
              res.status(500).json({ error: err.message });
            } else {
              res.status(500).json({ error: 'An unknown error occurred' });
            }
          }
          break;

        case 'DELETE':
          try {
            const client = await clientPromise;
            const db = client.db("Spak");
            const collection = db.collection<User>("user");
            const result = await collection.deleteOne({ _id: new ObjectId(req.body.id) });
            res.status(200).json({ data: result });
          } catch (err) {
            if (err instanceof Error) {
              res.status(500).json({ error: err.message });
            } else {
              res.status(500).json({ error: 'An unknown error occurred' });
            }
          }
          break;

        default:
          res.status(500).json({ data: '' });
      }


    }

    res.status(500).json({ data: 'Not Data Found' });

  }
}
