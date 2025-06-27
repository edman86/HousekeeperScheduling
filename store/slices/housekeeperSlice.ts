import { mockHousekeepers } from '@/mock/mockHousekeepers';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export type Housekeeper = {
  id: number;
  name: string;
}

type HousekeeperState = {
  housekeepers: Housekeeper[];
  isHousekeepersLoading: boolean;
  isHousekeepersError: boolean;
}

const initialState: HousekeeperState = {
  housekeepers: [],
  isHousekeepersLoading: false,
  isHousekeepersError: false
}

export const fetchHousekeepers = createAsyncThunk(
  'housekeepers/fetchHousekeepers',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockHousekeepers;
      
      // Real API implementation would be:
      // const response = await fetch(`{API_URL}/housekeepers`);
      // if (!response.ok) throw new Error('Failed to fetch housekeepers');
      // return await response.json();
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to fetch housekeepers');
    }
  }
);

const housekeeperSlice = createSlice({
  name: 'housekeepers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHousekeepers.pending, (state) => {
        state.isHousekeepersLoading = true;
      })
      .addCase(fetchHousekeepers.fulfilled, (state, action) => {
        state.isHousekeepersLoading = false;
        state.housekeepers = action.payload;
      })
      .addCase(fetchHousekeepers.rejected, (state, action) => {
        state.isHousekeepersLoading = false;
        state.isHousekeepersError = true;
      });
  }
});

export default housekeeperSlice.reducer;
export const housekeeperActions = housekeeperSlice.actions;
