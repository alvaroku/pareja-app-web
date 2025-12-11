import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ToastrService } from 'ngx-toastr';
import { LucideAngularModule } from 'lucide-angular';
import { UsuarioService } from '../../../../services/usuario.service';
import { LoaderService } from '../../../../services/loader.service';
import { Usuario, UserRole } from '../../../../models/usuario.model';

export interface CreateEditUsuarioData {
  usuario?: Usuario;
}

@Component({
  selector: 'app-create-edit-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="modal-backdrop" (click)="dialogRef.close()"></div>
    <div class="modal-container" (click)="$event.stopPropagation()">
      <div class="modal-header">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
            <lucide-icon name="user" [size]="24" class="text-white"></lucide-icon>
          </div>
          <h2 class="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            {{ isEdit ? 'Editar Usuario' : 'Nuevo Usuario' }}
          </h2>
        </div>
        <button class="close-btn" (click)="dialogRef.close()">
          <lucide-icon name="x" [size]="24"></lucide-icon>
        </button>
      </div>

      <form (submit)="onSubmit(); $event.preventDefault()">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Nombre *</label>
            <input
              type="text"
              [(ngModel)]="usuarioForm.nombre"
              name="nombre"
              class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:outline-none transition-colors"
              required>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
            <input
              type="email"
              [(ngModel)]="usuarioForm.email"
              name="email"
              class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:outline-none transition-colors"
              required>
          </div>

          @if (!isEdit) {
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Contraseña *</label>
              <input
                type="password"
                [(ngModel)]="usuarioForm.password"
                name="password"
                class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:outline-none transition-colors"
                required>
            </div>
          }

          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Código</label>
              <select
                [(ngModel)]="usuarioForm.codigoPais"
                name="codigoPais"
                class="w-full px-2 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:outline-none transition-colors">
                <option value="">-</option>
                <option value="+1">+1</option>
                <option value="+52">+52</option>
                <option value="+34">+34</option>
                <option value="+54">+54</option>
                <option value="+55">+55</option>
                <option value="+57">+57</option>
                <option value="+58">+58</option>
              </select>
            </div>
            <div class="col-span-2">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Teléfono</label>
              <input
                type="tel"
                [(ngModel)]="usuarioForm.telefono"
                name="telefono"
                placeholder="1234567890"
                class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:outline-none transition-colors">
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Rol *</label>
            <select
              [(ngModel)]="usuarioForm.role"
              name="role"
              class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:outline-none transition-colors">
              <option [value]="UserRole.User">Usuario</option>
              <option [value]="UserRole.SuperAdmin">Super Administrador</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Zona Horaria</label>
            <select
              [(ngModel)]="usuarioForm.timeZone"
              name="timeZone"
              class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:outline-none transition-colors">
              @for (tz of timezones; track tz.value) {
                <option [value]="tz.value">{{ tz.label }}</option>
              }
            </select>
          </div>
        </div>

        <div class="flex gap-3 mt-6">
          <button
            type="button"
            (click)="dialogRef.close()"
            class="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
            Cancelar
          </button>
          <button
            type="submit"
            class="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            [disabled]="isSubmitting">
            {{ isSubmitting ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear') }}
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
  `]
})
export class CreateEditUsuarioComponent implements OnInit {
  dialogRef = inject(DialogRef);
  data: CreateEditUsuarioData = inject(DIALOG_DATA);
  usuarioService = inject(UsuarioService);
  loaderService = inject(LoaderService);
  toastService = inject(ToastrService);

  UserRole = UserRole;
  isEdit = false;
  isSubmitting = false;
  usuarioForm = {
    nombre: '',
    email: '',
    password: '',
    codigoPais: '',
    telefono: '',
    role: UserRole.User,
    timeZone: 'America/Mexico_City'
  };

  timezones = [
    { value: 'America/Mexico_City', label: '(UTC-06:00) Ciudad de México' },
    { value: 'America/Cancun', label: '(UTC-05:00) Cancún' },
    { value: 'America/Tijuana', label: '(UTC-08:00) Tijuana' },
    { value: 'America/Chihuahua', label: '(UTC-07:00) Chihuahua' },
    { value: 'America/New_York', label: '(UTC-05:00) Nueva York' },
    { value: 'America/Chicago', label: '(UTC-06:00) Chicago' },
    { value: 'America/Los_Angeles', label: '(UTC-08:00) Los Ángeles' },
    { value: 'America/Bogota', label: '(UTC-05:00) Bogotá' },
    { value: 'America/Buenos_Aires', label: '(UTC-03:00) Buenos Aires' },
    { value: 'Europe/Madrid', label: '(UTC+01:00) Madrid' },
    { value: 'UTC', label: '(UTC+00:00) UTC' }
  ];

  ngOnInit() {
    if (this.data.usuario) {
      this.isEdit = true;
      const u = this.data.usuario;
      this.usuarioForm = {
        nombre: u.nombre,
        email: u.email,
        password: '',
        codigoPais: u.codigoPais || '',
        telefono: u.telefono || '',
        role: u.role,
        timeZone: u.timeZone || 'America/Mexico_City'
      };
    }
  }

  onSubmit() {
    if (!this.usuarioForm.nombre || !this.usuarioForm.email) {
      this.toastService.warning('Por favor completa todos los campos requeridos');
      return;
    }

    if (!this.isEdit && !this.usuarioForm.password) {
      this.toastService.warning('La contraseña es requerida');
      return;
    }

    this.isSubmitting = true;
    this.loaderService.showLoading();

    if (this.isEdit) {
      this.updateUsuario();
    } else {
      this.createUsuario();
    }
  }
  createUsuario() {
    this.usuarioService.create({
      nombre: this.usuarioForm.nombre,
      email: this.usuarioForm.email,
      password: this.usuarioForm.password,
      codigoPais: this.usuarioForm.codigoPais || undefined,
      telefono: this.usuarioForm.telefono || undefined,
      role: this.usuarioForm.role,
      timeZone: this.usuarioForm.timeZone
    }).subscribe({
      next: (response) => {
        this.loaderService.hideLoading();
        this.isSubmitting = false;
        if (response.isSuccess) {
          this.toastService.success('Usuario creado exitosamente');
          this.dialogRef.close(true);
        }
      },
      error: (error) => {
        this.loaderService.hideLoading();
        this.isSubmitting = false;
        this.toastService.error(error.error?.message || 'Error al crear usuario');
        console.error('Error:', error);
      }
    });
  }
  updateUsuario() {
    if (!this.data.usuario) return;

    this.usuarioService.update(this.data.usuario.id, {
      nombre: this.usuarioForm.nombre,
      email: this.usuarioForm.email,
      codigoPais: this.usuarioForm.codigoPais || undefined,
      telefono: this.usuarioForm.telefono || undefined,
      role: this.usuarioForm.role,
      timeZone: this.usuarioForm.timeZone
    }).subscribe({
      next: (response) => {
        this.loaderService.hideLoading();
        this.isSubmitting = false;
        if (response.isSuccess) {
          this.toastService.success('Usuario actualizado exitosamente');
          this.dialogRef.close(true);
        }
      },
      error: (error) => {
        this.loaderService.hideLoading();
        this.isSubmitting = false;
        this.toastService.error(error.error?.message || 'Error al actualizar usuario');
        console.error('Error:', error);
      }
    });
  }
}
