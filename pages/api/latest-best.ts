import type { NextApiRequest, NextApiResponse } from "next";
import { BEST_SCORE } from "./list-bestscore";

export default function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  res.status(200).json({
    data: BEST_SCORE.LATEST_BEST,
  });
}
