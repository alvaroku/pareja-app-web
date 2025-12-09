import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dialog } from '@angular/cdk/dialog';
import { MetaService } from '../../services/meta.service';
import { AuthService } from '../../services/auth.service';
import { LoaderService } from '../../services/loader.service';
import { Meta, EstadoMeta, getEstadoMetaNombre } from '../../models/meta.model';
import { CreateEditMetaComponent } from './components/create-edit-meta/create-edit-meta';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog';
import { ToastrService } from 'ngx-toastr';
import { LucideAngularModule } from "lucide-angular";

@Component({
  standalone: true,
  selector: 'app-metas',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './metas.html',
  styleUrl: './metas.css',
})
export class MetasComponent implements OnInit {
  metas: Meta[] = [];
  errorMessage = '';

  constructor(
    private metaService: MetaService,
    private authService: AuthService,
    private loaderService: LoaderService,
    private toastService: ToastrService,
    private dialog: Dialog
  ) { }

  ngOnInit() {
    this.loadMetas();
  }

  isMiMeta(meta: Meta): boolean {
    const usuario = this.authService.currentUserValue;
    return usuario ? meta.usuarioId === usuario.id : false;
  }

  loadMetas() {
    const usuario = this.authService.currentUserValue;
    if (!usuario) return;

    this.loaderService.showLoading();

    this.metaService.getMisMetas().subscribe({
      next: (response) => {
        this.metas = response.data;
        this.loaderService.hideLoading();
      },
      error: (error) => {
        this.loaderService.hideLoading();
        this.errorMessage = 'Error al cargar las metas';
        console.error('Error:', error.error?.message);
      }
    });
  }

  openCreateModal() {
    const usuario = this.authService.currentUserValue;
    if (!usuario) return;

    const dialogRef = this.dialog.open(CreateEditMetaComponent, {
      data: { usuarioId: usuario.id },
      width: '500px',
    });

    dialogRef.closed.subscribe((result) => {
      if (result) {
        this.toastService.success('Meta creada exitosamente');
        this.loadMetas();
      }
    });
  }

  openEditModal(meta: Meta) {
    const dialogRef = this.dialog.open(CreateEditMetaComponent, {
      data: { meta },
      width: '500px',
    });

    dialogRef.closed.subscribe((result) => {
      if (result) {
        this.toastService.success('Meta actualizada exitosamente');
        this.loadMetas();
      }
    });
  }

  deleteMeta(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar Meta',
        message: '¿Estás seguro de que deseas eliminar esta meta?',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        isDanger: true
      }
    });

    dialogRef.closed.subscribe((confirmed) => {
      if (!confirmed) return;

      this.loaderService.showLoading();

      this.metaService.delete(id).subscribe({
        next: (response) => {
          this.loaderService.hideLoading();
          this.toastService.success(response.message);
          this.loadMetas();
        },
        error: (error) => {
          this.loaderService.hideLoading();
          this.toastService.error(error.error?.message || 'Error de conexión con el servidor');
          console.error('Error:', error);
        }
      });
    });
  }

  getEstadoNombre(estado: number): string {
    return getEstadoMetaNombre(estado);
  }

  getEstadoClass(estado: number): string {
    switch (estado) {
      case EstadoMeta.Completado:
        return 'from-indigo-300 to-indigo-500';
      case EstadoMeta.EnProgreso:
        return 'from-pink-300 to-pink-500';
      case EstadoMeta.Pendiente:
        return 'from-purple-300 to-purple-500';
      default:
        return 'from-gray-300 to-gray-500';
    }
  }
}
