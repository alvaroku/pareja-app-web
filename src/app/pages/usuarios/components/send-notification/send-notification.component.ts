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
    <div class="modal-backdrop" (click)="dialogRef.close()"></div>
    <div class="modal-container" (click)="$event.stopPropagation()">
      <div class="modal-header">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <lucide-icon name="bell" [size]="24" class="text-white"></lucide-icon>
          </div>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
              Enviar Notificación
            </h2>
            <p class="text-sm text-gray-600">A: {{ data.usuario.nombre }}</p>
          </div>
        </div>
        <button class="close-btn" (click)="dialogRef.close()">
          <lucide-icon name="x" [size]="24"></lucide-icon>
        </button>
      </div>

      <form [formGroup]="notificationForm" (ngSubmit)="onSubmit()">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Título *</label>
            <input
              type="text"
              formControlName="title"
              class="w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
              [class.border-red-500]="notificationForm.get('title')?.invalid && notificationForm.get('title')?.touched"
              [class.border-gray-200]="!notificationForm.get('title')?.invalid || !notificationForm.get('title')?.touched">
            <small class="text-red-500 text-xs mt-1 block" *ngIf="notificationForm.get('title')?.invalid && notificationForm.get('title')?.touched">
              El título es requerido
            </small>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Mensaje *</label>
            <textarea
              formControlName="body"
              rows="4"
              class="w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200 resize-none"
              [class.border-red-500]="notificationForm.get('body')?.invalid && notificationForm.get('body')?.touched"
              [class.border-gray-200]="!notificationForm.get('body')?.invalid || !notificationForm.get('body')?.touched"></textarea>
            <small class="text-red-500 text-xs mt-1 block" *ngIf="notificationForm.get('body')?.invalid && notificationForm.get('body')?.touched">
              El mensaje es requerido
            </small>
          </div>

          <div class="flex items-center gap-2">
            <input
              type="checkbox"
              formControlName="sendImmediately"
              id="sendImmediately"
              class="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500">
            <label for="sendImmediately" class="text-sm font-semibold text-gray-700">Enviar inmediatamente</label>
          </div>

          @if (!notificationForm.get('sendImmediately')?.value) {
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Programar envío (UTC)</label>
              <input
                type="datetime-local"
                formControlName="scheduledAt"
                class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 transition-all duration-200 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200">
            </div>
          }

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Datos adicionales (JSON)</label>
            <textarea
              formControlName="additionalDataJson"
              rows="3"
              placeholder='{"key": "value"}'
              class="w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200 resize-none font-mono text-sm"
              [class.border-red-500]="notificationForm.get('additionalDataJson')?.invalid && notificationForm.get('additionalDataJson')?.touched"
              [class.border-gray-200]="!notificationForm.get('additionalDataJson')?.invalid || !notificationForm.get('additionalDataJson')?.touched"></textarea>
            <small class="text-red-500 text-xs mt-1 block" *ngIf="notificationForm.get('additionalDataJson')?.errors?.['invalidJson'] && notificationForm.get('additionalDataJson')?.touched">
              Formato JSON inválido
            </small>
            <p class="text-xs text-gray-500 mt-1" *ngIf="!notificationForm.get('additionalDataJson')?.errors">Formato JSON opcional, ej: "key1": "value1", "key2": "value2"</p>
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
            class="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            [disabled]="notificationForm.invalid || isSubmitting">
            <lucide-icon name="send" [size]="16"></lucide-icon>
            {{ isSubmitting ? 'Enviando...' : 'Enviar' }}
          </button>
        </div>
      </form>
    </div>`,
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
      border-bottom: 2px solid rgba(168, 85, 247, 0.1);
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
      background: rgba(168, 85, 247, 0.1);
      color: #a855f7;
    }
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
