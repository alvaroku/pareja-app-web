import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { MetaService } from '../../../../services/meta.service';
import { LoaderService } from '../../../../services/loader.service';
import { ToastrService } from 'ngx-toastr';
import { Meta, CreateMetaDto, UpdateMetaDto, EstadoMeta } from '../../../../models/meta.model';

@Component({
  selector: 'app-create-edit-meta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-edit-meta.html',
  styleUrl: './create-edit-meta.css',
})
export class CreateEditMetaComponent implements OnInit {
  public dialogRef = inject(DialogRef);
  private fb = inject(FormBuilder);
  private metaService = inject(MetaService);
  private loaderService = inject(LoaderService);
  private toastService = inject(ToastrService);
  public data = inject<{ meta?: Meta; usuarioId?: number }>(DIALOG_DATA);

  metaForm!: FormGroup;
  submitted = false;
  isEditMode = false;

  estadoOptions = [
    { valor: EstadoMeta.Pendiente, nombre: 'Pendiente' },
    { valor: EstadoMeta.EnProgreso, nombre: 'En Progreso' },
    { valor: EstadoMeta.Completado, nombre: 'Completado' }
  ];

  porcentajes = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  ngOnInit() {
    this.isEditMode = !!this.data.meta;
    this.initForm();
  }

  initForm() {
    if (this.isEditMode && this.data.meta) {
      this.metaForm = this.fb.group({
        titulo: [this.data.meta.titulo, [Validators.required, Validators.maxLength(200)]],
        descripcion: [this.data.meta.descripcion || ''],
        progreso: [this.data.meta.progreso, [Validators.required, Validators.min(0), Validators.max(100)]],
        estado: [this.data.meta.estado, Validators.required]
      });
    } else {
      this.metaForm = this.fb.group({
        titulo: ['', [Validators.required, Validators.maxLength(200)]],
        descripcion: [''],
        progreso: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
        estado: [EstadoMeta.Pendiente, Validators.required]
      });
    }
  }

  get f() {
    return this.metaForm.controls;
  }

  closeModal() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.submitted = true;

    if (this.metaForm.invalid) {
      return;
    }

    this.loaderService.showLoading();

    const { titulo, descripcion, progreso, estado } = this.metaForm.value;

    if (this.isEditMode && this.data.meta) {
      const updateDto: UpdateMetaDto = {
        id: this.data.meta.id,
        titulo,
        descripcion: descripcion || '',
        progreso,
        estado
      };

      this.metaService.update(updateDto).subscribe({
        next: (response) => {
          this.loaderService.hideLoading();
          if (response.isSuccess) {
            this.dialogRef.close(true);
          } else {
            this.toastService.error(response.message || 'Error al actualizar la meta');
          }
        },
        error: (error) => {
          this.loaderService.hideLoading();
          this.toastService.error(error.error?.message || 'Error de conexión con el servidor');
        }
      });
    } else {
      const createDto: CreateMetaDto = {
        titulo,
        descripcion: descripcion || '',
        usuarioId: this.data.usuarioId!
      };

      this.metaService.create(createDto).subscribe({
        next: (response) => {
          this.loaderService.hideLoading();
          if (response.isSuccess) {
            this.dialogRef.close(true);
          } else {
            this.toastService.error(response.message || 'Error al crear la meta');
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
