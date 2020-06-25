import { convertSpecToColDefs } from './columndefs.helper';
import { APISpec } from '../models/apiSpec.interface';


export function convertAPISpec(apiSpec: any, entityName: string): APISpec {
  return {
    operations: apiSpec.paths,
    colDefs: convertSpecToColDefs(apiSpec, entityName)
  };
}
