import { createContext } from "react";
import { RootState } from "./RootState";

export const rootState = new RootState();

export const RootContext = createContext<RootState>(rootState);