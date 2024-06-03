import { TestBed } from '@angular/core/testing';

import { ShippingMethodsService } from './shipping-methods.service';

describe('ShippingMethodsService', () => {
  let service: ShippingMethodsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShippingMethodsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
