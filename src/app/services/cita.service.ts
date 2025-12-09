import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Cita, CreateCitaDto, UpdateCitaDto } from '../models/cita.model';
import { ApiResponse, PagedResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/citas`;

  getById(id: number): Observable<ApiResponse<Cita>> {
    return this.http.get<ApiResponse<Cita>>(`${this.apiUrl}/${id}`);
  }

  getAll(): Observable<ApiResponse<Cita[]>> {
    return this.http.get<ApiResponse<Cita[]>>(`${this.apiUrl}`);
  }

  getPaged(pageNumber: number = 1, pageSize: number = 10): Observable<PagedResponse<Cita>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PagedResponse<Cita>>(`${this.apiUrl}/paged`, { params });
  }

  getByUsuarioId(usuarioId: number): Observable<ApiResponse<Cita[]>> {
    return this.http.get<ApiResponse<Cita[]>>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  getMisCitas(): Observable<ApiResponse<Cita[]>> {
    return this.http.get<ApiResponse<Cita[]>>(`${this.apiUrl}/mis-citas`);
  }

  create(cita: CreateCitaDto): Observable<ApiResponse<Cita>> {
    return this.http.post<ApiResponse<Cita>>(`${this.apiUrl}`, cita);
  }

  update(cita: UpdateCitaDto): Observable<ApiResponse<Cita>> {
    return this.http.put<ApiResponse<Cita>>(`${this.apiUrl}/${cita.id}`, cita);
  }

  delete(id: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/${id}`);
  }
}
