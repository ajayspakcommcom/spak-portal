import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../libs/mongodb';
import { ObjectId } from 'mongodb';
import runMiddleware from '@/libs/runMiddleware';
import Cors from 'cors';

type Ucc = {
  _id: ObjectId;
  name: string;
  city: string;
  hospital: string;
  phone: string;
  twoRadio: string;
  threeRadio: string;
  fourRadio: string;
  fourText: string;
  sixRadio: string;
  sixText: string;
  sevenRadio: string;
  sevenText: string;
  eightRadio: string;
  eightText: string;
  nineRadio: string;
  nineText: string;
};

type ApiResponse = { message: string } | Ucc | Ucc[] | { data: any } | { error: string } | Document[];

const cors = Cors({
  // Only allow requests with GET, POST and OPTIONS
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {

  await runMiddleware(req, res, cors);

  if (req.method === 'POST') {

    switch (req.body.type) {

      case 'LIST':
        try {

          const client = await clientPromise;
          const db = client.db("Spak");
          const collection = db.collection<Ucc>("ucc");
          const data = await collection.find({}).toArray();
          res.status(200).json(data);

        }
        catch (err) {
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
          const collection = db.collection<Ucc>("ucc");
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

      default:
        res.status(500).json({ data: '' });
    }


  }

  res.status(500).json({ data: 'Not Data Found' });


}
