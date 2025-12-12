import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  template: `
    <!-- Overlay -->
    <div class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <!-- Modal -->
      <div class="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl max-w-md w-full border border-white/20" (click)="$event.stopPropagation()">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
            <div class="p-2 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl">
              <lucide-icon name="user" class="text-white" [size]="28"></lucide-icon>
            </div>
            {{ isEdit ? 'Editar Usuario' : 'Nuevo Usuario' }}
          </h3>
          <button (click)="dialogRef.close()" class="text-3xl text-gray-400 hover:text-gray-600 transition-colors">&times;</button>
        </div>

        <form [formGroup]="usuarioForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-sm font-bold mb-2 text-gray-700">Nombre *</label>
            <input
              type="text"
              formControlName="nombre"
              placeholder="Nombre completo"
              [class.ring-2]="submitted && f['nombre'].errors"
              [class.ring-red-400]="submitted && f['nombre'].errors"
              class="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent">
            @if (submitted && f['nombre'].errors) {
              <div class="mt-2">
                @if (f['nombre'].errors['required']) {
                  <p class="text-red-600 text-sm">El nombre es requerido</p>
                }
                @if (f['nombre'].errors['minlength']) {
                  <p class="text-red-600 text-sm">El nombre debe tener al menos 3 caracteres</p>
                }
              </div>
            }
          </div>

          <div>
            <label class="block text-sm font-bold mb-2 text-gray-700">Email *</label>
            <input
              type="email"
              formControlName="email"
              placeholder="correo@ejemplo.com"
              [class.ring-2]="submitted && f['email'].errors"
              [class.ring-red-400]="submitted && f['email'].errors"
              class="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent">
            @if (submitted && f['email'].errors) {
              <div class="mt-2">
                @if (f['email'].errors['required']) {
                  <p class="text-red-600 text-sm">El email es requerido</p>
                }
                @if (f['email'].errors['email']) {
                  <p class="text-red-600 text-sm">El email no es válido</p>
                }
              </div>
            }
          </div>

          @if (!isEdit) {
            <div>
              <label class="block text-sm font-bold mb-2 text-gray-700">Contraseña *</label>
              <input
                type="password"
                formControlName="password"
                placeholder="Mínimo 6 caracteres"
                [class.ring-2]="submitted && f['password'].errors"
                [class.ring-red-400]="submitted && f['password'].errors"
                class="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent">
              @if (submitted && f['password'].errors) {
                <div class="mt-2">
                  @if (f['password'].errors['required']) {
                    <p class="text-red-600 text-sm">La contraseña es requerida</p>
                  }
                  @if (f['password'].errors['minlength']) {
                    <p class="text-red-600 text-sm">La contraseña debe tener al menos 6 caracteres</p>
                  }
                </div>
              }
            </div>
          }

          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="block text-sm font-bold mb-2 text-gray-700">Código</label>
              <select
                formControlName="codigoPais"
                class="w-full px-2 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent">
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
              <label class="block text-sm font-bold mb-2 text-gray-700">Teléfono</label>
              <input
                type="tel"
                formControlName="telefono"
                placeholder="1234567890"
                class="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent">
            </div>
          </div>

          <div>
            <label class="block text-sm font-bold mb-2 text-gray-700">Rol *</label>
            <select
              formControlName="role"
              class="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent">
              <option [value]="UserRole.User">Usuario</option>
              <option [value]="UserRole.SuperAdmin">Super Administrador</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-bold mb-2 text-gray-700">Zona Horaria</label>
            <select
              formControlName="timeZone"
              class="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent">
              @for (tz of timezones; track tz.value) {
                <option [value]="tz.value">{{ tz.label }}</option>
              }
            </select>
          </div>

          <div class="flex gap-3 pt-4">
            <button
              type="button"
              (click)="dialogRef.close()"
              class="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-all">
              Cancelar
            </button>
            <button
              type="submit"
              class="flex-1 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-2xl hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg shadow-pink-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              [disabled]="usuarioForm.invalid || isSubmitting">
              {{ isSubmitting ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    /* Estilos adicionales si son necesarios */
  `]
})
export class CreateEditUsuarioComponent implements OnInit {
  public dialogRef = inject(DialogRef);
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private loaderService = inject(LoaderService);
  public data: CreateEditUsuarioData = inject(DIALOG_DATA);
  public toastService = inject(ToastrService);

  UserRole = UserRole;
  usuarioForm!: FormGroup;
  submitted = false;
  isEdit = false;
  isSubmitting = false;

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
    this.isEdit = !!this.data.usuario;

    if (this.isEdit && this.data.usuario) {
      const u = this.data.usuario;
      this.usuarioForm = this.fb.group({
        nombre: [u.nombre, [Validators.required, Validators.minLength(3)]],
        email: [u.email, [Validators.required, Validators.email]],
        codigoPais: [u.codigoPais || ''],
        telefono: [u.telefono || ''],
        role: [u.role, [Validators.required]],
        timeZone: [u.timeZone || 'America/Mexico_City', [Validators.required]]
      });
    } else {
      this.usuarioForm = this.fb.group({
        nombre: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        codigoPais: [''],
        telefono: [''],
        role: [UserRole.User, [Validators.required]],
        timeZone: ['America/Mexico_City', [Validators.required]]
      });
    }
  }

  get f() {
    return this.usuarioForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.usuarioForm.invalid) {
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
    const { nombre, email, password, codigoPais, telefono, role, timeZone } = this.usuarioForm.value;

    this.usuarioService.create({
      nombre,
      email,
      password,
      codigoPais: codigoPais || undefined,
      telefono: telefono || undefined,
      role,
      timeZone
    }).subscribe({
      next: (response) => {
        this.loaderService.hideLoading();
        this.isSubmitting = false;
        if (response.isSuccess) {
          this.toastService.success(response.message);
          this.dialogRef.close(true);
        } else {
          this.toastService.error(response.message || 'Error al crear usuario');
        }
      },
      error: (error) => {
        this.loaderService.hideLoading();
        this.isSubmitting = false;
        this.toastService.error(error.error?.message || 'Error de conexión con el servidor');
      }
    });
  }

  updateUsuario() {
    if (!this.data.usuario) return;

    const { nombre, email, codigoPais, telefono, role, timeZone } = this.usuarioForm.value;

    this.usuarioService.update(this.data.usuario.id, {
      nombre,
      email,
      codigoPais: codigoPais || undefined,
      telefono: telefono || undefined,
      role,
      timeZone
    }).subscribe({
      next: (response) => {
        this.loaderService.hideLoading();
        this.isSubmitting = false;
        if (response.isSuccess) {
          this.toastService.success(response.message);
          this.dialogRef.close(true);
        } else {
          this.toastService.error(response.message || 'Error al actualizar usuario');
        }
      },
      error: (error) => {
        this.loaderService.hideLoading();
        this.isSubmitting = false;
        this.toastService.error(error.error?.message || 'Error de conexión con el servidor');
      }
    });
  }
}
