import { createSlice } from "@reduxjs/toolkit";
const initialFilter = "";

const filterSlice = createSlice({
  name: "filter",
  initialState: initialFilter,
  reducers: {
    filterChange (state, action) {
      return action.payload;
     }
  }
});

export const { filterChange } = filterSlice.actions;
export default filterSlice.reducer;
