import { Injectable } from '@angular/core';
import { DataTableBodyComponent } from '@swimlane/ngx-datatable';

@Injectable()
export class OverrideService {

  constructor() { }

  public static init(): void {
    DataTableBodyComponent.prototype.updateIndexes = function() {
        let first = 0;
        let last = 0;
    
        if (this.scrollbarV) {
          if (this.virtualization) {
            // Calculation of the first and last indexes will be based on where the
            // scrollY position would be at.  The last index would be the one
            // that shows up inside the view port the last.
            const height = parseInt(this.bodyHeight, 0);
            first = this.rowHeightsCache.getRowIndex(this.offsetY);
            last = this.rowHeightsCache.getRowIndex(height + this.offsetY) + 1;
          } else {
            // If virtual rows are not needed
            // We render all in one go
            first = 0;
            last = this.rowCount;
          }
        } else {
          // The server is handling paging and will pass an array that begins with the
          // element at a specified offset.  first should always be 0 with external paging.
          if (!this.externalPaging) {
            first = Math.max(this.offset * this.pageSize, 0);
            last = Math.min((first + this.pageSize), this.rowCount);
          } else {
            last = Math.min((first + this.pageSize), this.rowCount - this.offset * this.pageSize);
          }
        }
    
        this.indexes = { first, last };
      }
  }
}

