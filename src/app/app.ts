import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navigacija } from './components/navigacija/navigacija';
import { Agent } from './components/agent/agent';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navigacija, Agent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'igracke-shop';
}