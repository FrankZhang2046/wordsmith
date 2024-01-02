import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UtilitiesService {
  constructor(private router: Router) {}

  public navigateMethod(target: string) {
    this.router.navigate([`/${target}`]);
  }
}
