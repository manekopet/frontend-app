import { GlobalFeedItem } from "../app";
import { Order } from "../order";
import { Pet, PetItem, PetLevel } from "../pet";

export interface GetMyPetsResponse {
  data: Pet[];
  message: string;
  status: number;
}

export interface GetMyPetResponse {
  pet: Pet;
  petImage: string;
  petItems: PetItem[];
  petLevel: PetLevel;
  poo: number;
  message: string;
  status: number;
}

export interface GetMyPetFeedResponse {
  pet: Pet;
  petImage: string;
  petEquipAnimatedImage: string;
  petItems: PetItem[];
  petLevel: PetLevel;
  petState: number;
  petEquip: number;
  poo: number;
  message: string;
  status: number;
  petReward?: number;
}

export interface ShoppingResponse {
  data: Order;
  message: string;
  status: number;
}

export interface ShoppingSellResponse {
  data: GlobalFeedItem;
  message: string;
  status: number;
}
export interface ShoppingSetAsMainResponse {
  data: PetItem;
  message: string;
  status: number;
}
