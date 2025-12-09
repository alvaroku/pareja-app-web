import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ToastrService } from 'ngx-toastr';
import { Memoria } from '../../../models/memoria.model';
import { MemoriaService } from '../../../services/memoria.service';
import { AuthService } from '../../../services/auth.service';
import { LoaderService } from '../../../services/loader.service';

export interface CreateEditMemoriaData {
  memoria?: Memoria;
}

@Component({
  selector: 'app-create-edit-memoria',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-backdrop" (click)="dialogRef.close()"></div>
    <div class="modal-container" (click)="$event.stopPropagation()">
      <div class="modal-header">
        <h2>{{ isEdit ? 'Editar Memoria' : 'Nueva Memoria' }}</h2>
        <button class="close-btn" (click)="dialogRef.close()">&times;</button>
      </div>

      <form [formGroup]="memoriaForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="titulo">Título *</label>
          <input
            id="titulo"
            type="text"
            formControlName="titulo"
            placeholder="Título de la memoria"
            [class.error]="memoriaForm.get('titulo')?.invalid && memoriaForm.get('titulo')?.touched"
          />
          <small class="error-message" *ngIf="memoriaForm.get('titulo')?.invalid && memoriaForm.get('titulo')?.touched">
            El título es requerido (mínimo 3 caracteres)
          </small>
        </div>

        <div class="form-group">
          <label for="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            formControlName="descripcion"
            placeholder="Descripción de la memoria"
            rows="4"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="fechaMemoria">Fecha *</label>
          <input
            id="fechaMemoria"
            type="date"
            formControlName="fechaMemoria"
            [class.error]="memoriaForm.get('fechaMemoria')?.invalid && memoriaForm.get('fechaMemoria')?.touched"
          />
          <small class="error-message" *ngIf="memoriaForm.get('fechaMemoria')?.invalid && memoriaForm.get('fechaMemoria')?.touched">
            La fecha es requerida
          </small>
        </div>

        <div class="form-group">
          <label for="file">Foto</label>
          <input
            id="file"
            type="file"
            accept="image/*"
            (change)="onFileSelected($event)"
          />
          <small class="hint">{{ isEdit ? 'Selecciona una nueva foto para reemplazar la actual' : 'Puedes subir la foto después de crear la memoria' }}</small>

          <div *ngIf="selectedFile()" class="file-preview">
            <p>📷 {{ selectedFile()!.name }} ({{ formatFileSize(selectedFile()!.size) }})</p>
          </div>

          <div *ngIf="data.memoria?.resource && !selectedFile()" class="current-image">
            <img [src]="data.memoria?.resource?.urlPublica" [alt]="data.memoria?.titulo" />
          </div>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn-secondary" (click)="dialogRef.close()">
            Cancelar
          </button>
          <button type="submit" class="btn-primary" [disabled]="memoriaForm.invalid || isSubmitting()">
            {{ isSubmitting() ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear') }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(8px);
      z-index: 1000;
    }

    .modal-container {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      padding: 2rem;
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
      z-index: 1001;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .modal-header h2 {
      margin: 0;
      color: #333;
      font-size: 1.5rem;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 2rem;
      color: #666;
      cursor: pointer;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.3s ease;
    }

    .close-btn:hover {
      background: rgba(0, 0, 0, 0.1);
      color: #333;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: #555;
      font-weight: 500;
    }

    .form-group input[type="text"],
    .form-group input[type="date"],
    .form-group textarea {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      font-size: 1rem;
      transition: all 0.3s ease;
      background: rgba(255, 255, 255, 0.8);
    }

    .form-group input[type="file"] {
      width: 100%;
      padding: 0.5rem;
    }

    .form-group input:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #ff6b9d;
      background: white;
    }

    .form-group input.error,
    .form-group textarea.error {
      border-color: #ff4444;
    }

    .error-message {
      color: #ff4444;
      font-size: 0.85rem;
      margin-top: 0.25rem;
      display: block;
    }

    .hint {
      color: #666;
      font-size: 0.85rem;
      margin-top: 0.25rem;
      display: block;
    }

    .file-preview {
      margin-top: 0.5rem;
      padding: 0.75rem;
      background: rgba(255, 107, 157, 0.1);
      border-radius: 8px;
      color: #ff6b9d;
    }

    .file-preview p {
      margin: 0;
    }

    .current-image {
      margin-top: 1rem;
    }

    .current-image img {
      max-width: 100%;
      max-height: 200px;
      border-radius: 8px;
      object-fit: cover;
    }

    .modal-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }

    .btn-primary,
    .btn-secondary {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 10px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #f0f0f0;
      color: #666;
    }

    .btn-secondary:hover {
      background: #e0e0e0;
    }
  `]
})
export class CreateEditMemoriaComponent implements OnInit {
  dialogRef = inject(DialogRef);
  data: CreateEditMemoriaData = inject(DIALOG_DATA);
  fb = inject(FormBuilder);
  memoriaService = inject(MemoriaService);
  authService = inject(AuthService);
  toastr = inject(ToastrService);
  loaderService = inject(LoaderService);

  memoriaForm!: FormGroup;
  isEdit = false;
  isSubmitting = signal(false);
  selectedFile = signal<File | null>(null);

  ngOnInit() {
    this.isEdit = !!this.data.memoria;
    this.initForm();
  }

  initForm() {
    const memoria = this.data.memoria;

    this.memoriaForm = this.fb.group({
      titulo: [memoria?.titulo || '', [Validators.required, Validators.minLength(3)]],
      descripcion: [memoria?.descripcion || ''],
      fechaMemoria: [memoria ? this.formatDate(memoria.fechaMemoria) : '', Validators.required]
    });
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Validar que sea imagen
      if (!file.type.startsWith('image/')) {
        this.toastr.error('Por favor selecciona un archivo de imagen');
        input.value = '';
        return;
      }

      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        this.toastr.error('La imagen no debe superar 5MB');
        input.value = '';
        return;
      }

      this.selectedFile.set(file);
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  async onSubmit() {
    if (this.memoriaForm.invalid || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    this.loaderService.showLoading();

    try {
      const currentUser = this.authService.currentUserValue;
      if (!currentUser) {
        this.toastr.error('Usuario no autenticado');
        return;
      }

      if (this.isEdit && this.data.memoria) {
        // Actualizar memoria
        const updateDto = this.memoriaForm.value;
        const response = await this.memoriaService.update(this.data.memoria.id, updateDto).toPromise();

        if (response?.isSuccess) {
          this.toastr.success('Memoria actualizada correctamente');

          // Si hay archivo seleccionado, subirlo
          if (this.selectedFile()) {
            await this.uploadFile(this.data.memoria.id);
          }

          this.dialogRef.close(true);
        } else {
          this.toastr.error(response?.message || 'Error al actualizar memoria');
        }
      } else {
        // Crear nueva memoria
        const createDto = {
          ...this.memoriaForm.value,
          usuarioId: currentUser.id
        };

        const response = await this.memoriaService.create(createDto).toPromise();

        if (response?.isSuccess && response.data) {
          this.toastr.success('Memoria creada correctamente');

          // Si hay archivo seleccionado, subirlo
          if (this.selectedFile()) {
            await this.uploadFile(response.data.id);
          }

          this.dialogRef.close(true);
        } else {
          this.toastr.error(response?.message || 'Error al crear memoria');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      this.toastr.error('Error al guardar memoria');
    } finally {
      this.isSubmitting.set(false);
      this.loaderService.hideLoading();
    }
  }

  private async uploadFile(memoriaId: number) {
    const file = this.selectedFile();
    if (!file) return;

    try {
      const uploadResponse = await this.memoriaService.uploadFile(memoriaId, file).toPromise();
      if (!uploadResponse?.isSuccess) {
        this.toastr.warning('La memoria se guardó pero hubo un error al subir la imagen');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      this.toastr.warning('La memoria se guardó pero hubo un error al subir la imagen');
    }
  }
}
