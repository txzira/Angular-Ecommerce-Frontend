import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import env from 'src/environments/environment';
import { Brand } from '../../../models/brand.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BrandsService {
  // private BRANDS_URL = !env.production
  //   ? 'http://localhost:4000/brands'
  //   : `${env.express_server_url}/brands`;
  private BRANDS_URL = process.env['production']
    ? 'http://localhost:4000/brands'
    : `${process.env['express_server_url']}/brands`;

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),

    withCredentials: true,
  };
  constructor(private httpClient: HttpClient) {}

  getAllBrands(): Observable<Array<Brand>> {
    return this.httpClient.get<Array<Brand>>(
      `${this.BRANDS_URL}/get-all-brands`
    );
  }
}
