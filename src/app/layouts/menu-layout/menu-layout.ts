import { Component, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../shared/loader/loader';
import { AuthService } from '../../services/auth.service';
import { LucideAngularModule } from "lucide-angular";
import { UserRole } from '../../models/usuario.model';
import { PERMISSIONS } from '../../constants/permission.constants';
import { MenuItem } from '../../models/menu-item.model';

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


  menuItems: MenuItem[] = [];
  constructor(private authService: AuthService) {
    this.menuItems = PERMISSIONS[this.currentUser()!.role!];
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    this.authService.logout();
  }
}
