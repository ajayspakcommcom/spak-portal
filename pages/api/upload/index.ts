// import { NextApiRequest, NextApiResponse } from 'next';
// import formidable, { Files, Fields } from 'formidable';
// import fs from 'fs';
// import xlsx from 'xlsx';
// import util from 'util';

// const formParse = util.promisify(formidable().parse);

// export const config = {
//     api: {
//         bodyParser: false,
//     },
// };

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     try {
//         // Parse the form data
//         const { fields, files } = await formParse({ req });

//         const filesObject = files ?? {};

//         if ('file' in filesObject) {
//             const file = filesObject.file as formidable.File;

//             console.log('Excel file uploaded');

//             const filePath = file.filepath;
//             const workbook = xlsx.readFile(filePath);
//             const sheetNames = workbook.SheetNames;
//             const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);

//             console.log(data);
//         } else {
//             console.log('No file uploaded');
//         }

//         res.status(200).json({ message: 'File uploaded successfully' });

//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ error: 'An error occurred while processing the request' });
//     }
// }
