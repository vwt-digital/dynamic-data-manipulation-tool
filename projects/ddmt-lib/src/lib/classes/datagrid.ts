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

    type ColGroupState = {
      groupId: string;
      open: boolean;
    }[];

    /**
     * Saves' a column group's state to localstorage.
     *
     * @param state - The internal state of the column group.
     */
    const saveColumnGroupState = (state: ColGroupState): void => {
      if (gridOptions === null || gridOptions === undefined || !saveGridState) {
        return;
      }

      console.log(state)

      localStorage.setItem(`${gridName}-GRID-GROUP-STATE`, JSON.stringify(state));
    };

    /**
     * Retrieves' a column group's state from localstorage.
     */
    const getColumnGroupState = (): void | ColGroupState => {
      if (gridOptions === null || gridOptions === undefined || !saveGridState) {
        return;
      }

      return JSON.parse(localStorage.getItem(`${gridName}-GRID-GROUP-STATE`));
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
        console.log(ev.columnApi.getColumnGroupState())
        saveColumnState(ev.columnApi.getColumnState());
        saveColumnGroupState(ev.columnApi.getColumnGroupState());
      },
      onGridReady: (ev): void => {
        const colState = getColumnState();
        const colGroupState = getColumnGroupState();

        if (colState) {
          console.error(ev.columnApi.setColumnState(colState))
        }

        if (colGroupState) {
          ev.columnApi.setColumnGroupState(colGroupState);
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
    grid.columnApi.resetColumnGroupState();
    localStorage.removeItem(`${gridName}-GRID-STATE`);
    localStorage.removeItem(`${gridName}-GRID-GROUP-STATE`);
  }
}
