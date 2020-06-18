import { ColDef } from 'ag-grid-community';
import { Operation } from './operation.interface';

export interface APISpec {
  operations: Record<string, Operation>;
  colDefs: ColDef[];
}
