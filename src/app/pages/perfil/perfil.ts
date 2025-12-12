import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dialog } from '@angular/cdk/dialog';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { LoaderService } from '../../services/loader.service';
import { ResourceResponse, Usuario } from '../../models/usuario.model';
import { EditProfileComponent } from './components/edit/edit-profile';
import { ParejaManagerComponent } from './components/pareja-manager/pareja-manager';
import { ProfilePhoto } from './components/profile-photo/profile-photo';
import { LucideAngularModule } from "lucide-angular";

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ParejaManagerComponent, ProfilePhoto, LucideAngularModule],
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
    private dialog: Dialog
  ) {}

  ngOnInit() {
    const anniversary = new Date('2023-01-01');
    const now = new Date();
    const diff = now.getTime() - anniversary.getTime();
    this.daysCount = Math.floor(diff / (1000 * 60 * 60 * 24));

      this.authService.currentUser$.subscribe(user => {
       this.currentUser = user;
     }); }

  onPhotoUpdated(response: ResourceResponse) {
    // Recargar datos del usuario para actualizar la foto
    if (this.currentUser) {
      this.currentUser.resource = response
      this.authService.updateCurrentUser(this.currentUser);
    }
  }

  openEditModal() {
    if (!this.currentUser) return;

    const dialogRef = this.dialog.open(EditProfileComponent, {
      data: this.currentUser,
      width: '500px',
    });

    dialogRef.closed.subscribe((result) => {
      if (result) {
        // Profile updated successfully
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}
