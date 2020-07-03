import { State } from 'arca-redux-v4';

export type column = [number, string];
export type columns = column[];

export type rowItem = State['Source']['AAU-APU-in-App'][0];

type treeTemplate<T> = rowItem & {
  items?: T[],
};
export interface tree extends treeTemplate<tree> { }
