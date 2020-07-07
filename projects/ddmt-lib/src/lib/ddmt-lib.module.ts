import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AgGridModule } from 'ag-grid-angular';

import { DDMTGridComponent } from './ddmt-grid-component/ddmt-grid.component';
import { DDMTLibService } from './ddmt-lib.service';
import { CheckboxCellComponent } from './utils/checkbox-cell-component/checkbox-cell.component';
import { DDMTPaginationComponent } from './ddmt-pagination/ddmt-pagination.component';

@NgModule({
  declarations: [
    DDMTGridComponent,
    CheckboxCellComponent,
    DDMTPaginationComponent
  ],
  imports: [
    HttpClientModule,
    AgGridModule.withComponents([]),
    FormsModule,
    CommonModule
  ],
  providers: [DDMTLibService],
  exports: [DDMTGridComponent]
})
export class DDMTLibModule { }
