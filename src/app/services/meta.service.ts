import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Meta, CreateMetaDto, UpdateMetaDto } from '../models/meta.model';
import { ApiResponse, PagedResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class MetaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/metas`;

  getById(id: number): Observable<ApiResponse<Meta>> {
    return this.http.get<ApiResponse<Meta>>(`${this.apiUrl}/${id}`);
  }

  getAll(): Observable<ApiResponse<Meta[]>> {
    return this.http.get<ApiResponse<Meta[]>>(`${this.apiUrl}`);
  }

  getPaged(pageNumber: number = 1, pageSize: number = 10): Observable<PagedResponse<Meta>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PagedResponse<Meta>>(`${this.apiUrl}/paged`, { params });
  }

  getByUsuarioId(usuarioId: number): Observable<ApiResponse<Meta[]>> {
    return this.http.get<ApiResponse<Meta[]>>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  getMisMetas(): Observable<ApiResponse<Meta[]>> {
    return this.http.get<ApiResponse<Meta[]>>(`${this.apiUrl}/mis-metas`);
  }

  create(meta: CreateMetaDto): Observable<ApiResponse<Meta>> {
    return this.http.post<ApiResponse<Meta>>(`${this.apiUrl}`, meta);
  }

  update(meta: UpdateMetaDto): Observable<ApiResponse<Meta>> {
    return this.http.put<ApiResponse<Meta>>(`${this.apiUrl}/${meta.id}`, meta);
  }

  delete(id: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/${id}`);
  }
}
