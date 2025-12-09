import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Dialog } from '@angular/cdk/dialog';
import { CitaService } from '../../services/cita.service';
import { AuthService } from '../../services/auth.service';
import { LoaderService } from '../../services/loader.service';

import { Cita } from '../../models/cita.model';
import { CreateEditCitaComponent } from './components/create-edit-cita/create-edit-cita';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: true,
  selector: 'app-citas',
  imports: [CommonModule, DatePipe],
  templateUrl: './citas.html',
  styleUrl: './citas.css',
})
export class CitasComponent implements OnInit {
  citas: Cita[] = [];
  errorMessage = '';

  constructor(
    private citaService: CitaService,
    private authService: AuthService,
    private loaderService: LoaderService,
    private toastService: ToastrService,
    private dialog: Dialog
  ) { }

  ngOnInit() {
    this.loadCitas();
  }

  isMiCita(cita: Cita): boolean {
    const usuario = this.authService.currentUserValue;
    return usuario ? cita.usuarioId === usuario.id : false;
  }

  loadCitas() {
    const usuario = this.authService.currentUserValue;
    if (!usuario) return;

    this.loaderService.showLoading();

    this.citaService.getMisCitas().subscribe({
      next: (response) => {
        this.citas = response.data;
        this.loaderService.hideLoading();
      },
      error: (error) => {
        this.loaderService.hideLoading();
        this.errorMessage = 'Error al cargar las citas';
        console.error('Error:', error.error.message);
      }
    });
  }

  openCreateModal() {
    const usuario = this.authService.currentUserValue;
    if (!usuario) return;

    const dialogRef = this.dialog.open(CreateEditCitaComponent, {
      data: { usuarioId: usuario.id },
      width: '500px',
    });

    dialogRef.closed.subscribe((result) => {
      if (result) {
        this.loadCitas();
      }
    });
  }

  openEditModal(cita: Cita) {
    const dialogRef = this.dialog.open(CreateEditCitaComponent, {
      data: { cita },
      width: '500px',
    });

    dialogRef.closed.subscribe((result) => {
      if (result) {
        this.loadCitas();
      }
    });
  }

  deleteCita(id: number) {
    if (!confirm('¿Estás seguro de eliminar esta cita?')) return;

    this.loaderService.showLoading();

    this.citaService.delete(id).subscribe({
      next: (response) => {
        this.loaderService.hideLoading();
        this.toastService.success(response.message);
        this.loadCitas();
      },
      error: (error) => {
        this.loaderService.hideLoading();
        this.toastService.error(error.error?.message || 'Error de conexión con el servidor');
        console.error('Error:', error);
      }
    });
  }
}
