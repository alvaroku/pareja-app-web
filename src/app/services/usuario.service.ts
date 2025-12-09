import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Usuario, ResourceResponse } from '../models/usuario.model';
import { ApiResponse } from '../models/api-response.model';

export interface UpdateUsuarioDto {
  id: number;
  nombre: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/usuarios`;

  update(usuario: UpdateUsuarioDto): Observable<ApiResponse<Usuario>> {
    return this.http.put<ApiResponse<Usuario>>(`${this.apiUrl}/${usuario.id}`, usuario);
  }

  getById(id: number): Observable<ApiResponse<Usuario>> {
    return this.http.get<ApiResponse<Usuario>>(`${this.apiUrl}/${id}`);
  }

  uploadProfilePhoto(usuarioId: number, file: File): Observable<ApiResponse<ResourceResponse>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse<ResourceResponse>>(`${this.apiUrl}/${usuarioId}/upload-photo`, formData);
  }

  deleteProfilePhoto(usuarioId: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/${usuarioId}/delete-photo`);
  }
}
