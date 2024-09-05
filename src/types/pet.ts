export enum PetStatusLive {
  Live0 = 0,
  Live1 = 1,
  Snap = 2,
  Faint = 3,
  Death = 4,
}

export enum PetState {
  IDLE = 1,
  DEAD = 2,
  EATING = 3,
  EVIL = 4,
  SAD = 7,
  SLEEP = 8,
}

export const PetStateData: Record<
  PetState,
  {
    image: string;
    count: number;
  }
> = {
  [PetState.IDLE]: {
    image: "assets/animated/pet-stage/idle/out.png",
    count: 8,
  },
  [PetState.DEAD]: {
    image: "assets/animated/pet-stage/dead/out.png",
    count: 17,
  },
  [PetState.EATING]: {
    image: "assets/animated/pet-stage/eating/out.png",
    count: 8,
  },
  [PetState.EVIL]: {
    image: "assets/animated/pet-stage/evil/out.png",
    count: 9,
  },
  [PetState.SAD]: {
    image: "assets/animated/pet-stage/sad/out.png",
    count: 9,
  },
  [PetState.SLEEP]: {
    image: "assets/animated/pet-stage/sleep/out.png",
    count: 8,
  },
};

export interface Pet {
  id: number;
  nftId: string;
  nftPublicKey: string;
  name: string;
  image: string;
  petLevel: number;
  petScore: number;
  statusLive: number;
  timePetBorn: string;
  lastAttackUsed?: any;
  lastAttacked?: any;
  stars: number;
  timeUntilStarving?: any;
  shieldExpiredIn: string;
  petRewardsBalance: number;
}

export interface PetLevel {
  AgeLevel: number;
  PointLevel: number;
  AgeName: string;
  Image: string;
}

export interface PetItem {
  nftId: string;
  itemId: number;
  itemAsMain: number;
  balance: number;
}

export interface PetWithState {
  pet: Pet;

  petImage: string;
  petItems: PetItem[];
  petLevel: PetLevel;
  petEquip?: number;
  petEquipAnimatedImage?: string;
  petState?: number;
  petReward?: number;
  poo: number;
}

export interface PetStateRedux {
  pets: Pet[];
  activePet: PetWithState | null;
}
