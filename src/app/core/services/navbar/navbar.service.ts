import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavbarService {
  private isOpenSource = new BehaviorSubject<boolean>(false);
  isOpen = this.isOpenSource.asObservable();

  constructor() {}

  changeIsOpen() {
    this.isOpenSource.next(!this.isOpenSource.value);
  }
}
