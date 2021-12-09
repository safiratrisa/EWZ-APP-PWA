// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  data: any[];
};

export const BEST_SCORE: any = {
  LIST: [
    { id: "123", name: "Adi", score: 1 },
    { id: "124", name: "x", score: 11 },
    { id: "125", name: "6", score: 13 },
    { id: "126", name: "5", score: 12 },
    { id: "127", name: "2", score: 15 },
    { id: "128", name: "4", score: 16 },
    { id: "129", name: "1", score: 17 },
    { id: "121", name: "2", score: 18 },
  ],
  LATEST_BEST: {},
};

const sortAndLimit = () => {
  function compare(a: any, b: any) {
    if (a.score > b.score) return -1;
    if (a.score < b.score) return 1;
    return 0;
  }

  BEST_SCORE.LIST.sort(compare);
  BEST_SCORE.LIST = BEST_SCORE.LIST.slice(0, 5);
};

export const addData = (data: any) => {
  BEST_SCORE.LIST.push(data);
  sortAndLimit();
  BEST_SCORE.LATEST_BEST = BEST_SCORE.LIST[0];
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  sortAndLimit();
  if (req.method === "POST") {
    addData(JSON.parse(req.body));
    res.status(200).json({
      data: BEST_SCORE.LIST,
    });
  } else {
    res.status(200).json({
      data: BEST_SCORE.LIST,
    });
  }
}
