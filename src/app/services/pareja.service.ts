import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Pareja, EnviarInvitacionDto, ResponderInvitacionDto, EstadoInvitacion } from '../models/pareja.model';

@Injectable({
  providedIn: 'root'
})
export class ParejaService {
  private apiUrl = `${environment.apiUrl}/pareja`;

  constructor(private http: HttpClient) {}

  getParejaActiva(): Observable<ApiResponse<Pareja | null>> {
    return this.http.get<ApiResponse<Pareja | null>>(this.apiUrl);
  }

  enviarInvitacion(dto: EnviarInvitacionDto): Observable<ApiResponse<Pareja>> {
    return this.http.post<ApiResponse<Pareja>>(`${this.apiUrl}/invitar`, dto);
  }

  responderInvitacion(dto: ResponderInvitacionDto): Observable<ApiResponse<Pareja>> {
    return this.http.post<ApiResponse<Pareja>>(`${this.apiUrl}/responder`, dto);
  }

  aceptarInvitacion(parejaId: number): Observable<ApiResponse<Pareja>> {
    return this.responderInvitacion({ parejaId, estado: EstadoInvitacion.Aceptada });
  }

  rechazarInvitacion(parejaId: number): Observable<ApiResponse<Pareja>> {
    return this.responderInvitacion({ parejaId, estado: EstadoInvitacion.Rechazada });
  }

  eliminarPareja(): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(this.apiUrl);
  }
}
