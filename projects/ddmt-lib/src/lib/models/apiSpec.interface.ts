import { ColDef } from 'ag-grid-community';

export interface APISpec {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  operations: Record<string, any>;
  colDefs: ColDef[];
}
