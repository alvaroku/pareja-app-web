import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { CitaService } from '../../../../services/cita.service';
import { LoaderService } from '../../../../services/loader.service';
import { Cita, CreateCitaDto, UpdateCitaDto } from '../../../../models/cita.model';
import { ToastrService } from 'ngx-toastr';
import { LucideAngularModule } from "lucide-angular";

@Component({
  selector: 'app-create-edit-cita',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './create-edit-cita.html',
  styleUrl: './create-edit-cita.css',
})
export class CreateEditCitaComponent implements OnInit {
  public dialogRef = inject(DialogRef);
  private fb = inject(FormBuilder);
  private citaService = inject(CitaService);
  private loaderService = inject(LoaderService);
  public data = inject<{ cita?: Cita; usuarioId?: number }>(DIALOG_DATA);
  public toastService = inject(ToastrService);
  citaForm!: FormGroup;
  submitted = false;
  errorMessage = '';
  isEditMode = false;

  ngOnInit() {
    this.isEditMode = !!this.data.cita;

    if (this.isEditMode && this.data.cita) {
      // Modo edición
      const fechaHora = new Date(this.data.cita.fechaHora);
      const fecha = fechaHora.toISOString().split('T')[0];
      const hora = fechaHora.toTimeString().slice(0, 5);

      this.citaForm = this.fb.group({
        titulo: [this.data.cita.titulo, [Validators.required]],
        descripcion: [this.data.cita.descripcion || null],
        fecha: [fecha, [Validators.required]],
        hora: [hora, [Validators.required]],
        lugar: [this.data.cita.lugar || null]
      });
    } else {
      // Modo creación
      this.citaForm = this.fb.group({
        titulo: ['', [Validators.required]],
        descripcion: [''],
        fecha: ['', [Validators.required]],
        hora: ['', [Validators.required]],
        lugar: ['']
      });
    }
  }

  get f() {
    return this.citaForm.controls;
  }

  closeModal() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.submitted = true;

    if (this.citaForm.invalid) {
      return;
    }

    this.loaderService.showLoading();

    const { titulo, descripcion, fecha, hora, lugar } = this.citaForm.value;
    const fechaHora = `${fecha}T${hora}:00`;

    if (this.isEditMode && this.data.cita) {
      // Actualizar cita existente
      const updateDto: UpdateCitaDto = {
        id: this.data.cita.id,
        titulo,
        descripcion: descripcion || '',
        fechaHora: fechaHora,
        lugar: lugar || ''
      };

      this.citaService.update(updateDto).subscribe({
        next: (response) => {
          this.loaderService.hideLoading();
          if (response.isSuccess) {
            this.dialogRef.close(true);
             this.toastService.success(response.message);
          } else {
            this.toastService.error(response.message || 'Error al actualizar la cita');
          }
        },
        error: (error) => {
          this.loaderService.hideLoading();
          this.toastService.error(error.error?.message || 'Error de conexión con el servidor');
        }
      });
    } else {
      // Crear nueva cita
      const createDto: CreateCitaDto = {
        titulo,
        descripcion: descripcion || '',
        fechaHora: fechaHora,
        lugar: lugar || '',
        usuarioId: this.data.usuarioId!
      };

      this.citaService.create(createDto).subscribe({
        next: (response) => {
          this.loaderService.hideLoading();
          if (response.isSuccess) {
            this.dialogRef.close(true);
             this.toastService.success(response.message);
          } else {
            this.toastService.error(response.message || 'Error al crear la cita');
          }
        },
        error: (error) => {
          this.loaderService.hideLoading();
          this.toastService.error(error.error?.message || 'Error de conexión con el servidor');
        }
      });
    }
  }
}
