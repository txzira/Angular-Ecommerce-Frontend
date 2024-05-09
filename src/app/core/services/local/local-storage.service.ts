import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  public saveLocalStorageData(key: string, value: any): void {
    localStorage.setItem(key, value);
  }
  public getLocalStorageData(key: string): string | null {
    return localStorage.getItem(key);
  }
  public clearLocalStorageData(key: string): void {
    localStorage.removeItem(key);
  }
}
