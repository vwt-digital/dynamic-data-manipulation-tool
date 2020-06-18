import { convertSpecToColDefs } from './columndefs.helper';
import { APISpec } from '../models/apiSpec.interface';
import { Operation } from '../models/operation.interface';

function isHTTPMethod(method: string): boolean {
  return ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase());
}

function convertSpecToOperations(apiSpec: any): Record<string, Operation> {
  const operations = {};

  for (const endpoint of Object.keys(apiSpec.paths)) {
    const path = apiSpec.paths[endpoint];
    for (const method of Object.keys(path)) {
      if (isHTTPMethod(method)) {
        const operation = path[method];
        operations[operation.operationId] = {
          endpoint,
          security: operation.security?.[0]?.oauth2
        };
      }
    }
  }

  return operations;
}

export function convertAPISpec(apiSpec: any, entityName: string): APISpec {
  return {
    operations: convertSpecToOperations(apiSpec),
    colDefs: convertSpecToColDefs(apiSpec, entityName)
  };
}
