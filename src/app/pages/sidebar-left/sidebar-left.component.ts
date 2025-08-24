import { AppItem } from './../../../interfaces/AppItem';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-left',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar-left.component.html',
  styleUrl: './sidebar-left.component.css'
})
export class SidebarLeftComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  isOpen = false;
  activeAppId = '';

  appItems: AppItem[] = [
    {
      id: 'text-generator',
      name: 'Text Generator',
      icon: 'fas fa-pencil-alt',
      iconClass: 'text-generator',
      active: true
    },
    {
      id: 'image-generator',
      name: 'Image Generator',
      icon: 'fas fa-image',
      iconClass: 'image-generator',
      badge: 'NEW',
      active: false
    },
    {
      id: 'code-generator',
      name: 'Code Generator',
      icon: 'fas fa-code',
      iconClass: 'code-generator',
      active: false
    },
    {
      id: 'image-editor',
      name: 'Image Editor',
      icon: 'fas fa-edit',
      iconClass: 'image-editor',
      active: false
    },
    {
      id: 'video-generator',
      name: 'Video Generator',
      icon: 'fas fa-video',
      iconClass: 'video-generator',
      active: false
    },
    {
      id: 'email-generator',
      name: 'Email Generator',
      icon: 'fas fa-envelope',
      iconClass: 'email-generator',
      active: false
    },
    {
      id: 'website-generator',
      name: 'Website Generator',
      icon: 'fas fa-globe',
      iconClass: 'website-generator',
      badge: 'PRO',
      active: false
    }
  ];

  constructor( private dashboardService: DashboardService,
    private router: Router // Injectez le Router
   ) {}

  ngOnInit(): void {
    this.dashboardService.leftSidebarOpen$
      .pipe(takeUntil(this.destroy$))
      .subscribe(open => this.isOpen = open);

    this.dashboardService.activeApp$
      .pipe(takeUntil(this.destroy$))
      .subscribe(appId => this.activeAppId = appId);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectApp(appId: string): void {
    this.dashboardService.setActiveApp(appId);
    this.router.navigate([appId]);
  }
}
