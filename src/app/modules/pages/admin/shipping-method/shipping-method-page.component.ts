import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ShippingMethod } from 'src/app/core/models/shippingMethod.model';
import { AdminShippingMethodsService } from 'src/app/core/services/admin/shipping-methods/shipping-methods.service';
import { AdminDeleteShippingMethodModalComponent } from './components/delete-shipping-method-modal/delete-shipping-method-modal.component';
import { AdminEditShippingMethodModalComponent } from './components/edit-shipping-method-modal/edit-shipping-method-modal.component';
import { AdminAddShippingMethodModalComponent } from './components/add-shipping-method-modal/add-shipping-method-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-shipping-method',
  templateUrl: './shipping-method-page.component.html',
})
export class AdminShippingMethodsComponent implements OnInit {
  shippingMethodSearch = new FormControl('');
  shippingMethods!: Array<ShippingMethod> | undefined;

  constructor(
    private shippingMethodsService: AdminShippingMethodsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.shippingMethodsService
      .getAllShippingMethods()
      .subscribe((shippingMethods) => {
        this.shippingMethods = shippingMethods;
      });
  }

  openAddShippingMethodDialog(): void {
    const dialogRef = this.dialog.open(AdminAddShippingMethodModalComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Add') {
        this.shippingMethods = result.data;
      }
    });
  }

  openEditShippingMethodDialog(shippingMethod: any): void {
    const dialogRef = this.dialog.open(AdminEditShippingMethodModalComponent, {
      data: { shippingMethod },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Edit') {
        this.shippingMethods = result.data;
      }
    });
  }
  openDeleteShippingMethodDialog(shippingMethod: any): void {
    const dialogRef = this.dialog.open(
      AdminDeleteShippingMethodModalComponent,
      {
        data: { shippingMethod },
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Delete') {
        this.shippingMethods = result.data;
      }
    });
  }
}
