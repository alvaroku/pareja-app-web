import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from '../../shared/loader/loader';

@Component({
  selector: 'app-simple-layout',
  imports: [RouterOutlet, LoaderComponent],
  templateUrl: './simple-layout.html',
  styleUrl: './simple-layout.css',
})
export class SimpleLayoutComponent {

}
