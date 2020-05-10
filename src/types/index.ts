import { State } from 'arca-redux';

export type column = [number, string];
export type columns = column[];

export type rowItem = State['Source']['AAU-APU-in-App']['Rows'][0];

type treeTemplate<T> = rowItem & {
  items?: T[],
};
export interface tree extends treeTemplate<tree> { }
