import { Component, OnInit, OnDestroy } from '@angular/core';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sidebar-right',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sidebar-right.component.html',
  styleUrl: './sidebar-right.component.css'
})
export class SidebarRightComponent  implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  isOpen = false;
  searchQuery = '';

  todayItems = [
    { id: '1', title: 'AiWaveDefination', preview: 'Your last Question' },
    { id: '2', title: 'Business Shortcut Methode', preview: 'Best way to maintain code Quality' }
  ];

  yesterdayItems = [
    { id: '3', title: 'How to write a code', preview: 'Form Html CSS JS' },
    { id: '4', title: 'HTML Shortcut Methode', preview: 'Best way to maintain code Quality' }
  ];

  weekItems = [
    { id: '5', title: 'User Assistant Request', preview: 'Function Js' }
  ];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.rightSidebarOpen$
      .pipe(takeUntil(this.destroy$))
      .subscribe(open => this.isOpen = open);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  newChat(): void {
    // Logique pour créer un nouveau chat
    console.log('New chat clicked');
  }

  selectChat(item: any): void {
    console.log('Selected chat:', item);
  }

  showMore(): void {
    console.log('Show more clicked');
  }

}
