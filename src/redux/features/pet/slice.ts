import { Pet, PetStateRedux, PetWithState } from "@/types/pet";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const initialState: PetStateRedux = {
  pets: [],
  activePet: null,
};

export const petSlice = createSlice({
  name: "pet",
  initialState: initialState,
  reducers: {
    setPets(state, action: PayloadAction<{ pets: Pet[] }>) {
      return {
        ...state,
        pets: action.payload.pets,
      };
    },
    activePet(state, action: PayloadAction<{ pet: PetWithState }>) {
      return {
        ...state,
        activePet: action.payload.pet,
      };
    },
    removePet(state, action: PayloadAction<string>) {
      return {
        ...state,
        pets: state.pets.filter(p => p.nftPublicKey !== action.payload)
      }
    },

    resetState() {
      return initialState;
    },
  },
});

export const petActions = petSlice.actions;

export default petSlice;
