import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { NotificationRequest, NotificationResponse } from '../models/notification.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/notifications`;

  sendNotification(request: NotificationRequest): Observable<ApiResponse<NotificationResponse>> {
    return this.http.post<ApiResponse<NotificationResponse>>(this.apiUrl, request);
  }

  getUserNotifications(userId: number): Observable<ApiResponse<NotificationResponse[]>> {
    return this.http.get<ApiResponse<NotificationResponse[]>>(`${this.apiUrl}/user/${userId}`);
  }

  markAsRead(notificationId: number, userId: number): Observable<ApiResponse<boolean>> {
    return this.http.put<ApiResponse<boolean>>(`${this.apiUrl}/${notificationId}/markAsRead?userId=${userId}`, {});
  }
}
