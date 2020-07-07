import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'dat-ddmt-pagination',
  templateUrl: './ddmt-pagination.component.html',
  styleUrls: ['./ddmt-pagination.component.scss', '../scss/shared.scss']
})
export class DDMTPaginationComponent {
  @Input() disabled = false;
  @Input() page: { next: string, previous: string };
  @Input() pageIdx = 1;
  @Input() chunkSize: number;
  @Output() nextAction: EventEmitter<string> = new EventEmitter<string>();
  @Output() chunkSizeChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() refresh: EventEmitter<boolean> = new EventEmitter<boolean>();

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
    if (this.page.previous) {
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
    this.chunkSizeChange.emit(this.chunkSize);
  }
}
