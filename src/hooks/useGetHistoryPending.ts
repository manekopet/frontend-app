import { getHistoryWallet } from "@/apis/auth";
import { useEffect, useState } from "react";

interface HistorySpending {
  id: number;
  balance: number;
  status: number;
  note: string;
  txhash: string;
  createdAt: string;
  itemType: number;
}

export default function useGetHistorySpending() {
  const [data, setData] = useState<HistorySpending[]>([]);
  const getHistory = async () => {
    try {
      const res = await getHistoryWallet();
      setData(res);
    } catch (error) {}
  };
  useEffect(() => {
    getHistory();
  }, []);
  return {
    history: data,
    getHistory,
  };
}
