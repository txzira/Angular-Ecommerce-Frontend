import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from 'src/app/core/models/category.model';

import env from 'src/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminCategoriesService {
  private ADMIN_CATEGORIES_URL = !env.production
    ? 'http://localhost:4000/admin/categories'
    : 'productionUrl';

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
  };

  constructor(private httpClient: HttpClient) {}

  addCategory(category: any): Observable<any> {
    return this.httpClient.post<any>(
      this.ADMIN_CATEGORIES_URL + '/add-category',
      { category },
      this.httpOptions
    );
  }

  getCategoryById(categoryId: string | null): Observable<{
    category: Category;
    subcategories: { name: string; id: number }[];
  }> {
    return this.httpClient.get<{
      category: Category;
      subcategories: { name: string; id: number }[];
    }>(`${this.ADMIN_CATEGORIES_URL}/get-category/${categoryId}`);
  }

  editCategoryById(
    categoryId: string | null,
    category: Category
  ): Observable<Category> {
    return this.httpClient.post<Category>(
      `${this.ADMIN_CATEGORIES_URL}/edit-category/${categoryId}`,
      { category },
      this.httpOptions
    );
  }

  deleteCategory(categoryId: string): Observable<Array<Category>> {
    return this.httpClient.delete<Array<Category>>(
      `${this.ADMIN_CATEGORIES_URL}/delete-category/${categoryId}`,
      this.httpOptions
    );
  }
}
