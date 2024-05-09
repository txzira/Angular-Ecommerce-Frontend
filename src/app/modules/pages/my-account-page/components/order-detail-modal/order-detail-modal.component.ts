import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-order-detail-modal',
  templateUrl: './order-detail-modal.component.html',
})
export class OrderDetailModalComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) private data: any) {}

  order: any;
  ngOnInit(): void {
    this.order = this.data.order;
    console.log(this.order);
  }
}
