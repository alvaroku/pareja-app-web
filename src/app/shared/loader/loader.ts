import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { LoaderService } from '../../services/loader.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './loader.html',
  styleUrl: './loader.css',
})
export class LoaderComponent {
  loading$: Observable<boolean>;

  constructor(private loaderService: LoaderService) {
    this.loading$ = this.loaderService.loading$;
  }
}
