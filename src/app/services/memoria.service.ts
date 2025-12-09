import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Memoria, CreateMemoriaDto, UpdateMemoriaDto, ResourceResponse } from '../models/memoria.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class MemoriaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/memorias`;

  getById(id: number): Observable<ApiResponse<Memoria>> {
    return this.http.get<ApiResponse<Memoria>>(`${this.apiUrl}/${id}`);
  }

  getMisMemorias(): Observable<ApiResponse<Memoria[]>> {
    return this.http.get<ApiResponse<Memoria[]>>(`${this.apiUrl}/mis-memorias`);
  }

  create(memoria: CreateMemoriaDto): Observable<ApiResponse<Memoria>> {
    return this.http.post<ApiResponse<Memoria>>(`${this.apiUrl}`, memoria);
  }

  update(id: number, memoria: UpdateMemoriaDto): Observable<ApiResponse<Memoria>> {
    return this.http.put<ApiResponse<Memoria>>(`${this.apiUrl}/${id}`, memoria);
  }

  uploadFile(memoriaId: number, file: File): Observable<ApiResponse<ResourceResponse>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse<ResourceResponse>>(`${this.apiUrl}/${memoriaId}/upload`, formData);
  }

  delete(id: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/${id}`);
  }
}
