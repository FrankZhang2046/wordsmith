import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  Auth,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
} from '@angular/fire/auth';
import { PpAuthLibService } from '../pp-auth-lib.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface AuthStatus {
  status: 'success' | 'error';
  message: any;
}

@Component({
  selector: 'lib-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatButtonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent implements OnInit {
  @Output() signUpStatus: EventEmitter<AuthStatus> = new EventEmitter();
  public signUpForm!: FormGroup<{
    email: FormControl<string | null>;
    password: FormControl<string | null>;
    confirmPassword: FormControl<string | null>;
  }>;

  constructor(
    private auth: Auth,
    private authService: PpAuthLibService,
    private formBuilder: FormBuilder
  ) {}

  public get f() {
    return this.signUpForm.controls;
  }

  public displaySignInForm: boolean = false;
  public ngOnInit(): void {
    this.signUpForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ],
      confirmPassword: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ],
    });

    // listen for confirmPassword's valueChange event, if the value isn't the same as the password field's value, set 'passwordMismatch' error on confirmPassword
    this.signUpForm.get('confirmPassword')?.valueChanges.subscribe((value) => {
      if (value !== this.signUpForm.controls['password'].value) {
        this.signUpForm.controls['confirmPassword'].setErrors({
          passwordMismatch: true,
        });
      } else {
        this.signUpForm.controls['confirmPassword'].setErrors(null);
      }
    });
  }

  public signUp(signInMethod: string) {
    switch (signInMethod) {
      // todo this case is probably best handled by a service
      case 'google':
        signInWithPopup(this.auth, new GoogleAuthProvider())
          .then((userCred) => {
            this.signUpStatus.emit({ status: 'success', message: 'logged in' });
          })
          .catch((error) => {
            this.signUpStatus.emit({ status: 'error', message: error.code });
          });
        break;
      case 'email':
        this.displayEmailSignInForm();
        break;
      default:
        break;
    }
  }

  private displayEmailSignInForm() {
    this.displaySignInForm = true;
  }
  public onSubmit() {
    // Check if the form is valid
    if (this.signUpForm.invalid) {
      return;
    }

    // Get the user input values
    const email = this.f['email'].value;
    const password = this.f['password'].value;

    // TODO: Implement the sign-up logic using Firebase or your preferred authentication service
    this.authService
      .signUpWithEmailAndPassword(email, password)
      .then((res) => {
        const actionCodeSettings = {
          url: this.auth
            ? 'https://https://wordsmith-vocabulary-builder.web.app/'
            : 'http://localhost:4200',
          handleCodeInApp: true,
        };
        if ((res.user as User).providerData[0].providerId === 'password') {
          this.sendEmailVerification(res.user, actionCodeSettings);
        } else {
          this.signUpStatus.emit({ status: 'success', message: 'logged in' });
        }
      })
      .catch((err) =>
        this.signUpStatus.emit({ status: 'error', message: err.code })
      );
  }

  private sendEmailVerification(
    userObject: User,
    actionCodeSettings: { handleCodeInApp: boolean; url: string }
  ) {
    sendEmailVerification(userObject, actionCodeSettings)
      .then((res) =>
        this.signUpStatus.emit({
          status: 'success',
          message: 'verification sent',
        })
      )
      .catch((error) =>
        this.signUpStatus.emit({ status: 'error', message: error.code })
      );
  }

  /*
    method to toggle target password input component's type between password and string
     */
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
}
