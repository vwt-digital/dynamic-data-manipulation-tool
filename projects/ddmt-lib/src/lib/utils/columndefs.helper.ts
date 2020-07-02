import { CheckboxCellComponent } from './checkbox-cell-component/checkbox-cell.component';
import { ColDef } from 'ag-grid-community';

/**
 * Based on an entity name pick the correct schema from the OpenAPI spec and convert that schema to column definitions.
 *
 * @param observableAPISpec - An OpenAPI spec as JSON object.
 * @param entityName - The name of the entity that you want to display in the grid.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function convertSpecToColDefs(apiSpec: any, entityName: string): any[] {
  return schemaToColDefs(apiSpec.components.schemas[entityName]);
}

/**
 * Maps primitives to cellRenderers and other type-related ag-grid options.
 *
 * @param type - The type of value in this column.
 * @return - An object with ag-grid options that depend on value type.
 */
function setTypeBasedOptions(type: string): Record<string, any> {
  if (type === 'boolean') {
    return {
      cellRendererFramework: CheckboxCellComponent
    };
  }
}

/**
 * This function converts underscores to spaces in a string.
 *
 * @param columnName - The name of the column
 */
function namify(columnName: string): string {
  return columnName.replace(/_/g, ' ');
}

/**
 * This function converts an OpenAPI schema to a list of column definitions.
 *
 * @param schema - An OpenAPI schema
 * @return - A list of ColDef's for the AG-grid.
 */
function schemaToColDefs(schema: any): ColDef[] {
  const colDefs = [];

  for (const key of Object.keys(schema.properties)) {
    const property = schema.properties[key];
    colDefs.push({
      headerName: namify(key),
      field: key,
      editable: property.readonly ? property.readonly : true,
      ...setTypeBasedOptions(property.type)
    });
  }

  return colDefs;
}
