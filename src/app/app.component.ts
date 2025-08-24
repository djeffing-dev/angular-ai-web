import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RoadmapComponent } from "./pages/roadmap/roadmap.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RoadmapComponent, RouterOutlet, DashboardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'spring-angular-ai';
}
