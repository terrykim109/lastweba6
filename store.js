import { atom } from 'jotai';

export const favouritesAtom = atom([]); 
export const searchHistoryAtom = atom([]); // a searchHistoryAtom with a default empty array value
export const tokenAtom = atom(null);