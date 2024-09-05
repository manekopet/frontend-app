export interface GlobalSpinBoardItem {
  indexId: number;
  message: string;
}
export interface GlobalFeedItem {
  id: number;
  itemId: number;
  itemType: number;
  itemName: string;
  itemPetWear: string;
  itemImage: string;
  itemAnimationAction: string;
  itemSoundAction: string;
  itemTitleHint: string;
  itemDescription: string;
  itemPrice: number;
  itemMaxPrice: number;
  itemRarity: number;
  itemDelta: number;
  itemPoints: number;
  itemShieldPower: number;
  itemTimeExtension: number;
  itemEquipExpires: number;
  itemSupply: number;
  itemSupplyLeft: number;
  itemIsSellable: number;
}

export interface GlobalConfig {
  feedItems: GlobalFeedItem[];
  mintPrice: number;
  pet_mint_address: string;
  point_vault_address: string;
  revealPrice: number;
  point_price: number;
  shopping_vault_address: string;
  spinBoard: GlobalSpinBoardItem[];
  status: number;
  tokenDecial: number;
  token_game_address: string;
}

export interface AppConfig {
  mute: boolean;
}

export interface AppReward {
  modal: boolean;
  points: number;
  symbol: string;
}

export interface AppState {
  global: GlobalConfig | null;
  config: AppConfig;
  reward: AppReward;
}
