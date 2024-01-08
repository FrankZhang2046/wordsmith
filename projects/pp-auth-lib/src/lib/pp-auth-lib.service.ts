import { Injectable, WritableSignal, signal } from '@angular/core';
import {
  Auth,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class PpAuthLibService {
  private _isProd: boolean = false;
  public authenticatedUserSignal: WritableSignal<User | null> =
    signal<User | null>(null);

  constructor(private auth: Auth) {}

  public get isProd(): boolean {
    return this._isProd;
  }

  public set isProd(value: boolean) {
    this._isProd = value;
  }

  /*
    return the current user from the auth service
    */
  public async getCurrentUser(): Promise<User | null> {
    await this.auth.authStateReady();
    return this.auth.currentUser;
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
