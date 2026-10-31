import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState: JobOfferState = {
  incomingJob: null,
};

const jobOfferSlice = createSlice({
  name: 'app/jobOffer',
  initialState,
  reducers: {
    setIncomingJob: (state, {payload}: PayloadAction<IAmbulanceOffer>) => {
      state.incomingJob = payload;
    },
    clearIncomingJob: state => {
      state.incomingJob = null;
    },
  },
});

export const jobOfferReducer = jobOfferSlice.reducer;
export const {setIncomingJob, clearIncomingJob} = jobOfferSlice.actions;
