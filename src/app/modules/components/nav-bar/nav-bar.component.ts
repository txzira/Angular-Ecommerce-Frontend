import { Component, Input, OnInit } from '@angular/core';
import { Cart } from '../../../core/models/cart.model';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
})
export class NavBarComponent implements OnInit {
  @Input() cart!: Cart;

  constructor() {}
  ngOnInit(): void {}
  showStaticLogo(): void {
    (document.getElementById('logo') as HTMLImageElement).src =
      '/assets/images/pseudo-corp.png';
  }
  showLogoAnimation(): void {
    (document.getElementById('logo') as HTMLImageElement).src =
      '/assets/images/pseudo-corp2.gif';
  }
}
