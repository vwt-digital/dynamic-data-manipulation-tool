import { GridOptions } from 'ag-grid-community';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';

export class DataGrid {
  /**
   * Initializes a grid with the options specified below.
   *
   * @param gridName - The name you would like to give to this grid. (Must be unique in your app)
   * @param saveGridState - Whether to allow for saving of preferences in localstorage.
   */
  static GetDefaults(
    gridName: string,
    saveGridState = true
  ): GridOptions {
    if (!gridName) {
      throw new Error('gridName must be specified');
    }

    let gridOptions: GridOptions = null;

    /**
     * Saves a column's state to localstorage.
     *
     * @param state - The column's internal state
     */
    const saveColumnState = (state: ColumnState[]): void => {
      if (gridOptions === null || gridOptions === undefined || !saveGridState) {
        return;
      }

      localStorage.setItem(`${gridName}-GRID-STATE`, JSON.stringify(state));
    };

    /**
     * Retrieve a column's state from localstorage.
     */
    const getColumnState = (): void | ColumnState[] => {
      if (gridOptions === null || gridOptions === undefined || !saveGridState) {
        return;
      }

      return JSON.parse(localStorage.getItem(`${gridName}-GRID-STATE`));
    };

    gridOptions = {
      defaultColDef: {
        sortable: true,
        filter: true,
        editable: false,
        enableRowGroup: true,
        enablePivot: true,
      },
      enableRangeSelection: true,
      animateRows: false,
      statusBar: {
        statusPanels: [
          { statusPanel: 'agTotalRowCountComponent', align: 'left' },
          { statusPanel: 'agFilteredRowCountComponent', align: 'left' }
        ]
      },
      sideBar: {
        defaultToolPanel: null,
        toolPanels: [
          {
            id: 'filters',
            labelDefault: 'Filters',
            labelKey: 'filters',
            iconKey: 'filter',
            toolPanel: 'agFiltersToolPanel',
          },
          {
            id: 'columns',
            labelDefault: 'Columns',
            labelKey: 'columns',
            iconKey: 'columns',
            toolPanel: 'agColumnsToolPanel',
            toolPanelParams: {
              suppressValues: true,
              suppressPivots: true,
              suppressPivotMode: true
            },
          }
        ]
      },
      onDragStopped: (ev): void => saveColumnState(ev.columnApi.getColumnState()),
      onColumnPinned: (ev): void => saveColumnState(ev.columnApi.getColumnState()),
      onColumnVisible: (ev): void => saveColumnState(ev.columnApi.getColumnState()),
      onColumnRowGroupChanged: (ev): void => {
        saveColumnState(ev.columnApi.getColumnState());
      },
      onGridReady: (ev): void => {
        const colState = getColumnState();

        if (colState) {
          console.error(ev.columnApi.setColumnState(colState))
        }
      }
    };

    return gridOptions;
  }

  /**
   * Clears a grid's preferences from localstorage.
   *
   * @param grid - The ag-grid
   * @param gridName - The name you would like to give to this grid. (Must be unique in your app)
   */
  static ClearOptions(grid: GridOptions, gridName: string): void {
    grid.columnApi.resetColumnState();
    localStorage.removeItem(`${gridName}-GRID-STATE`);
    localStorage.removeItem(`${gridName}-GRID-CHUNK-SIZE`);
  }
}
