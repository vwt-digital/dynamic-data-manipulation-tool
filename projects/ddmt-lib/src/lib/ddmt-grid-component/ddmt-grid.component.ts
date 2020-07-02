import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { LicenseManager } from 'ag-grid-enterprise';
import { GridOptions, CellValueChangedEvent } from 'ag-grid-community';
import { DataGrid } from '../classes/datagrid';
import { DDMTLibService } from '../ddmt-lib.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'dat-ddmt-grid',
  templateUrl: './ddmt-grid.component.html',
  styleUrls: [
    './ddmt-grid.component.scss',
  ]
})
export class DDMTGridComponent implements OnInit, AfterViewInit {
  @ViewChild('grid') grid: GridOptions;

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
    this.ddmtLibService.retrieveAllData(this.apiUrl, this.authentication, this.entityName)
      .subscribe(data => this.gridOptions.api.setRowData(data));
  }

  syncToServer(event: CellValueChangedEvent): void {
    this.ddmtLibService.updateRow(
      this.apiUrl,
      this.authentication,
      this.entityName,
      event.data
    );
  }
}
