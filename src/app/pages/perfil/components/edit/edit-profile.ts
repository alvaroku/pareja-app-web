import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { AuthService } from '../../../../services/auth.service';
import { LoaderService } from '../../../../services/loader.service';
import { Usuario } from '../../../../models/usuario.model';
import { ToastrService } from 'ngx-toastr';
import { LucideAngularModule } from "lucide-angular";
import { TIMEZONES } from '../../../../utils/timezones';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css',
})
export class EditProfileComponent implements OnInit {
  public dialogRef = inject(DialogRef, { optional: true });
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private loaderService = inject(LoaderService);
  public data = inject<Usuario>(DIALOG_DATA);
  public toastr = inject(ToastrService);
  editForm!: FormGroup;
  submitted = false;
  errorMessage = '';
  userId: number = 0;

  timezones = TIMEZONES
  ngOnInit() {
    this.userId = this.data.id;
    this.editForm = this.fb.group({
      nombre: [this.data.nombre, [Validators.required, Validators.minLength(3)]],
      email: [this.data.email, [Validators.required, Validators.email]],
      codigoPais: [this.data.codigoPais || ''],
      telefono: [this.data.telefono || ''],
      timeZone: [this.data.timeZone || 'America/Mexico_City']
    });
  }

  get f() {
    return this.editForm.controls;
  }

  closeModal(result?: boolean) {
    this.dialogRef?.close(result);
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';

    if (this.editForm.invalid) {
      return;
    }

    this.loaderService.showLoading();
    const { nombre, email, codigoPais, telefono, timeZone } = this.editForm.value;

    this.authService.updateProfile(this.userId, nombre, email, codigoPais, telefono, timeZone).subscribe({
      next: (response) => {
        this.loaderService.hideLoading();
        this.submitted = false;
        this.toastr.success(response.message, 'Éxito');
        this.closeModal(true);
      },
      error: (error) => {
        this.loaderService.hideLoading();
        this.submitted = false;
        this.errorMessage = error.error?.message || 'Error de conexión con el servidor';
      }
    });
  }
}
