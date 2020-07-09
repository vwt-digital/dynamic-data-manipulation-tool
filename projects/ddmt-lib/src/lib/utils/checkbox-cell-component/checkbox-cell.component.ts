import { ICellRendererParams } from 'ag-grid-community';
import { ElementRef, ViewChild, Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'dat-checkbox-cell',
  template: `<input type="checkbox" [checked]="params.value" [disabled]="disabled" (change)="onChange($event)">`,
  styleUrls: ['./checkbox-cell.component.scss']
})
export class CheckboxCellComponent implements ICellRendererAngularComp {
  @ViewChild('.checkbox', { static: false }) checkbox: ElementRef;

  public params: ICellRendererParams;
  public disabled: boolean;

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.disabled = !this.params.colDef.editable;
  }

  refresh(): boolean {
    return false;
  }

  public onChange(event: any): void {
    this.params.setValue(event.currentTarget.checked);
  }
}
