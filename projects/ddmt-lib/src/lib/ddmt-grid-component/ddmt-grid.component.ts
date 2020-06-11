import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'dat-ddmt-grid',
  templateUrl: './ddmt-grid.component.html',
  styleUrls: ['./ddmt-grid.component.scss']
})
export class DDMTGridComponent implements OnInit {
  @Input() role: string;
  @Input() apiUrl: string;
  @Input() entityName: string;

  constructor() { }

  ngOnInit(): void {

  }
}
