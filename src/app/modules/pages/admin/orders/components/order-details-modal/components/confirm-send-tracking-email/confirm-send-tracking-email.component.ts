import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdminOrdersService } from 'src/app/core/services/admin/orders/orders.service';

@Component({
  selector: 'app-confirm-send-tracking-email',
  templateUrl: './confirm-send-tracking-email.component.html',
})
export class ConfirmSendTrackingEmailComponent {
  trackingId = '';

  constructor(
    private dialogRef: MatDialogRef<ConfirmSendTrackingEmailComponent>,
    private adminOrdersService: AdminOrdersService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.trackingId = this.data.tracking.id;
  }

  sendTrackingEmail() {
    if (this.trackingId)
      this.adminOrdersService
        .sendTrackingEmail(this.trackingId)
        .subscribe((response) => {
          // if (response.status === 'success') {
          //   this.dialogRef.close({ data: true });
          // }
        });
  }
}
