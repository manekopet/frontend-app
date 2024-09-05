import { axiosPrivate } from "@/http/axiosPrivate";
import {
  GetMyPetFeedResponse,
  GetMyPetResponse,
  GetMyPetsResponse,
  ShoppingResponse,
  ShoppingSellResponse,
  ShoppingSetAsMainResponse,
} from "@/types/apis/nft-pet";
import { GlobalFeedItem } from "@/types/app";
import { Order } from "@/types/order";
import { Pet, PetItem, PetWithState } from "@/types/pet";

export const getMyPets = async (): Promise<Pet[]> => {
  const res = await axiosPrivate.get<GetMyPetsResponse>(`/pet/mypets`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (res.status !== 200) {
    throw new Error("bad request");
  }

  const { data = [] } = res.data;

  return data;
};

export const getMyPetBurn = async (): Promise<Pet[]> => {
  const res = await axiosPrivate.post<GetMyPetsResponse>(`/mypet/burn`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (res.status !== 200) {
    throw new Error("bad request");
  }

  const { data = [] } = res.data;

  return data;
};

export const claimReward = async (nftId: any, points: any): Promise<{}> => {
  const data = {
    nftId,
    points,
  };

  const res: any = await axiosPrivate.post<ShoppingResponse>(
    `game/claim`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (res.status !== 200) {
    throw new Error(res.message);
  }

  if (res.data.status !== 1) {
    throw new Error(res.data.message);
  }

  return { order: res.data };
};

export const claimRewardBalance = async (
  nftId: any,
  points: any
): Promise<{}> => {
  const data = {
    nftId,
    points,
  };

  const res: any = await axiosPrivate.post<ShoppingResponse>(
    `game/claim-pet-rewards`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (res.status !== 200) {
    throw new Error(res.message);
  }

  if (res.data.status !== 1) {
    throw new Error(res.data.message);
  }

  return { order: res.data };
};
export const getMyPet = async (nftId: string): Promise<PetWithState> => {
  const res = await axiosPrivate.get<GetMyPetResponse>(`/pet/mypets/${nftId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (res.status !== 200) {
    throw new Error("bad request");
  }

  const { pet, petImage, petItems, petLevel, poo } = res.data;

  const data = {
    pet,
    petImage,
    petItems,
    petLevel,
    poo,
  };

  return data;
};

export const getMyPetFeed = async (nftId: string): Promise<PetWithState> => {
  const res = await axiosPrivate.get<GetMyPetFeedResponse>(
    `/pet/mypets/feed/${nftId}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (res.status !== 200) {
    throw new Error("bad request");
  }

  const {
    pet,
    petImage,
    petEquipAnimatedImage,
    petItems,
    petLevel,
    petState,
    petEquip,
    poo,
  } = res.data;

  const data: PetWithState = {
    pet,
    petImage,
    petEquipAnimatedImage,
    petItems,
    petLevel,
    petState,
    petEquip,
    poo,
  };

  return data;
};

export const updatePetName = async (
  id: any,
  nftPublicKey: any,
  nftId: any,
  name: any
): Promise<{ message: string; rewardIndex: number }> => {
  const data = {
    NftPublicKey: nftPublicKey,
    NftId: nftId,
    Name: name,
  };

  const res = await axiosPrivate.post<any>(`pet/name/${id}`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (res.status !== 200) {
    throw new Error("bad request");
  }

  if (res.data.status !== 1) {
    throw new Error("bad request");
  }

  return res.data;
};

export const levelUpPet = async (
  nftPublicKey: any,
  nftId: any
): Promise<{ message: string; rewardIndex: number }> => {
  const data = {
    NftPublicKey: nftPublicKey,
    NftId: nftId,
  };

  const res = await axiosPrivate.post<any>(`pet/level-up/${nftId}`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (res.status !== 200) {
    throw new Error("bad request");
  }

  if (res.data.status !== 1) {
    throw new Error("bad request");
  }

  return res.data;
};

export const shoppingNew = async (
  nftPublicKey: string,
  nftId: string,
  itemId: number
): Promise<{ order: Order }> => {
  const data = {
    nftPublicKey,
    nftId,
    itemId,
  };

  const res = await axiosPrivate.post<ShoppingResponse>(
    `pet/shopping/new`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (res.status !== 200) {
    throw new Error("bad request");
  }

  if (res.data.status !== 1) {
    throw new Error(res.data.message);
  }

  return { order: res.data.data };
};

export const shoppingUpdate = async (
  // itemTx: string,
  itemOrderId: string
): Promise<{ order: Order }> => {
  const data = {
    // itemTx,
    itemOrderId,
  };

  const res = await axiosPrivate.post<ShoppingResponse>(
    `pet/shopping/update`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (res.status !== 200) {
    throw new Error("bad request");
  }

  if (res.data.status !== 1) {
    throw new Error("bad request");
  }

  return { order: res.data.data };
};

export const shoppingSell = async (
  nftId: string,
  itemId: number
): Promise<{ item: GlobalFeedItem }> => {
  const data = {
    nftId,
    itemId,
  };

  const res = await axiosPrivate.post<ShoppingSellResponse>(
    `pet/shopping/sell`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (res.status !== 200) {
    throw new Error("bad request");
  }

  if (res.data.status !== 1) {
    throw new Error("bad request");
  }

  return { item: res.data.data };
};

export const shoppingSetAsMain = async (
  nftId: string,
  itemId: number
): Promise<{ item: PetItem }> => {
  const data = {
    nftId,
    itemId,
  };

  const res = await axiosPrivate.post<ShoppingSetAsMainResponse>(
    `pet/item/update`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (res.status !== 200) {
    throw new Error("bad request");
  }

  if (res.data.status !== 1) {
    throw new Error("bad request");
  }

  return { item: res.data.data };
};
