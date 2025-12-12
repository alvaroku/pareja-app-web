import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ToastrService } from 'ngx-toastr';
import { LucideAngularModule } from 'lucide-angular';
import { NotificationService } from '../../../../services/notification.service';
import { LoaderService } from '../../../../services/loader.service';
import { Usuario } from '../../../../models/usuario.model';

export interface SendNotificationData {
  usuario: Usuario;
}

@Component({
  selector: 'app-send-notification',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  template: `
    <!-- Overlay -->
    <div class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <!-- Modal -->
      <div class="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl max-w-md w-full border border-white/20" (click)="$event.stopPropagation()">
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl">
              <lucide-icon name="bell" class="text-white" [size]="28"></lucide-icon>
            </div>
            <div>
              <h3 class="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
                Enviar Notificación
              </h3>
              <p class="text-sm text-gray-600">A: {{ data.usuario.nombre }}</p>
            </div>
          </div>
          <button (click)="dialogRef.close()" class="text-3xl text-gray-400 hover:text-gray-600 transition-colors">&times;</button>
        </div>

        <form [formGroup]="notificationForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-sm font-bold mb-2 text-gray-700">Título *</label>
            <input
              type="text"
              formControlName="title"
              [class.ring-2]="notificationForm.get('title')?.invalid && notificationForm.get('title')?.touched"
              [class.ring-red-400]="notificationForm.get('title')?.invalid && notificationForm.get('title')?.touched"
              class="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent">
            @if (notificationForm.get('title')?.invalid && notificationForm.get('title')?.touched) {
              <div class="mt-2">
                <p class="text-red-600 text-sm">El título es requerido</p>
              </div>
            }
          </div>

          <div>
            <label class="block text-sm font-bold mb-2 text-gray-700">Mensaje *</label>
            <textarea
              formControlName="body"
              rows="4"
              [class.ring-2]="notificationForm.get('body')?.invalid && notificationForm.get('body')?.touched"
              [class.ring-red-400]="notificationForm.get('body')?.invalid && notificationForm.get('body')?.touched"
              class="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none"></textarea>
            @if (notificationForm.get('body')?.invalid && notificationForm.get('body')?.touched) {
              <div class="mt-2">
                <p class="text-red-600 text-sm">El mensaje es requerido</p>
              </div>
            }
          </div>

          <div class="flex items-center gap-2">
            <input
              type="checkbox"
              formControlName="sendImmediately"
              id="sendImmediately"
              class="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500">
            <label for="sendImmediately" class="text-sm font-bold text-gray-700">Enviar inmediatamente</label>
          </div>

          @if (!notificationForm.get('sendImmediately')?.value) {
            <div>
              <label class="block text-sm font-bold mb-2 text-gray-700">Programar envío (UTC)</label>
              <input
                type="datetime-local"
                formControlName="scheduledAt"
                class="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent">
            </div>
          }

          <div>
            <label class="block text-sm font-bold mb-2 text-gray-700">Datos adicionales (JSON)</label>
            <textarea
              formControlName="additionalDataJson"
              rows="3"
              placeholder='{"key": "value"}'
              [class.ring-2]="notificationForm.get('additionalDataJson')?.invalid && notificationForm.get('additionalDataJson')?.touched"
              [class.ring-red-400]="notificationForm.get('additionalDataJson')?.invalid && notificationForm.get('additionalDataJson')?.touched"
              class="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none font-mono text-sm"></textarea>
            @if (notificationForm.get('additionalDataJson')?.errors?.['invalidJson'] && notificationForm.get('additionalDataJson')?.touched) {
              <div class="mt-2">
                <p class="text-red-600 text-sm">Formato JSON inválido</p>
              </div>
            }
            @if (!notificationForm.get('additionalDataJson')?.errors) {
              <p class="text-xs text-gray-500 mt-1">Formato JSON opcional, ej: {{"{"}} "key1": "value1", "key2": "value2" {{"}"}}</p>
            }
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
              class="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-2xl hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              [disabled]="notificationForm.invalid || isSubmitting">
              <lucide-icon name="send" [size]="16"></lucide-icon>
              {{ isSubmitting ? 'Enviando...' : 'Enviar' }}
            </button>
          </div>
        </form>
      </div>
    </div>`,
  styles: [`
    /* Estilos adicionales si son necesarios */
  `]
})
export class SendNotificationComponent implements OnInit {
  dialogRef = inject(DialogRef);
  data: SendNotificationData = inject(DIALOG_DATA);
  fb = inject(FormBuilder);
  notificationService = inject(NotificationService);
  loaderService = inject(LoaderService);
  toastService = inject(ToastrService);

  isSubmitting = false;
  notificationForm!: FormGroup;

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.notificationForm = this.fb.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
      sendImmediately: [true],
      scheduledAt: [''],
      additionalDataJson: ['', this.jsonValidator]
    });
  }

  jsonValidator(control: any) {
    if (!control.value || control.value.trim() === '') {
      return null;
    }
    try {
      JSON.parse(control.value);
      return null;
    } catch (e) {
      return { invalidJson: true };
    }
  }

  onSubmit() {
    if (this.notificationForm.invalid || this.isSubmitting) {
      this.notificationForm.markAllAsTouched();
      return;
    }

    // Validar y parsear datos adicionales si existen
    let additionalData: { [key: string]: string } | undefined;
    const jsonValue = this.notificationForm.get('additionalDataJson')?.value?.trim();
    if (jsonValue) {
      try {
        additionalData = JSON.parse(jsonValue);
      } catch (e) {
        this.toastService.error('El formato JSON de datos adicionales no es válido');
        return;
      }
    }

    // Convertir fecha programada si existe
    let scheduledAtUtc: Date | undefined;
    const scheduledValue = this.notificationForm.get('scheduledAt')?.value;
    if (!this.notificationForm.get('sendImmediately')?.value && scheduledValue) {
      scheduledAtUtc = new Date(scheduledValue);
    }

    this.isSubmitting = true;
    this.loaderService.showLoading();

    this.notificationService.sendNotification({
      userId: this.data.usuario.id,
      title: this.notificationForm.get('title')?.value,
      body: this.notificationForm.get('body')?.value,
      sendImmediately: this.notificationForm.get('sendImmediately')?.value,
      scheduledAtUtc: scheduledAtUtc,
      additionalData: additionalData
    }).subscribe({
      next: (response) => {
        this.loaderService.hideLoading();
        this.isSubmitting = false;
        if (response.isSuccess) {
          this.toastService.success('Notificación enviada exitosamente');
          this.dialogRef.close(true);
        }
      },
      error: (error) => {
        this.loaderService.hideLoading();
        this.isSubmitting = false;
        this.toastService.error(error.error?.message || 'Error al enviar notificación');
        console.error('Error:', error);
      }
    });
  }
}
