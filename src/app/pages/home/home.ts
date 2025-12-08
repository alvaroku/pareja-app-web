import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent implements OnInit {
  daysCount: number = 0;

  ngOnInit() {
    // Calcula los días desde una fecha de aniversario
    const anniversary = new Date('2023-01-01');
    const now = new Date();
    const diff = now.getTime() - anniversary.getTime();
    this.daysCount = Math.floor(diff / (1000 * 60 * 60 * 24));
  }
}
