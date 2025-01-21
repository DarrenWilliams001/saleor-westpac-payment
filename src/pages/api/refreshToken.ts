import { NextApiRequest, NextApiResponse } from "next";
import { cacheExchange, createClient, fetchExchange } from "urql";
import { RefreshTokenDocument } from "../../../generated/graphql";

export default async function refreshToken(req: NextApiRequest, res: NextApiResponse) {
  // Create a URQL client
  const client = createClient({
    url: process.env.NEXT_PUBLIC_SALEOR_API_URL!,
    exchanges: [cacheExchange, fetchExchange],
  });

  // Get refresh token from cookies
  const token = req.cookies.refreshToken;

  // Return error if token is not found
  if (!token) {
    return res.status(401).json({ error: "Refresh token not found" });
  }

  const result = await client.mutation(RefreshTokenDocument, { refreshToken: token }).toPromise();

  return res.status(200).json({ result });
}
