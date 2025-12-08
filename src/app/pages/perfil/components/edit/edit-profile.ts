import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { AuthService } from '../../../../services/auth.service';
import { LoaderService } from '../../../../services/loader.service';
import { Usuario } from '../../../../models/usuario.model';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css',
})
export class EditProfileComponent implements OnInit {
  public dialogRef = inject(DialogRef);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private loaderService = inject(LoaderService);
  public data = inject<Usuario>(DIALOG_DATA);

  editForm!: FormGroup;
  submitted = false;
  errorMessage = '';
  userId: number = 0;

  ngOnInit() {
    this.userId = this.data.id;
    this.editForm = this.fb.group({
      nombre: [this.data.nombre, [Validators.required, Validators.minLength(3)]],
      email: [this.data.email, [Validators.required, Validators.email]],
      codigoPais: [this.data.codigoPais || ''],
      telefono: [this.data.telefono || '']
    });
  }

  get f() {
    return this.editForm.controls;
  }

  closeModal() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';

    if (this.editForm.invalid) {
      return;
    }

    this.loaderService.showLoading();
    const { nombre, email, codigoPais, telefono } = this.editForm.value;

    this.authService.updateProfile(this.userId, nombre, email, codigoPais, telefono).subscribe({
      next: (response) => {
        this.loaderService.hideLoading();
        if (response.isSuccess) {
          this.dialogRef.close(true);
        } else {
          this.errorMessage = response.message || 'Error al actualizar el perfil';
        }
      },
      error: (error) => {
        this.loaderService.hideLoading();
        this.errorMessage = error.error?.message || 'Error de conexión con el servidor';
      }
    });
  }
}
