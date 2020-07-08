import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'dat-ddmt-pagination',
  templateUrl: './ddmt-pagination.component.html',
  styleUrls: ['./ddmt-pagination.component.scss', '../scss/shared.scss']
})
export class DDMTPaginationComponent implements OnInit {
  @Input() disabled = false;
  @Input() page: { next: string, previous: string };
  @Input() pageIdx = 1;
  @Input() gridName: string;
  @Output() nextAction: EventEmitter<string> = new EventEmitter<string>();
  @Output() refresh: EventEmitter<boolean> = new EventEmitter<boolean>();

  chunkSize = 30;

  ngOnInit(): void {
    const savedChunkSize = localStorage.getItem(`${this.gridName}-GRID-CHUNK-SIZE`);
    if (savedChunkSize) {
      this.chunkSize = JSON.parse(savedChunkSize);
    }
  }

  /**
   * Called when wanting to navigate to the next page.
   */
  nextPage(): void {
    if (this.page.next) {
      this.nextAction.emit(this.page.next);
      this.pageIdx++;
    }
  }

  /**
   * Called when wanting to navigate to the previous page.
   */
  previousPage(): void {
    if (this.page.previous && this.pageIdx !== 1) {
      this.nextAction.emit(this.page.previous);
      this.pageIdx--;
    }
  }

  /**
   * Requests a refresh of the data.
   */
  requestRefresh(): void {
    this.pageIdx = 1;
    this.refresh.emit(true);
  }

  /**
   * Called when changing the chunk size
   */
  confirmChunkSize(): void {
    localStorage.setItem(`${this.gridName}-GRID-CHUNK-SIZE`, JSON.stringify(this.chunkSize));
    this.requestRefresh();
  }
}
