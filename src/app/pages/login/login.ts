import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { LoaderService } from '../../services/loader.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loaderService: LoaderService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  submitForm() {
    this.submitted = true;
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      return;
    }

    this.loaderService.showLoading();

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.loaderService.hideLoading();
        if (response.isSuccess) {
          this.router.navigate(['/app/home']);
        } else {
          this.errorMessage = response.message || 'Error al iniciar sesión';
        }
      },
      error: (error) => {
        this.loaderService.hideLoading();
        this.errorMessage = error.error?.message || 'Error de conexión con el servidor';
        console.error('Error en login:', error);
      }
    });
  }
}
