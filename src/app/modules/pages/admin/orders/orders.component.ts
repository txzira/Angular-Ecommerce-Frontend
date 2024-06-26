import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Order } from 'src/app/core/models/order.model';
import { AdminOrdersService } from 'src/app/core/services/admin/orders/orders.service';
import { AdminOrderDetailsModalComponent } from './components/order-details-modal/order-details-modal.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
})
export class AdminOrdersPageComponent implements OnInit {
  orderSearch = new FormControl('');
  orders!: Array<Order>;

  constructor(
    private ordersService: AdminOrdersService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.ordersService.getAllOrders().subscribe((_orders) => {
      this.orders = _orders;
    });
  }

  openOrderDetails(order: Order) {
    const dialogRef = this.dialog.open(AdminOrderDetailsModalComponent, {
      data: { orderId: order.id },
      width: '70%',
      height: '80%',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (order.status) {
        order.status = result.data;
      }
    });
  }
}
