import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { LicenseManager } from 'ag-grid-enterprise';
import { GridOptions, ColDef, CellValueChangedEvent } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import pluralize from 'pluralize';

import { DataGrid } from '../classes/datagrid';
import { DDMTLibService } from '../ddmt-lib.service';
import { capitalize } from '../utils/apispec.helper';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'dat-ddmt-grid',
  templateUrl: './ddmt-grid.component.html',
  styleUrls: [
    './ddmt-grid.component.scss',
    '../scss/shared.scss'
  ]
})
export class DDMTGridComponent implements OnInit {
  @ViewChild('agGrid', { static: true }) agGrid: AgGridAngular;
  gridOptions: GridOptions;

  /**
   * The `theme` input allows for setting an ag-grid theme.
   * @see https://www.ag-grid.com/javascript-grid-themes-provided/
   * Pleasee make sure to import the correct css file in your main component.
   */
  @Input() theme: string;
  @Input() authentication: string;
  @Input() apiUrl: string;
  @Input() agGridAPIKey: string;
  @Input() entityName: string;
  @Input() gridName: string;

  rowData: any;
  columnDefs: ColDef[];

  inputsDisabled: boolean;
  page: BehaviorSubject<{ next: string, previous: string }> = new BehaviorSubject({
    next: null,
    previous: null
  });

  constructor(private ddmtLibService: DDMTLibService) { }

  ngOnInit(): void {
    // Initialize the grid
    this.checkTheme();
    LicenseManager.setLicenseKey(this.agGridAPIKey);

    // Set grid options
    this.gridOptions = DataGrid.GetDefaults(this.gridName);
    this.ddmtLibService.setApiSpec(this.apiUrl, this.entityName)
      .subscribe(apiSpec => this.columnDefs = apiSpec.colDefs);
    this.setData();
  }

  /**
   * Clear the grid preferences.
   */
  clearPreferences(): void {
    DataGrid.ClearOptions(this.agGrid.gridOptions, this.gridName);
    this.setData();
  }

  /**
   * Checks if a provided theme is a valid AG-grid theme.
   */
  checkTheme(): void {
    const themes = [
      'ag-theme-alpine',
      'ag-theme-alpine-dark',
      'ag-theme-balham',
      'ag-theme-balham-dark',
      'ag-theme-material'
    ];

    if (!themes.includes(this.theme)) {
      throw new Error(`
        Theme must be one of:
        - ag-theme-alpine, ag-theme-alpine-dark
        - ag-theme-balham, ag-theme-balham-dark
        - ag-theme-material
      `);
    }
  }

  /**
   * This functions fills the grid with fresh data from the api.
   */
  setData(URL?: string): void {
    this.ddmtLibService.retrieveData(
      this.apiUrl,
      this.authentication,
      this.entityName,
      this.gridName,
      URL
    ).subscribe(
      data => {
        this.rowData = data.results;
        this.page.next({
          next: data.next_page,
          previous: data.prev_page
        });
      },
      (err) => {
        const AuthHTTPCodes = [401, 403];
        if (AuthHTTPCodes.includes(err.status)) {
          this.inputsDisabled = true;
        }
      }
    );
  }

  /**
   * This function synchronises local changes to the server.
   * It either updates (put) or adds (post) data to the api.
   * @param event - A value change on the grid.
   */
  syncToServer(event: CellValueChangedEvent): void {
    this.ddmtLibService.apiSpec.subscribe(apiSpec => {
      const entity = capitalize(pluralize(this.entityName, 1));
      const schema = apiSpec.schemas[entity];
      const id = schema['x-db-table-id'];

      if (event.data[id]) {
        // If id exists do a put (update the data)
        this.ddmtLibService.updateRow(
          this.apiUrl,
          this.authentication,
          this.entityName,
          event.data
        );
      } else if (event.data) {
        // If we don't have an id make a post (create new data)
        let missingProps = [];
        if (schema.required) {
          missingProps = schema.required.filter(prop => !Object.prototype.hasOwnProperty.call(event.data, prop));
        }

        if (!missingProps.length) {
          this.ddmtLibService.createRow(
            this.apiUrl,
            this.authentication,
            this.entityName,
            event.data
          );
        } else {
          alert(`Missing required properties: ${missingProps}`);
        }
      }
    });
  }

  /**
   * Creates a new row locally, once a value is changed on the row
   * the `syncToServer` function will be called which will update
   * the server with the local changes.
   */
  createNewRow(): void {
    const newRow = {};
    this.agGrid.api.applyTransaction({ add: [newRow] });
  }
}
