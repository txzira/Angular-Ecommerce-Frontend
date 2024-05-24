import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BrowserDetectorService {
  constructor() {}

  isMobile(): boolean {
    return window.navigator.maxTouchPoints > 0;
  }
}
