import { convertSpecToColDefs } from './columndefs.helper';
import { APISpec } from '../models/apiSpec.interface';


export function convertAPISpec(apiSpec: any, entityName: string): APISpec {
  return {
    schemas: apiSpec.components.schemas,
    operations: apiSpec.paths,
    colDefs: convertSpecToColDefs(apiSpec, entityName)
  };
}

export const capitalize = (s: string): string => {
  if (typeof s !== 'string') {
    return '';
  }

  s = s.toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
}
