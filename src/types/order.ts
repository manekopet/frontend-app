export interface Order {
  id: number;
  created_at: string;
  updated_at: string;
  itemOrderId: string;
  nftPublicKey: string;
  nftId: string;
  userId: number;
  itemId: number;
  itemType: number;
  itemPrice: number;
  itemPoints: number;
  itemIsSellable: number;
  itemTx: string;
  itemStatus: number;
}
