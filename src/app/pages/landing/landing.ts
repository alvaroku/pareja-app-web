import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-landing',
  imports: [],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
  constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

  goToLogin(): void {
    // Verificar si ya hay sesión activa
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/app/home']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
