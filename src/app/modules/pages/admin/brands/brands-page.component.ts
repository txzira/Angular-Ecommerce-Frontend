import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Brand } from 'src/app/core/models/brand.model';
import { BrandsService } from 'src/app/core/services/user/brands/brands.service';
import { AdminAddBrandModalComponent } from './components/add-brand-modal/add-brand-modal.component';
import { AdminEditBrandModalComponent } from './components/edit-brand-modal/edit-brand-modal.component';
import { AdminDeleteBrandModalComponent } from './components/delete-brand-modal/delete-brand-modal.component';

@Component({
  selector: 'app-brands',
  templateUrl: './brands-page.component.html',
})
export class AdminBrandsPageComponent implements OnInit {
  brandSearch = new FormControl('');
  brands!: Array<Brand> | undefined;

  constructor(
    private brandsService: BrandsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.brandsService
      .getAllBrands()
      .subscribe((_brands) => (this.brands = _brands));
  }

  openAddBrandDialog(): void {
    const dialogRef = this.dialog.open(AdminAddBrandModalComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Add') {
        this.brands = result.data;
      }
    });
  }

  openEditBrandDialog(brand: any): void {
    const dialogRef = this.dialog.open(AdminEditBrandModalComponent, {
      data: { brand },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Edit') {
        this.brands = result.data;
      }
    });
  }
  openDeleteBrandDialog(brand: any): void {
    const dialogRef = this.dialog.open(AdminDeleteBrandModalComponent, {
      data: { brand },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Delete') {
        this.brands = result.data;
      }
    });
  }
}
