import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { LicenseManager } from 'ag-grid-enterprise';
import { GridOptions, CellValueChangedEvent } from 'ag-grid-community';
import * as pluralize from 'pluralize';

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
  @ViewChild('grid') grid: GridOptions;

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

  inputsDisabled: boolean;
  chunkSize: number;
  page: BehaviorSubject<{ next: string, previous: string }> = new BehaviorSubject({
    next: null,
    previous: null
  });

  datagridDefaults = DataGrid;

  constructor(private ddmtLibService: DDMTLibService) {  }

  gridOptions: GridOptions;

  ngOnInit(): void {
    this.chunkSize = JSON.parse(localStorage.getItem(`${this.gridName}-GRID-CHUNK-SIZE`)) || 30;

    LicenseManager.setLicenseKey(this.agGridAPIKey);
    this.gridOptions = DataGrid.GetDefaults(this.gridName);
    this.ddmtLibService.setApiSpec(this.apiUrl, this.entityName);
    this.checkTheme();

    this.ddmtLibService.apiSpec.subscribe(apiSpec => {
      this.gridOptions.api.setColumnDefs(apiSpec.colDefs);
    });

    this.setData();
  }

  /**
   * Clear the grid preferences.
   */
  clearPreferences(): void {
    DataGrid.ClearOptions(this.gridOptions, this.gridName);
    localStorage.removeItem(`${this.gridName}-GRID-CHUNK-SIZE`);
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
   * Handles pagination changes like previous page and next page.
   * @param url - The url of the page to retrieve data from.
   */
  onPaginationChange(url: string): void {
    this.setData(url);
  }

  /**
   * This function sets the chunkSize in localstorage.
   * A higher chunk size allows for better filtering and sorting but costs more resources.
   * @param chunkSize - The size of chunks to retrieve from the server.
   */
  onChunkSizeChange(chunkSize: number): void {
    localStorage.setItem(`${this.gridName}-GRID-CHUNK-SIZE`, JSON.stringify(chunkSize));
    this.setData();
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
          this.gridOptions.api.setRowData(data.results);
          this.page.next({
            next: data.next_page,
            previous: data.prev_page
          });
        },
        (err) => {
          if (err.status === 401 || err.status === 403) {
            this.disableAuthorizedActions();
          }
        }
      );
  }

  /**
   * Disables buttons and inputs that require authentication.
   */
  disableAuthorizedActions(): void {
    this.inputsDisabled = true;
  }

  /**
   * This function synchronises local changes to the server.
   * It either updates (put) or adds (post) data to the api.
   * @param event - A value change on the grid.
   */
  syncToServer(event: CellValueChangedEvent): void {
    this.ddmtLibService.apiSpec.subscribe(apiSpec => {
      let idProp = capitalize(pluralize(this.entityName, 1));
      const schema = apiSpec.schemas[idProp];
      idProp = schema['x-db-table-id'];

      if (event.data[idProp]) {
        // If id exists do a put (update the data)
        this.ddmtLibService.updateRow(
          this.apiUrl,
          this.authentication,
          this.entityName,
          event.data
        );
      } else {
        // If we don't have an id make a post (create new data)
        let missingProps = [];
        if (schema.required) {
          missingProps = schema.required.filter(prop => !Object.prototype.hasOwnProperty.call(event.data, prop));
        }

        if (!missingProps.length && event.data) {
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
    this.gridOptions.api.applyTransaction({ add: [newRow] });
  }
}
