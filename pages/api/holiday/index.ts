import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../libs/mongodb';
import { ObjectId } from 'mongodb';
import { verifyToken } from '../libs/verifyToken';
import runMiddleware from '@/libs/runMiddleware';
import Cors from 'cors';

type Holiday = { id: ObjectId; title: string; date: number; };

type ApiResponse = { message: string } | Holiday | Holiday[] | { data: any } | { error: string } | Document[];

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

      switch (req.body.type) {

        case 'LIST':
          try {

            if (req.body.firstDayOfMonth && req.body.lastDayOfMonth) {

              const client = await clientPromise;
              const db = client.db("Spak");
              const collection = db.collection<Holiday>("holiday");
              const data = await collection.find({
                date: {
                  $gte: req.body.firstDayOfMonth,
                  $lte: req.body.lastDayOfMonth
                }
              }).sort({ date: 1 }).toArray();

              res.status(200).json(data);

            } else if (req.body.firstDayOfYear && req.body.LastDayOfYear) {

              console.log('Year');


              const client = await clientPromise;
              const db = client.db("Spak");
              const collection = db.collection<Holiday>("holiday");
              const data = await collection.find({
                date: {
                  $gte: req.body.firstDayOfYear,
                  $lte: req.body.LastDayOfYear
                }
              }).sort({ date: 1 }).toArray();

              res.status(200).json(data);

            } else {

              console.log('not filter');

              const client = await clientPromise;
              const db = client.db("Spak");
              const collection = db.collection<Holiday>("holiday");
              const data = await collection.find({}).sort({ date: 1 }).toArray();
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
            const collection = db.collection<Holiday>("holiday");
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
            const collection = db.collection<Holiday>("holiday");
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
            const collection = db.collection<Holiday>("holiday");
            const result = await collection.replaceOne({ _id: new ObjectId(req.body.id) }, req.body);
            res.status(200).json({ data: result });
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
            const collection = db.collection<Holiday>("holiday");
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
