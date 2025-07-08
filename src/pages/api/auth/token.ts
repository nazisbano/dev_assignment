import { getAccessToken } from '@auth0/nextjs-auth0';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { accessToken } = await getAccessToken(req, res);
    res.status(200).json({ token: accessToken });
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
}
