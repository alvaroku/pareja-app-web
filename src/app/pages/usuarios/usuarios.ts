import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dialog } from '@angular/cdk/dialog';
import { ToastrService } from 'ngx-toastr';
import { LucideAngularModule } from 'lucide-angular';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario, UserRole } from '../../models/usuario.model';
import { UserRolePipe } from '../../pipes/user-role.pipe';
import { LoaderService } from '../../services/loader.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog';
import { CreateEditUsuarioComponent } from './components/create-edit-usuario/create-edit-usuario.component';
import { SendNotificationComponent } from './components/send-notification/send-notification.component';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, UserRolePipe],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css'
})
export class UsuariosComponent implements OnInit {
  private usuarioService = inject(UsuarioService);
  private loaderService = inject(LoaderService);
  private toastService = inject(ToastrService);
  private dialog = inject(Dialog);

  usuarios = signal<Usuario[]>([]);
  UserRole = UserRole;  ngOnInit() {
    this.loadUsuarios();
  }

  loadUsuarios() {
    this.loaderService.showLoading();
    this.usuarioService.getAll().subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          this.usuarios.set(response.data);
        }
        this.loaderService.hideLoading();
      },
      error: (error) => {
        this.loaderService.hideLoading();
        this.toastService.error(error.error?.message || 'Error al cargar usuarios');
        console.error('Error:', error);
      }
    });
  }

  openCreateModal() {
    const dialogRef = this.dialog.open(CreateEditUsuarioComponent, {
      data: {},
      width: '500px',
    });

    dialogRef.closed.subscribe((result) => {
      if (result) {
        this.loadUsuarios();
      }
    });
  }

  openEditModal(usuario: Usuario) {
    const dialogRef = this.dialog.open(CreateEditUsuarioComponent, {
      data: { usuario },
      width: '500px',
    });

    dialogRef.closed.subscribe((result) => {
      if (result) {
        this.loadUsuarios();
      }
    });
  }

  openNotificationModal(usuario: Usuario) {
    const dialogRef = this.dialog.open(SendNotificationComponent, {
      data: { usuario },
      width: '500px',
    });

    dialogRef.closed.subscribe((result) => {
      if (result) {
        // Notificación enviada exitosamente
      }
    });
  }

  deleteUsuario(usuario: Usuario) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar Usuario',
        message: `¿Estás seguro de que deseas eliminar a "${usuario.nombre}"?`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        isDanger: true
      }
    });

    dialogRef.closed.subscribe((confirmed) => {
      if (!confirmed) return;

      this.loaderService.showLoading();
      this.usuarioService.delete(usuario.id).subscribe({
        next: (response) => {
          this.loaderService.hideLoading();
          if (response.isSuccess) {
            this.toastService.success('Usuario eliminado exitosamente');
            this.loadUsuarios();
          }
        },
        error: (error) => {
          this.loaderService.hideLoading();
          this.toastService.error(error.error?.message || 'Error al eliminar usuario');
          console.error('Error:', error);
        }
      });
    });
  }
}
