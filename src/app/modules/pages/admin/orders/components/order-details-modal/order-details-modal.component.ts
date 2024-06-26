import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Order, Tracking } from 'src/app/core/models/order.model';
import { AdminOrdersService } from 'src/app/core/services/admin/orders/orders.service';
import { ConfirmSendTrackingEmailComponent } from './components/confirm-send-tracking-email/confirm-send-tracking-email.component';

@Component({
  selector: 'app-order-details-modal',
  templateUrl: './order-details-modal.component.html',
})
export class AdminOrderDetailsModalComponent {
  order: Order | undefined;
  trackingExist = false;
  tracking = new FormGroup({
    id: new FormControl<string | undefined>(''),
    tracking_number: new FormControl<string | undefined>(''),
    carrier: new FormControl<'UPS' | 'USPS' | 'FEDEX'>('UPS'),
    email_sent: new FormControl<boolean | undefined>(false),
  });
  //
  constructor(
    private dialogRef: MatDialogRef<AdminOrderDetailsModalComponent>,
    private adminOrdersService: AdminOrdersService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.adminOrdersService
      .getOrderById(data.orderId.toString())
      .subscribe((order) => {
        console.log(order);
        this.order = order;
        if (order.tracking?.id) {
          this.trackingExist = true;
          this.tracking.setValue({
            id: order.tracking?.id,
            carrier: order.tracking?.carrier,
            tracking_number: order.tracking?.tracking_number,
            email_sent: order.tracking?.email_sent,
          });
        }
      });
  }

  sendTracking() {
    this.adminOrdersService
      .setTracking(this.order?.id.toString()!, this.tracking.value as Tracking)
      .subscribe({
        next: (response) => {
          console.log(response);
          if (response.status === 'success') {
            this.tracking.patchValue({ id: response.trackingId });
            this.trackingExist = true;
            this.snackBar.open('\u2705Tracking number set.', 'Ok', {
              duration: 3000,
            });
          }
        },
        error: (err) => {
          if (err.error.status)
            this.snackBar.open('\u274cTracking number cannot be empty', 'Ok', {
              duration: 3000,
            });
        },
      });
  }

  openConfirmationDialog() {
    if (this.tracking.value.email_sent) {
      // const dialogRef =
      this.dialog.open(ConfirmSendTrackingEmailComponent, {
        data: { tracking: this.tracking.value },
        width: '30%',
        height: '30%',
      });
      // dialogRef.afterClosed().subscribe((result) => {
      //   this.tracking.patchValue({ email_sent: result.data });
      // });
    } else {
      this.sendTrackingEmail();
    }
  }

  sendTrackingEmail() {
    if (this.tracking.value.id)
      this.adminOrdersService
        .sendTrackingEmail(this.tracking.value.id)
        .subscribe((response) => {
          if (response.status === 'success') {
            this.tracking.patchValue({ email_sent: true });
            if (this.order?.status) {
              this.order.status = response.orderStatus;
              this.dialogRef.close({ data: response.orderStatus });
            }
          }
        });
  }
}
