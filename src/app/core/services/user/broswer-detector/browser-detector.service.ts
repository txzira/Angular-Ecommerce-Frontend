import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BrowserDetectorService {
  constructor() {}
  iOS() {
    return [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod',
    ].includes(window.navigator.platform);
  }

  isMobile(): boolean {
    return window.navigator.maxTouchPoints > 1;
  }
}
