import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { LoaderService } from '../../services/loader.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class PerfilComponent implements OnInit {
  daysCount: number = 0;
  currentUser: Usuario | null = null;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private loaderService: LoaderService,

  ) {}

  ngOnInit() {
    const anniversary = new Date('2023-01-01');
    const now = new Date();
    const diff = now.getTime() - anniversary.getTime();
    this.daysCount = Math.floor(diff / (1000 * 60 * 60 * 24));

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }




  logout() {
    this.authService.logout();
  }
}
