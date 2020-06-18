import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { LicenseManager } from 'ag-grid-enterprise';
import { GridOptions } from 'ag-grid-community';
import { DataGrid } from '../classes/datagrid';
import { DDMTLibService } from '../ddmt-lib.service';

@Component({
  selector: 'dat-ddmt-grid',
  templateUrl: './ddmt-grid.component.html',
  styleUrls: [
    './ddmt-grid.component.scss',
  ]
})
export class DDMTGridComponent implements OnInit {
  @ViewChild('grid') grid: GridOptions;

  @Input() authentication: string;
  @Input() apiUrl: string;
  @Input() agGridAPIKey: string;
  @Input() entityName: string;
  @Input() gridName: string;

  constructor(private ddmtLibService: DDMTLibService) {  }

  gridOptions: GridOptions;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columnDefs: any;

  rowData = [
    { administration: 'Local', business_unit: 'Test', city: 'Amersfoort' },
    { administration: 'Local', business_unit: 'Test', city: 'Amersfoort' },
    { administration: 'Local', business_unit: 'Test', city: 'Amersfoort', skills_asfalt_zagen: true }
  ];

  ngOnInit(): void {
    LicenseManager.setLicenseKey(this.agGridAPIKey);
    this.gridOptions = DataGrid.GetDefaults(this.gridName);
    this.ddmtLibService.retrieveColumnDefs(this.apiUrl, this.entityName)
      .subscribe(columnDefs => {
        this.columnDefs = columnDefs;
      });
  }
}
