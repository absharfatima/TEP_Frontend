import { configureStore } from "@reduxjs/toolkit";
import trainerReducer from "./reducers/TrainerRegister";

export const store = configureStore({
  reducer: {
    trainer: trainerReducer,
    // Add reducers for other features if needed
  },
});
