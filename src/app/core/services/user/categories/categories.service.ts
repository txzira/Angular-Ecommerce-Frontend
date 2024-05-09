import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../../../models/category.model';
import env from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private CATEGORIES_URL = !env.production
    ? 'http://localhost:4000/categories'
    : `${env.express_server_url}/categories`;

  // private CATEGORIES_URL = process.env['production']
  //   ? 'http://localhost:4000/categories'
  //   : `${process.env['express_server_url']}/categories`;

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
  };

  constructor(private httpClient: HttpClient) {}

  getAllCategories(): Observable<Array<Category>> {
    return this.httpClient.get<Array<Category>>(
      `${this.CATEGORIES_URL}/get-categories`
    );
  }
  getParentCategories(): Observable<Array<Category>> {
    return this.httpClient.get<Array<Category>>(
      `${this.CATEGORIES_URL}/get-parent-categories`
    );
  }
}
