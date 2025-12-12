import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-solicitar-recuperacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LucideAngularModule],
  templateUrl: './solicitar-recuperacion.html'
})
export class SolicitarRecuperacionComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  form: FormGroup;
  loading = false;
  submitted = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  constructor() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.message = '';

    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    const email = this.form.value.email;

    this.authService.requestPasswordRecovery(email).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.isSuccess) {
          this.messageType = 'success';
          this.message = response.message || 'Si el correo existe, recibirás un enlace de recuperación';
          this.form.reset();
          this.submitted = false;
        } else {
          this.messageType = 'error';
          this.message = response.message || 'Error al procesar la solicitud';
        }
      },
      error: (error) => {
        this.loading = false;
        this.messageType = 'error';
        this.message = error.error.message ?? 'Error al procesar la solicitud. Intenta nuevamente.';
        console.error('Error:', error);
      }
    });
  }
}
