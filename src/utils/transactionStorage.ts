import { ITransactionStorage } from "@/types/transaction";

const transactionKey = "transaction-history";

const setTransactionStorage = (item: ITransactionStorage) => {
  const transactionsStr = localStorage.getItem(transactionKey);
  if (transactionsStr) {
    const transactions = JSON.parse(transactionsStr);
    transactions.push(item);
    localStorage.setItem(transactionKey, JSON.stringify(transactions));
    return;
  }
  const transactions = [item];
  localStorage.setItem(transactionKey, JSON.stringify(transactions));
};

const getTransactionStorage = (): ITransactionStorage[] => {
  const transactionsStr = localStorage.getItem(transactionKey);
  if (transactionsStr) {
    return JSON.parse(transactionsStr);
  }
  return [];
};

const removeTransactionStorage = () => {
  localStorage.removeItem(transactionKey);
};

const transactionStorage = {
  setTransactionStorage,
  getTransactionStorage,
  removeTransactionStorage,
};

export default transactionStorage;
