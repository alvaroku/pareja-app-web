import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Usuario, ResourceResponse, UserRole } from '../models/usuario.model';
import { ApiResponse, PagedData } from '../models/api-response.model';

export interface UpdateUsuarioDto {
  nombre: string;
  email: string;
  codigoPais?: string;
  telefono?: string;
  role?: UserRole;
}

export interface CreateUsuarioDto {
  nombre: string;
  email: string;
  password: string;
  codigoPais?: string;
  telefono?: string;
  role: UserRole;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/usuarios`;

  getAll(pageNumber: number = 1, pageSize: number = 100): Observable<ApiResponse<Usuario[]>> {
    return this.http.get<ApiResponse<PagedData<Usuario>>>(this.apiUrl, {
      params: { pageNumber: pageNumber.toString(), pageSize: pageSize.toString() }
    }).pipe(
      map(response => ({
        ...response,
        data: response.data.items
      }))
    );
  }

  create(dto: CreateUsuarioDto): Observable<ApiResponse<Usuario>> {
    return this.http.post<ApiResponse<Usuario>>(this.apiUrl, dto);
  }

  update(id: number, dto: UpdateUsuarioDto): Observable<ApiResponse<Usuario>> {
    return this.http.put<ApiResponse<Usuario>>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/${id}`);
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
