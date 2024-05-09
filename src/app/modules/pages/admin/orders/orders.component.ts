import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Order } from 'src/app/core/models/order.model';
import { AdminOrdersService } from 'src/app/core/services/admin/orders/orders.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
})
export class AdminOrdersPageComponent implements OnInit {
  orderSearch = new FormControl('');
  orders!: Array<Order>;

  constructor(private ordersService: AdminOrdersService) {}

  ngOnInit(): void {
    this.ordersService.getAllOrders().subscribe((_orders) => {
      this.orders = _orders;
    });
  }
}
