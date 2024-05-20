import { Component } from '@angular/core';
import env from 'src/environments/environment';

@Component({
  selector: 'app-google-button',
  templateUrl: './google-button.component.html',
})
export class GoogleButtonComponent {
  isProduction: boolean = env.production;
  constructor() {}
}
