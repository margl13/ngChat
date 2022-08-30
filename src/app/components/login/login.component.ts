import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../../services/authentication.service";
import {Router} from "@angular/router";
import {HotToastService} from '@ngneat/hot-toast';
import {Observable} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    }
  )

  constructor(private authService: AuthenticationService,
              private router: Router,
              private toast: HotToastService) {
  }

  ngOnInit(): void {
  }

  navigateTo(value: any) {
    this.router.navigate(['../', value]);
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password')
  }

  submit() {
    const {email, password} = this.loginForm.value;

    if (!this.loginForm.valid || !email || !password) {
      return;
    }

    this.authService.login(email, password).pipe(this.toast.observe({
      success: 'Logged in successfully',
      loading: 'Logging in...',
      error: ({message}) => `There was an error: ${message}`
    })).subscribe(() => {
      this.router.navigate(['/home'])
    })
  }

}
