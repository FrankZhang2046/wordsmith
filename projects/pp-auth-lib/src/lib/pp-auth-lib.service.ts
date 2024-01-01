import { Injectable } from '@angular/core';
import {
  Auth,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
} from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PpAuthLibService {
  private _isProd: boolean = false;
  public authenticatedUser$: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(null);

  constructor(private auth: Auth) {}

  public get isProd(): boolean {
    return this._isProd;
  }

  public set isProd(value: boolean) {
    this._isProd = value;
  }

  public signInWithEmailAndPassword(
    email: string | null,
    password: string | null
  ): Promise<any> {
    if (!email || !password) {
      return new Promise((res, rej) => res(null));
    }
    return signInWithEmailAndPassword(this.auth, email, password).catch(
      (error) => {
        throw error;
      }
    );
  }
  public signUpWithEmailAndPassword(
    email: string | null,
    password: string | null
  ): Promise<any> {
    if (!email || !password) {
      return new Promise((res, rej) => res(null));
    }
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  public sendPasswordResetEmail(email: string | null): Promise<any> {
    if (email !== null) {
      return sendPasswordResetEmail(this.auth, email ?? '');
    } else {
      return new Promise((res, rej) => res(null));
    }
  }

  public signOut(): void {
    this.auth.signOut();
  }
}
