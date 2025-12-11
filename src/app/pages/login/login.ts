import { Component, OnInit } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { LoaderService } from '../../services/loader.service';
import { AuthService } from '../../services/auth.service';
import { LucideAngularModule } from "lucide-angular";

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  errorMessage = '';
  returnUrl: string = '/app/home';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Obtener returnUrl de los query params si existe
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/app/home';
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
          this.router.navigate([this.returnUrl]);
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
