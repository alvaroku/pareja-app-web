import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ToastrService } from 'ngx-toastr';
import { Memoria } from '../../../models/memoria.model';
import { MemoriaService } from '../../../services/memoria.service';
import { AuthService } from '../../../services/auth.service';
import { LoaderService } from '../../../services/loader.service';
import { LucideAngularModule } from 'lucide-angular';

export interface CreateEditMemoriaData {
  memoria?: Memoria;
}

@Component({
  selector: 'app-create-edit-memoria',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  template: `
    <div class="modal-backdrop" (click)="dialogRef.close()"></div>
    <div class="modal-container" (click)="$event.stopPropagation()">
      <div class="modal-header">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl">
            <lucide-icon name="camera" class="text-white" [size]="28"></lucide-icon>
          </div>
          <h2 class="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            {{ isEdit ? 'Editar Memoria' : 'Nueva Memoria' }}
          </h2>
        </div>
        <button class="close-btn" (click)="dialogRef.close()">
          <lucide-icon name="x" [size]="24"></lucide-icon>
        </button>
      </div>

      <form [formGroup]="memoriaForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="titulo" class="block text-sm font-semibold text-gray-700 mb-2">Título *</label>
          <input
            id="titulo"
            type="text"
            formControlName="titulo"
            placeholder="Título de la memoria"
            class="w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
            [class.border-red-500]="memoriaForm.get('titulo')?.invalid && memoriaForm.get('titulo')?.touched"
            [class.border-gray-200]="!memoriaForm.get('titulo')?.invalid || !memoriaForm.get('titulo')?.touched"
          />
          <small class="text-red-500 text-xs mt-1 block" *ngIf="memoriaForm.get('titulo')?.invalid && memoriaForm.get('titulo')?.touched">
            El título es requerido (mínimo 3 caracteres)
          </small>
        </div>

        <div class="form-group">
          <label for="descripcion" class="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
          <textarea
            id="descripcion"
            formControlName="descripcion"
            placeholder="Descripción de la memoria"
            rows="4"
            class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 transition-all duration-200 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="fechaMemoria" class="block text-sm font-semibold text-gray-700 mb-2">Fecha *</label>
          <input
            id="fechaMemoria"
            type="date"
            formControlName="fechaMemoria"
            class="w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
            [class.border-red-500]="memoriaForm.get('fechaMemoria')?.invalid && memoriaForm.get('fechaMemoria')?.touched"
            [class.border-gray-200]="!memoriaForm.get('fechaMemoria')?.invalid || !memoriaForm.get('fechaMemoria')?.touched"
          />
          <small class="text-red-500 text-xs mt-1 block" *ngIf="memoriaForm.get('fechaMemoria')?.invalid && memoriaForm.get('fechaMemoria')?.touched">
            La fecha es requerida
          </small>
        </div>

        <div class="form-group">
          <label for="file" class="block text-sm font-semibold text-gray-700 mb-2">Foto</label>
          <input
            id="file"
            type="file"
            accept="image/*"
            (change)="onFileSelected($event)"
            class="w-full px-4 py-2 rounded-xl border-2 border-gray-200 transition-all duration-200 focus:outline-none focus:border-pink-500"
          />
          <small class="text-gray-500 text-xs mt-1 block">{{ isEdit ? 'Selecciona una nueva foto para reemplazar la actual' : 'Puedes subir la foto después de crear la memoria' }}</small>

          <div *ngIf="selectedFile()" class="mt-3 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-200">
            <div class="flex items-center gap-2 text-pink-600">
              <lucide-icon name="camera" [size]="20"></lucide-icon>
              <p class="font-medium">{{ selectedFile()!.name }} ({{ formatFileSize(selectedFile()!.size) }})</p>
            </div>
          </div>

          <div *ngIf="data.memoria?.resource && !selectedFile()" class="mt-3 rounded-xl overflow-hidden border-2 border-gray-200">
            <img [src]="data.memoria?.resource?.urlPublica" [alt]="data.memoria?.titulo" class="w-full h-48 object-cover" />
          </div>
        </div>

        <div class="flex gap-3 justify-end mt-6">
          <button type="button"
                  class="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
                  (click)="dialogRef.close()">
            Cancelar
          </button>
          <button type="submit"
                  class="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  [disabled]="memoriaForm.invalid || isSubmitting()">
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
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(8px);
      z-index: 1000;
      animation: fadeIn 0.2s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .modal-container {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
      padding: 2rem;
      width: 90%;
      max-width: 550px;
      max-height: 90vh;
      overflow-y: auto;
      z-index: 1001;
      animation: slideUp 0.3s ease-out;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translate(-50%, -45%);
      }
      to {
        opacity: 1;
        transform: translate(-50%, -50%);
      }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid rgba(236, 72, 153, 0.1);
    }

    .close-btn {
      background: none;
      border: none;
      color: #9ca3af;
      cursor: pointer;
      padding: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      transition: all 0.2s ease;
    }

    .close-btn:hover {
      background: rgba(236, 72, 153, 0.1);
      color: #ec4899;
    }

    .form-group {
      margin-bottom: 1.5rem;
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
