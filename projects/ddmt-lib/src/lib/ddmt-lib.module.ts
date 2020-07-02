import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { AgGridModule } from 'ag-grid-angular';

import { DDMTGridComponent } from './ddmt-grid-component/ddmt-grid.component';
import { DDMTLibService } from './ddmt-lib.service';
import { CheckboxCellComponent } from './utils/checkbox-cell-component/checkbox-cell.component';

@NgModule({
  declarations: [
    DDMTGridComponent,
    CheckboxCellComponent
  ],
  imports: [
    HttpClientModule,
    AgGridModule.withComponents([]),
    CommonModule
  ],
  providers: [DDMTLibService],
  exports: [DDMTGridComponent]
})
export class DDMTLibModule { }
