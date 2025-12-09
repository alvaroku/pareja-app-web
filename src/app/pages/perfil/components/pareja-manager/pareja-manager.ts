import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Dialog } from '@angular/cdk/dialog';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pareja-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pareja-manager.html',
  styleUrl: './pareja-manager.css',
})
export class ParejaManagerComponent implements OnInit {
  private parejaService = inject(ParejaService);
  private loaderService = inject(LoaderService);
  private fb = inject(FormBuilder);
  private dialog = inject(Dialog);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  pareja: Pareja | null = null;
  invitacionForm!: FormGroup;
  errorMessage = '';
  successMessage = '';
  currentUserId = 0;

  readonly EstadoInvitacion = EstadoInvitacion;

  ngOnInit() {
    this.currentUserId = this.authService.currentUserValue?.id || 0;

    this.invitacionForm = this.fb.group({
      emailPareja: ['', [Validators.required, Validators.email]]
    });

    this.cargarPareja();

    // Manejar acciones desde URL (email links)
    this.route.queryParams.subscribe(params => {
      const action = params['action'];
      const parejaId = params['pareja'];

      if (action && parejaId) {
        if (action === 'aceptar') {
          this.aceptarInvitacion(parseInt(parejaId));
        } else if (action === 'rechazar') {
          this.rechazarInvitacion(parseInt(parejaId));
        }
      }
    });
  }

  cargarPareja() {
    this.loaderService.showLoading();
    this.parejaService.getParejaActiva().subscribe({
      next: (response) => {
        this.loaderService.hideLoading();
        if (response.isSuccess) {
          this.pareja = response.data;
        }
      },
      error: (error) => {
        this.loaderService.hideLoading();
        this.errorMessage = 'Error al cargar información de pareja';
      }
    });
  }

  enviarInvitacion() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.invitacionForm.invalid) {
      this.errorMessage = 'Por favor ingresa un email válido';
      return;
    }

    this.loaderService.showLoading();
    this.parejaService.enviarInvitacion(this.invitacionForm.value).subscribe({
      next: (response) => {
        this.loaderService.hideLoading();
        if (response.isSuccess) {
          this.successMessage = '¡Invitación enviada exitosamente!';
          this.invitacionForm.reset();
          this.cargarPareja();
        } else {
          this.errorMessage = response.message || 'Error al enviar invitación';
        }
      },
      error: (error) => {
        this.loaderService.hideLoading();
        this.errorMessage = error.error?.message || 'Error al enviar invitación';
      }
    });
  }

  aceptarInvitacion(parejaId?: number) {
    const id = parejaId || this.pareja?.id;
    if (!id) return;

    // Confirmación con CDK Dialog
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Aceptar Invitación',
        message: '¿Estás seguro de que deseas aceptar esta invitación de pareja?',
        confirmText: 'Aceptar',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.closed.subscribe(confirmed => {
      if (confirmed) {
        this.loaderService.showLoading();
        this.parejaService.aceptarInvitacion(id).subscribe({
          next: (response) => {
            this.loaderService.hideLoading();
            if (response.isSuccess) {
              this.successMessage = '¡Invitación aceptada! Ahora tienen una pareja activa.';
              this.cargarPareja();
            } else {
              this.errorMessage = response.message || 'Error al aceptar invitación';
            }
          },
          error: (error) => {
            this.loaderService.hideLoading();
            this.errorMessage = error.error?.message || 'Error al aceptar invitación';
          }
        });
      }
    });
  }

  rechazarInvitacion(parejaId?: number) {
    const id = parejaId || this.pareja?.id;
    if (!id) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Rechazar Invitación',
        message: '¿Estás seguro de que deseas rechazar esta invitación?',
        confirmText: 'Rechazar',
        cancelText: 'Cancelar',
        isDanger: true
      }
    });

    dialogRef.closed.subscribe(confirmed => {
      if (confirmed) {
        this.loaderService.showLoading();
        this.parejaService.rechazarInvitacion(id).subscribe({
          next: (response) => {
            this.loaderService.hideLoading();
            if (response.isSuccess) {
              this.successMessage = 'Invitación rechazada';
              this.cargarPareja();
            } else {
              this.errorMessage = response.message || 'Error al rechazar invitación';
            }
          },
          error: (error) => {
            this.loaderService.hideLoading();
            this.errorMessage = error.error?.message || 'Error al rechazar invitación';
          }
        });
      }
    });
  }

  eliminarPareja() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar Pareja',
        message: this.pareja?.estado === EstadoInvitacion.Pendiente
          ? '¿Deseas cancelar esta invitación?'
          : '¿Estás seguro de que deseas eliminar tu pareja? Esta acción no se puede deshacer.',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        isDanger: true
      }
    });

    dialogRef.closed.subscribe(confirmed => {
      if (confirmed) {
        this.loaderService.showLoading();
        this.parejaService.eliminarPareja().subscribe({
          next: (response) => {
            this.loaderService.hideLoading();
            if (response.isSuccess) {
              this.successMessage = this.pareja?.estado === EstadoInvitacion.Pendiente
                ? 'Invitación cancelada'
                : 'Pareja eliminada';
              this.pareja = null;
              this.cargarPareja();
            } else {
              this.errorMessage = response.message || 'Error al eliminar pareja';
            }
          },
          error: (error) => {
            this.loaderService.hideLoading();
            this.errorMessage = error.error?.message || 'Error al eliminar pareja';
          }
        });
      }
    });
  }

  esInvitacionRecibida(): boolean {
    return this.pareja !== null
      && this.pareja.estado === EstadoInvitacion.Pendiente
      && this.pareja.usuarioRecibeId === this.currentUserId;
  }

  esInvitacionEnviada(): boolean {
    return this.pareja !== null
      && this.pareja.estado === EstadoInvitacion.Pendiente
      && this.pareja.usuarioEnviaId === this.currentUserId;
  }

  getNombrePareja(): string {
    if (!this.pareja) return '';
    return this.pareja.usuarioEnviaId === this.currentUserId
      ? this.pareja.usuarioRecibeNombre
      : this.pareja.usuarioEnviaNombre;
  }

  getEmailPareja(): string {
    if (!this.pareja) return '';
    return this.pareja.usuarioEnviaId === this.currentUserId
      ? this.pareja.usuarioRecibeEmail
      : this.pareja.usuarioEnviaEmail;
  }
}

// Componente de confirmación
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white/20 backdrop-blur-lg rounded-2xl p-6 shadow-xl max-w-md w-full">
        <h3 class="text-xl font-bold mb-4">{{ data.title }}</h3>
        <p class="text-sm mb-6">{{ data.message }}</p>
        <div class="flex gap-3">
          <button
            (click)="dialogRef.close(false)"
            class="flex-1 py-3 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-all">
            {{ data.cancelText }}
          </button>
          <button
            (click)="dialogRef.close(true)"
            [class]="data.isDanger ? 'flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all' : 'flex-1 py-3 bg-white text-purple-600 font-bold rounded-xl hover:bg-white/90 transition-all'">
            {{ data.confirmText }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class ConfirmDialogComponent {
  public dialogRef = inject(DialogRef);
  public data = inject<any>(DIALOG_DATA);
}

import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';import { ParejaService } from '../../../../services/pareja.service';
import { LoaderService } from '../../../../services/loader.service';
import { AuthService } from '../../../../services/auth.service';
import { EstadoInvitacion, Pareja } from '../../../../models/pareja.model';

