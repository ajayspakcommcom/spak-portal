// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {id: number, name: string };

const data: Data[] = [{id:1, name:'Ram'}, {id:2, name:'Manjeet'}, {id:3, name:'Sujeet'}, {id:1, name:'Kamlesh'}];

export default function handler(req: NextApiRequest, res: NextApiResponse<Data[]>) {
  res.status(200).json(data);
}
