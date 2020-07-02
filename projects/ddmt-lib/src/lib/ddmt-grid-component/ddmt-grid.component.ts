import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { LicenseManager } from 'ag-grid-enterprise';
import { GridOptions, CellValueChangedEvent } from 'ag-grid-community';
import { first } from 'rxjs/operators';
import * as pluralize from 'pluralize';

import { DataGrid } from '../classes/datagrid';
import { DDMTLibService } from '../ddmt-lib.service';
import { capitalize } from '../utils/apispec.helper';

@Component({
  selector: 'dat-ddmt-grid',
  templateUrl: './ddmt-grid.component.html',
  styleUrls: [
    './ddmt-grid.component.scss',
  ]
})
export class DDMTGridComponent implements OnInit, AfterViewInit {
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

  constructor(private ddmtLibService: DDMTLibService) {  }

  gridOptions: GridOptions;

  ngOnInit(): void {
    LicenseManager.setLicenseKey(this.agGridAPIKey);
    this.gridOptions = DataGrid.GetDefaults(this.gridName);
    this.ddmtLibService.setApiSpec(this.apiUrl, this.entityName);
    this.ddmtLibService.apiSpec.pipe(first()).subscribe(apiSpec => {
      this.gridOptions.api.setColumnDefs(apiSpec.colDefs);
    });
  }

  ngAfterViewInit(): void {
    const themes = [
      'ag-theme-alpine',
      'ag-theme-alpine-dark',
      'ag-theme-balham',
      'ag-theme-balham-dark',
      'ag-theme-material'
    ];

    if (!themes.includes(this.theme)) {
      throw new Error(`theme must be one of the supported ag-grid themes. see https://www.ag-grid.com/javascript-grid-themes-provided/`);
    }

    this.setData();
  }

  /**
   * This functions fills the grid with fresh data from the api.
   */
  setData(): void {
    this.ddmtLibService.retrieveAllData(this.apiUrl, this.authentication, this.entityName)
        .subscribe(data => this.gridOptions.api.setRowData(data));
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
