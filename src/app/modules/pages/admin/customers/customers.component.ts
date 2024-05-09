import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { customer } from 'src/app/core/models/customer.model';
import { AdminCustomersService } from 'src/app/core/services/admin/customers/customers.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
})
export class AdminCustomersPageComponent implements OnInit {
  customerSearch = new FormControl('');
  customers!: Array<customer>;

  constructor(private adminCustomersService: AdminCustomersService) {}

  ngOnInit(): void {
    this.adminCustomersService.getAllCustomers().subscribe((_customers) => {
      this.customers = _customers;
    });
  }
}
