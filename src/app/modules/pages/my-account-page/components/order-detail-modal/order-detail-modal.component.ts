import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Order } from 'src/app/core/models/order.model';
import { BrowserDetectorService } from 'src/app/core/services/user/broswer-detector/browser-detector.service';

@Component({
  selector: 'app-order-detail-modal',
  templateUrl: './order-detail-modal.component.html',
})
export class OrderDetailModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    public browserDetectorService: BrowserDetectorService
  ) {
    console.log(this.data);
  }

  order = this.data.order;
  cart = this.data.order.cart;
}
