import { NgModule } from '@angular/core';
import { DDMTGridComponent } from './ddmt-grid-component/ddmt-grid.component';
import { AgGridModule } from 'ag-grid-angular';
import { DDMTLibService } from './ddmt-lib.service';
import { HttpClientModule } from '@angular/common/http';
import { CheckboxCellComponent } from './utils/checkbox-cell-component/checkbox-cell.component';

@NgModule({
  declarations: [
    DDMTGridComponent,
    CheckboxCellComponent
  ],
  imports: [
    HttpClientModule,
    AgGridModule.withComponents([])
  ],
  providers: [DDMTLibService],
  exports: [DDMTGridComponent]
})
export class DDMTLibModule { }
