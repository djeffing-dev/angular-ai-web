import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RoadmapComponent } from "./pages/roadmap/roadmap/roadmap.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RoadmapComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'spring-angular-ai';
}
