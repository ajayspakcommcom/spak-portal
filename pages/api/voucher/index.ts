import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../libs/mongodb';
import { ObjectId } from 'mongodb';
import { verifyToken } from '../libs/verifyToken';
import runMiddleware from '@/libs/runMiddleware';
import Cors from 'cors';

type Voucher = { id: ObjectId; voucherNo: number; person: string; amount: number; date: Date; summary: string };

type ApiResponse = | { message: string } | Voucher | Voucher[] | { data: any } | { error: string };

const cors = Cors({
  // Only allow requests with GET, POST and OPTIONS
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});

enum ApprovalStatus {
  Pending = "pending",
  Approved = "approved",
  Rejected = "rejected"
}

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


            if (req.body.status && req.body.filterStartDate && req.body.filterEndDate) {
              const client = await clientPromise;
              const db = client.db("Spak");
              const collection = db.collection<Voucher>("voucher");
              const data = await collection.find({
                refId: req.body.refId,
                approvalStatus: req.body.status,
                voucherDate: { $gte: req.body.filterStartDate, $lte: req.body.filterEndDate }
              }).toArray();
              res.status(200).json(data);

            } else if (req.body.filterStartDate && req.body.filterEndDate) {

              const client = await clientPromise;
              const db = client.db("Spak");
              const collection = db.collection<Voucher>("voucher");
              const data = await collection.find({
                refId: req.body.refId,
                voucherDate: { $gte: req.body.filterStartDate, $lte: req.body.filterEndDate }
              }).toArray();
              res.status(200).json(data);

            } else if (req.body.status) {

              const client = await clientPromise;
              const db = client.db("Spak");
              const collection = db.collection<Voucher>("voucher");
              const data = await collection.find({
                refId: req.body.refId,
                approvalStatus: req.body.status
              }).toArray();
              res.status(200).json(data);

            } else {

              const client = await clientPromise;
              const db = client.db("Spak");
              const collection = db.collection<Voucher>("voucher");
              const data = await collection.find({ refId: req.body.refId }).toArray();
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
            const collection = db.collection<Voucher>("voucher");
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
            const collection = db.collection<Voucher>("voucher");

            const lastEntryData = await collection.find().sort({ _id: -1 }).limit(1).toArray();

            console.log(lastEntryData);

            if (lastEntryData.length > 0) {
              const lastVoucerNo = lastEntryData[0].voucherNo;
              console.log(lastVoucerNo);
              req.body.voucherNo = lastVoucerNo + 1;
            } else {
              req.body.voucherNo = 1;
            }

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
            const collection = db.collection<Voucher>("voucher");
            // const result = await collection.replaceOne({ _id: new ObjectId(req.body.id) }, req.body);

            const result = await collection.updateOne(
              { _id: new ObjectId(req.body.id) },
              { $set: { "voucherData": req.body.voucherData, voucherAmount: req.body.voucherAmount } }
            );

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
            const collection = db.collection<Voucher>("voucher");
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
