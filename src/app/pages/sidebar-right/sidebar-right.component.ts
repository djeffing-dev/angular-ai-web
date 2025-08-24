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
  activeAppId = ''; // Ajoutez cette propriété


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
    
      // Nouvel abonnement : à l'état de l'application active
    this.dashboardService.activeApp$
    .pipe(takeUntil(this.destroy$))
    .subscribe(appId => {
      this.activeAppId = appId;
      // Appelez ici la méthode pour charger l'historique
      this.loadChatHistory(this.activeAppId);
    });
  }

  loadChatHistory(appId: string): void {
    // Dans une application réelle, vous feriez une requête HTTP
    // ou appelleriez un service de données ici.
    console.log(`Chargement de l'historique pour l'application : ${appId}`);

    // Logique temporaire pour simuler le changement de contenu
    if (appId === 'text-generator') {
      this.todayItems = [
        { id: '1', title: 'AiWaveDefination', preview: 'Your last Question' },
        { id: '2', title: 'Business Shortcut Methode', preview: 'Best way to maintain code Quality' }
      ];
      this.yesterdayItems = [
        { id: '3', title: 'How to write a code', preview: 'Form Html CSS JS' },
        { id: '4', title: 'HTML Shortcut Methode', preview: 'Best way to maintain code Quality' }
      ];
      this.weekItems = [
        { id: '5', title: 'User Assistant Request', preview: 'Function Js' }
      ];
    } else if (appId === 'image-generator') {
      this.todayItems = [
        { id: '6', title: 'Image de chat', preview: 'Générée à 14h' }
      ];
      this.yesterdayItems = [
        { id: '7', title: 'Image de chien', preview: 'Générée hier' }
      ];
      this.weekItems = [];
    } else {
      // Pour les autres applications, l'historique est vide
      this.todayItems = [];
      this.yesterdayItems = [];
      this.weekItems = [];
    }
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
