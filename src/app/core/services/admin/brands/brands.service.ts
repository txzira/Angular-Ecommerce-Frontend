import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Brand } from 'src/app/core/models/brand.model';
import env from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminBrandsService {
  // private ADMIN_BRANDS_URL = !env.production
  //   ? 'http://localhost:4000/admin/brands'
  //   : `${env.express_server_url}/admin/brands`;
  private ADMIN_BRANDS_URL = process.env['production']
    ? 'http://localhost:4000/admin/brands'
    : `${process.env['express_server_url']}/admin/brands`;

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),

    withCredentials: true,
  };

  constructor(private httpClient: HttpClient) {}

  addBrand(brand: any): Observable<Array<Brand>> {
    return this.httpClient.post<Array<Brand>>(
      `${this.ADMIN_BRANDS_URL}/add-brand`,
      {
        brand,
      },
      this.httpOptions
    );
  }

  editBrand(brand: any): Observable<Array<Brand>> {
    return this.httpClient.post<Array<Brand>>(
      `${this.ADMIN_BRANDS_URL}/edit-brand`,
      {
        brand,
      },
      this.httpOptions
    );
  }

  deleteBrand(brandId: string): Observable<Array<Brand>> {
    return this.httpClient.delete<Array<Brand>>(
      `${this.ADMIN_BRANDS_URL}/delete-brand/${brandId}`,
      this.httpOptions
    );
  }
}
