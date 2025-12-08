import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CitaService } from '../../services/cita.service';
import { AuthService } from '../../services/auth.service';
import { LoaderService } from '../../services/loader.service';
import { Cita } from '../../models/cita.model';

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
    private loaderService: LoaderService
  ) {}

  ngOnInit() {
    this.loadCitas();
  }

  loadCitas() {
    const usuario = this.authService.currentUserValue;
    if (!usuario) return;

    this.loaderService.showLoading();

    this.citaService.getByUsuarioId(usuario.id).subscribe({
      next: (response) => {
        this.loaderService.hideLoading();
        if (response.isSuccess) {
          this.citas = response.data;
        } else {
          this.errorMessage = response.message;
        }
      },
      error: (error) => {
        this.loaderService.hideLoading();
        this.errorMessage = 'Error al cargar las citas';
        console.error('Error:', error);
      }
    });
  }

  deleteCita(id: number) {
    if (!confirm('¿Estás seguro de eliminar esta cita?')) return;

    this.loaderService.showLoading();

    this.citaService.delete(id).subscribe({
      next: (response) => {
        this.loaderService.hideLoading();
        if (response.isSuccess) {
          this.loadCitas(); // Recargar lista
        } else {
          this.errorMessage = response.message;
        }
      },
      error: (error) => {
        this.loaderService.hideLoading();
        this.errorMessage = 'Error al eliminar la cita';
        console.error('Error:', error);
      }
    });
  }
}
