import { Component, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../shared/loader/loader';
import { AuthService } from '../../services/auth.service';
import { LucideAngularModule } from "lucide-angular";
import { UserRole } from '../../models/usuario.model';

@Component({
  selector: 'app-menu-layout',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, LoaderComponent, LucideAngularModule],
  templateUrl: './menu-layout.html',
  styleUrl: './menu-layout.css',
})
export class MenuLayoutComponent {
  menuOpen = false;

  currentUser = computed(() => this.authService.currentUserValue);
  isSuperAdmin = computed(() => this.currentUser()?.role === UserRole.SuperAdmin);

  menuItems = [
    { ruta: '/app/home', icono: 'home', nombre: 'Inicio', onClick: () => this.toggleMenu() },
    { ruta: '/app/citas', icono: 'calendar', nombre: 'Citas', onClick: () => this.toggleMenu() },
    { ruta: '/app/metas', icono: 'target', nombre: 'Metas', onClick: () => this.toggleMenu() },
    { ruta: '/app/memorias', icono: 'camera', nombre: 'Memorias', onClick: () => this.toggleMenu() },
    { ruta: '/app/usuarios', icono: 'users', nombre: 'Usuarios', onClick: () => this.toggleMenu(), requiresSuperAdmin: true },
    { ruta: '/app/perfil', icono: 'user', nombre: 'Perfil', onClick: () => this.toggleMenu() },
  ];

  constructor(private authService: AuthService) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    this.authService.logout();
  }
}
