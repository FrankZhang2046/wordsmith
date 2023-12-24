import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Auth,
  signInWithPopup,
  GoogleAuthProvider,
  User,
} from '@angular/fire/auth';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'lib-sign-in',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
})
export class SignInComponent implements OnInit {
  @Output() signInStatus = new EventEmitter();
  public signInForm!: FormGroup<{
    email: FormControl<string | null>;
    password: FormControl<string | null>;
  }>;
  public displaySignInForm!: boolean;
  public currentUserValue!: User | null;

  constructor(
    private auth: Auth,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private matDialog: MatDialog
  ) {}

  public get form() {
    return this.signInForm.controls;
  }

  public ngOnInit(): void {
    this.signInForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ],
    });
  }
  public signIn(signInMethod: string) {
    switch (signInMethod) {
      case 'google':
        signInWithPopup(this.auth, new GoogleAuthProvider())
          .then((result) => {
            this.signInStatus.emit({ status: 'success', message: 'logged in' });
          })
          .catch((error) =>
            this.signInStatus.emit({ status: 'error', message: error.code })
          );
        break;
      case 'email':
        this.displaySignInForm = true;
        break;
      default:
        break;
    }
  }
  public onSubmit(): void {
    // sign in the user with email and password
    this.authService
      .signInWithEmailAndPassword(
        this.form.email.value,
        this.form.password.value
      )
      .then((userCredential) => {
        this.signInStatus.emit({ status: 'success', message: 'logged in' });
      })
      .catch((error) => {
        console.error(`error caught in sign in component`, error);
        const errorMsg = error;
        this.signInStatus.emit({ status: 'error', message: error.code });
      });
  }
  public togglePasswordVisibility(
    inputComponent: HTMLInputElement,
    visible: boolean
  ) {
    if (visible) {
      inputComponent.type = 'text';
    } else {
      inputComponent.type = 'password';
    }
  }
  public openPasswordResetModal() {
    const dialogRef = this.matDialog.open(ConfirmPasswordResetComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.signInStatus.emit({
          status: 'success',
          message: 'password reset',
        });
      } else if (result !== false) {
        this.signInStatus.emit({ status: 'error', message: result.code });
      }
    });
  }
}
