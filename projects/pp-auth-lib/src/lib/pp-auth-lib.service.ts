import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PpAuthLibService {
  private _isProd: boolean = false;

  constructor() {}

  public get isProd(): boolean {
    return this._isProd;
  }

  public set isProd(value: boolean) {
    this._isProd = value;
  }
}
