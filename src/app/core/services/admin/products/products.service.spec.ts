import { TestBed } from '@angular/core/testing';

import { AdminProductsService } from './products.service';

describe('ProductsService', () => {
  let service: AdminProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminProductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
