import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dialog } from '@angular/cdk/dialog';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from '../../../../services/usuario.service';
import { Usuario } from '../../../../models/usuario.model';
import { LoaderService } from '../../../../services/loader.service';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-profile-photo',
  imports: [CommonModule],
  templateUrl: './profile-photo.html',
  styleUrl: './profile-photo.css',
})
export class ProfilePhoto {
  @Input() usuario!: Usuario;
  @Output() photoUpdated = new EventEmitter<void>();

  selectedFile: File | null = null;
  previewUrl: string | null = null;
  errorMessage: string = '';

  constructor(
    private usuarioService: UsuarioService,
    private toastr: ToastrService,
    private dialog: Dialog,
    private loaderService: LoaderService
  ) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      // Validar tipo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        this.errorMessage = 'Solo se permiten archivos de imagen (JPG, PNG, GIF, WEBP)';
        this.toastr.error(this.errorMessage);
        return;
      }

      // Validar tamaño (5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'El archivo no puede superar los 5MB';
        this.toastr.error(this.errorMessage);
        return;
      }

      this.selectedFile = file;
      this.errorMessage = '';

      // Preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  uploadPhoto(): void {
    if (!this.selectedFile) {
      this.toastr.error('Selecciona una imagen primero');
      return;
    }

    this.loaderService.showLoading();
    this.usuarioService.uploadProfilePhoto(this.usuario.id, this.selectedFile).subscribe({
      next: (response) => {
        this.loaderService.hideLoading();
        if (response.isSuccess) {
          this.toastr.success('Foto de perfil actualizada correctamente');
          this.selectedFile = null;
          this.previewUrl = null;
          this.photoUpdated.emit();
        } else {
          this.errorMessage = response.message || 'Error al subir la foto';
          this.toastr.error(this.errorMessage);
        }
      },
      error: (error) => {
        this.loaderService.hideLoading();
        this.errorMessage = 'Error al subir la foto';
        this.toastr.error(this.errorMessage);
        console.error(error);
      }
    });
  }

  deletePhoto(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar Foto de Perfil',
        message: '¿Estás seguro de que deseas eliminar tu foto de perfil?',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        isDanger: true
      }
    });

    dialogRef.closed.subscribe(confirmed => {
      if (confirmed) {
        this.loaderService.showLoading();
        this.usuarioService.deleteProfilePhoto(this.usuario.id).subscribe({
          next: (response) => {
            this.loaderService.hideLoading();
            if (response.isSuccess) {
              this.toastr.success('Foto de perfil eliminada correctamente');
              this.photoUpdated.emit();
            } else {
              this.errorMessage = response.message || 'Error al eliminar la foto';
              this.toastr.error(this.errorMessage);
            }
          },
          error: (error) => {
            this.loaderService.hideLoading();
            this.errorMessage = 'Error al eliminar la foto';
            this.toastr.error(this.errorMessage);
            console.error(error);
          }
        });
      }
    });
  }

  cancelPreview(): void {
    this.selectedFile = null;
    this.previewUrl = null;
    this.errorMessage = '';
  }

  getDisplayPhoto(): string | null {
    if (this.previewUrl) return this.previewUrl;
    if (this.usuario.resource?.urlPublica) return this.usuario.resource.urlPublica;
    return null;
  }

  hasPhoto(): boolean {
    return !!this.usuario.resource;
  }
}

