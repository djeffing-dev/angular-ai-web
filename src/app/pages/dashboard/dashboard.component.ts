import { DashboardService } from './../../services/dashboard/dashboard.service';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SidebarLeftComponent } from "../sidebar-left/sidebar-left.component";
import { SidebarRightComponent } from "../sidebar-right/sidebar-right.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatComponent } from "../chat/chat.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    SidebarLeftComponent, 
    SidebarRightComponent, 
    CommonModule, 
    FormsModule, 
    ChatComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  leftSidebarOpen = false;
  rightSidebarOpen = false;
  isMobile = false;

  constructor(private dashboardService: DashboardService) {
    this.checkScreenSize();
  }

  ngOnInit(): void {
    // Subscribe to sidebar states
    this.dashboardService.leftSidebarOpen$
      .pipe(takeUntil(this.destroy$))
      .subscribe(open => this.leftSidebarOpen = open);

    this.dashboardService.rightSidebarOpen$
      .pipe(takeUntil(this.destroy$))
      .subscribe(open => this.rightSidebarOpen = open);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  //
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenSize();
    
    if (window.innerWidth >= 992) {
      this.dashboardService.setLeftSidebar(true);
      this.dashboardService.setRightSidebar(true);
    } else {
      this.dashboardService.setLeftSidebar(false);
      this.dashboardService.setRightSidebar(false);
    }
  }


  private checkScreenSize(): void {
    this.isMobile = window.innerWidth < 992;
  }

  toggleLeftSidebar(): void {
    this.dashboardService.toggleLeftSidebar();
  }

  toggleRightSidebar(): void {
    this.dashboardService.toggleRightSidebar();
  }

  onMainContentClick(): void {
    if (this.isMobile) {
      this.dashboardService.setLeftSidebar(false);
      this.dashboardService.setRightSidebar(false);
    }
  }

  get mainContentClasses(): string {
    let classes = 'main-content';
    
    if (!this.leftSidebarOpen || this.isMobile) {
      classes += ' left-collapsed';
    }
    
    if (!this.rightSidebarOpen || this.isMobile) {
      classes += ' right-collapsed';
    }
    
    return classes;
  }

  get leftToggleIcon(): string {
    return this.leftSidebarOpen ? 'fas fa-times' : 'fas fa-bars';
  }

  get rightToggleIcon(): string {
    return this.rightSidebarOpen ? 'fas fa-times' : 'fas fa-history';
  }

}
