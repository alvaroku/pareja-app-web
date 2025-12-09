import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

import { LoaderComponent } from '../../shared/loader/loader';
import { AuthService } from '../../services/auth.service';
import { LucideAngularModule } from "lucide-angular";

@Component({
  selector: 'app-menu-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LoaderComponent, LucideAngularModule],
  templateUrl: './menu-layout.html',
  styleUrl: './menu-layout.css',
})
export class MenuLayoutComponent {
  menuOpen = false;

  constructor(private authService: AuthService) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    this.authService.logout();
  }
}
