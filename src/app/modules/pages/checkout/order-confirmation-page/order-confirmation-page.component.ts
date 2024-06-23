import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from 'src/app/core/models/order.model';
import { CheckoutService } from 'src/app/core/services/user/checkout/checkout.service';

@Component({
  selector: 'app-order-confirmation-page',
  templateUrl: './order-confirmation-page.component.html',
})
export class OrderConfirmationPageComponent implements OnInit {
  order: Order | undefined;

  constructor(
    private route: ActivatedRoute,
    private checkoutService: CheckoutService
  ) {
    // const queryParams = this.route.snapshot.queryParams;
    // this.orderNumber = queryParams['orderNumber'];
    // this.customerEmail = queryParams['email'];
  }
  ngOnInit(): void {
    const orderNumber = this.route.snapshot.queryParams['orderNumber'];
    const customerEmail = this.route.snapshot.queryParams['email'];
    this.checkoutService
      .getOrderReview(Number(orderNumber), customerEmail)
      .subscribe((order) => {
        this.order = order;
      });
  }
  print() {
    window.print();
  }
}
