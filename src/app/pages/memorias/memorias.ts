import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dialog } from '@angular/cdk/dialog';
import { ToastrService } from 'ngx-toastr';
import { Memoria } from '../../models/memoria.model';
import { MemoriaService } from '../../services/memoria.service';
import { AuthService } from '../../services/auth.service';
import { LoaderService } from '../../services/loader.service';
import { CreateEditMemoriaComponent } from './create-edit-memoria/create-edit-memoria.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog';
import { LucideAngularModule } from "lucide-angular";

@Component({
  standalone: true,
  selector: 'app-memorias',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './memorias.html',
  styleUrl: './memorias.css',
})
export class MemoriasComponent implements OnInit {
  memorias: Memoria[] = [];
  errorMessage = '';

  constructor(
    private memoriaService: MemoriaService,
    private authService: AuthService,
    private loaderService: LoaderService,
    private toastService: ToastrService,
    private dialog: Dialog
  ) { }

  ngOnInit() {
    this.loadMemorias();
  }

  isMiMemoria(memoria: Memoria): boolean {
    const usuario = this.authService.currentUserValue;
    return usuario ? memoria.usuarioId === usuario.id : false;
  }

  loadMemorias() {
    const usuario = this.authService.currentUserValue;
    if (!usuario) return;

    this.loaderService.showLoading();

    this.memoriaService.getMisMemorias().subscribe({
      next: (response) => {
        this.memorias = response.data;
        this.loaderService.hideLoading();
      },
      error: (error) => {
        this.loaderService.hideLoading();
        this.errorMessage = 'Error al cargar las memorias';
        console.error('Error:', error.error?.message);
      }
    });
  }

  openCreateModal() {
    const usuario = this.authService.currentUserValue;
    if (!usuario) return;

    const dialogRef = this.dialog.open(CreateEditMemoriaComponent, {
      data: { usuarioId: usuario.id },
      width: '500px',
    });

    dialogRef.closed.subscribe((result) => {
      if (result) {
        this.toastService.success('Memoria creada exitosamente');
        this.loadMemorias();
      }
    });
  }

  openEditModal(memoria: Memoria) {
    const dialogRef = this.dialog.open(CreateEditMemoriaComponent, {
      data: { memoria },
      width: '500px',
    });

    dialogRef.closed.subscribe((result) => {
      if (result) {
        this.loadMemorias();
      }
    });
  }

  deleteMemoria(memoria: Memoria) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar Memoria',
        message: `¿Estás seguro de que deseas eliminar "${memoria.titulo}"?`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        isDanger: true
      }
    });

    dialogRef.closed.subscribe((confirmed) => {
      if (!confirmed) return;

      this.loaderService.showLoading();

      this.memoriaService.delete(memoria.id).subscribe({
        next: (response) => {
          this.loaderService.hideLoading();
          this.toastService.success(response.message);
          this.loadMemorias();
        },
        error: (error) => {
          this.loaderService.hideLoading();
          this.toastService.error(error.error?.message || 'Error de conexión con el servidor');
          console.error('Error:', error);
        }
      });
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }
}


