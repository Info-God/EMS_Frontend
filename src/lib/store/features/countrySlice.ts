import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface CountryState {
  countries: string[];
}

const initialState: CountryState = {
  countries: []
};

const countrySlice = createSlice({
  name: "country",
  initialState,
  reducers: {
    setCountries: (state, action: PayloadAction<string[]>) => {
      state.countries = action.payload;
    }
  }
});

export const { setCountries } = countrySlice.actions;

export default countrySlice.reducer;