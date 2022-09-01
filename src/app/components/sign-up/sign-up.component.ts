import {Component, OnInit} from '@angular/core';
import {AbstractControl, UntypedFormControl, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {switchMap} from "rxjs/operators";
import {AuthenticationService} from "../../services/authentication.service";
import {HotToastService} from "@ngneat/hot-toast";
import {Router} from "@angular/router";
import {UserService} from "../../services/user.service";


export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return {
        passwordDontMatch: true
      }
    }
    return null;
  }
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  form = new UntypedFormGroup({
    name: new UntypedFormControl('', [Validators.required]),
    email: new UntypedFormControl('', [Validators.required, Validators.email]),
    password: new UntypedFormControl('', (Validators.required)),
    confirmPassword: new UntypedFormControl('', (Validators.required))
  }, {validators: passwordMatchValidator()})

  constructor(private authService: AuthenticationService,
              private toast: HotToastService,
              private router: Router,
              private userService: UserService) {
  }

  ngOnInit(): void {
  }

  get name() {
    return this.form.get('name');
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  get confirmPassword() {
    return this.form.get('confirmPassword');
  }

  submit() {
    if (!this.form.valid) {
      return;
    }

    const {name, email, password} = this.form.value;

    this.authService
      .signUp(email, password)
      .pipe(
        switchMap(({user: {uid}}) => this.userService.addUserProfile({uid, email, displayName: name})),
        this.toast.observe({
          success: 'Congrats! Now you signed up!',
          loading: 'Signing up...',
          error: ({message}) => `${message}`,
        })
      )
      .subscribe(() => {
        this.router.navigate(['/home']);
      });
  }
}
