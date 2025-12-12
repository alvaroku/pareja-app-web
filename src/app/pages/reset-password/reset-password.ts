import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LucideAngularModule],
  templateUrl: './reset-password.html'
})
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form: FormGroup;
  loading = false;
  submitted = false;
  message = '';
  messageType: 'success' | 'error' = 'success';
  token = '';
  showPassword = false;
  showConfirmPassword = false;

  constructor() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    if (!this.token) {
      this.messageType = 'error';
      this.message = 'Token de recuperación no válido';
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  get f() {
    return this.form.controls;
  }

  togglePasswordVisibility(field: 'password' | 'confirm'): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  onSubmit(): void {
    this.submitted = true;
    this.message = '';

    if (this.form.invalid || !this.token) {
      return;
    }

    this.loading = true;
    const { email, newPassword } = this.form.value;

    this.authService.resetPassword(this.token, email, newPassword).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.isSuccess) {
          this.messageType = 'success';
          this.message = response.message || 'Contraseña actualizada exitosamente';
          this.form.reset();
          this.submitted = false;
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        } else {
          this.messageType = 'error';
          this.message = response.message || 'Error al restablecer la contraseña';
        }
      },
      error: (error) => {
        this.loading = false;
        this.messageType = 'error';
        this.message = error.error.message ?? 'Error al restablecer la contraseña. Intenta nuevamente.';
        console.error('Error:', error);
      }
    });
  }
}
