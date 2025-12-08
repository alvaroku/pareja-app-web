import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';

import { LoaderService } from '../../services/loader.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  submitted = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loaderService: LoaderService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  get f() {
    return this.registerForm.controls;
  }

  submitForm() {
    this.submitted = true;
    this.errorMessage = '';

    if (this.registerForm.invalid) {
      return;
    }

    this.loaderService.showLoading();

    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        this.loaderService.hideLoading();
        if (response.isSuccess) {
          this.router.navigate(['/app/home']);
        } else {
          this.errorMessage = response.message || 'Error al registrarse';
        }
      },
      error: (error) => {
        this.loaderService.hideLoading();
        this.errorMessage = error.error?.message || 'Error de conexión con el servidor';
        console.error('Error en registro:', error);
      }
    });
  }
}
