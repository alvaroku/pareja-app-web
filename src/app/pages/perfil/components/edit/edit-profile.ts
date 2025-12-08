import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { LoaderService } from '../../../../services/loader.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css',
})
export class EditProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private loaderService = inject(LoaderService);


  editForm!: FormGroup;
  submitted = false;
  errorMessage = '';
  userId: number = 0;

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userId = user.id;
        this.editForm = this.fb.group({
          nombre: [user.nombre, [Validators.required, Validators.minLength(3)]],
          email: [user.email, [Validators.required, Validators.email]]
        });
      }
    });
  }

  get f() {
    return this.editForm.controls;
  }


  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';

    if (this.editForm.invalid) {
      return;
    }

    this.loaderService.showLoading();
    const { nombre, email } = this.editForm.value;

    this.authService.updateProfile(this.userId, nombre, email).subscribe({
      next: (response) => {
        this.loaderService.hideLoading();
        if (response.isSuccess) {

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
