import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './unauthorized.html'
})
export class UnauthorizedComponent {
  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
    this.location.back();
  }
}
