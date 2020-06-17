import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CheckboxCellComponent } from './checkbox-cell-component/checkbox-cell.component';

export class ColumnDefHelper {
  /**
   * Based on an entity name pick the correct schema from the OpenAPI spec and convert that schema to column definitions.
   *
   * @param observableAPISpec - An OpenAPI spec as an RXJS Observable.
   * @param entityName - The name of the entity that you want to display in the grid.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static convertSpecToColDefs(observableAPISpec: Observable<any>, entityName: string): Observable<unknown[]> {
    return observableAPISpec.pipe(
      map(obj => ColumnDefHelper.schemaToColDefs(obj['components']['schemas'][entityName]))
    )
  }

  /**
   * Maps primitives to cellRenderers and other type-related ag-grid options.
   *
   * @param type - The type of value in this column.
   * @return {*} - An object with ag-grid options that depend on value type.
   */
  static setTypeBasedOptions(type: string): any {
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
  static namify(columnName: string): string {
    return columnName.replace(/_/g, ' ');
  }

  /**
   * This function converts an OpenAPI schema to a list of column definitions.
   *
   * @param schema - An OpenAPI schema
   * @return {any} - A list of ColDef's for the AG-grid.
   */
  static schemaToColDefs(schema: any): any[] {
    const colDefs = [];

    for (const key in schema.properties) {
      const property = schema.properties[key]
      colDefs.push({
        headerName: ColumnDefHelper.namify(key),
        field: key,
        editable: property.readonly ? property.readonly : false,
        ...ColumnDefHelper.setTypeBasedOptions(property.type)
      })
    }

    return colDefs
  }
}
