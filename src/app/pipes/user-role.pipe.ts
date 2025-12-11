import { Pipe, PipeTransform } from '@angular/core';
import { UserRole } from '../models/usuario.model';

@Pipe({
  name: 'userRole',
  standalone: true
})
export class UserRolePipe implements PipeTransform {
  transform(role: UserRole): string {
    switch (role) {
      case UserRole.SuperAdmin:
        return 'Super Administrador';
      case UserRole.User:
        return 'Usuario';
      default:
        return 'Desconocido';
    }
  }
}
