import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Memoria, CreateMemoriaDto, UpdateMemoriaDto } from '../models/memoria.model';
import { ApiResponse, PagedResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class MemoriaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/memorias`;

  getById(id: number): Observable<ApiResponse<Memoria>> {
    return this.http.get<ApiResponse<Memoria>>(`${this.apiUrl}/${id}`);
  }

  getAll(): Observable<ApiResponse<Memoria[]>> {
    return this.http.get<ApiResponse<Memoria[]>>(`${this.apiUrl}`);
  }

  getPaged(pageNumber: number = 1, pageSize: number = 10): Observable<PagedResponse<Memoria>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PagedResponse<Memoria>>(`${this.apiUrl}/paged`, { params });
  }

  getByUsuarioId(usuarioId: number): Observable<ApiResponse<Memoria[]>> {
    return this.http.get<ApiResponse<Memoria[]>>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  create(memoria: CreateMemoriaDto): Observable<ApiResponse<Memoria>> {
    return this.http.post<ApiResponse<Memoria>>(`${this.apiUrl}`, memoria);
  }

  update(memoria: UpdateMemoriaDto): Observable<ApiResponse<Memoria>> {
    return this.http.put<ApiResponse<Memoria>>(`${this.apiUrl}/${memoria.id}`, memoria);
  }

  delete(id: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/${id}`);
  }
}
