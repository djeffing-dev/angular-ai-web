// Importation des dépendances Angular et RxJS
import { DashboardService } from './../../services/dashboard/dashboard.service';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subject, takeUntil } from 'rxjs'; // Subject = outil de désabonnement, takeUntil = opérateur RxJS
import { SidebarLeftComponent } from "../sidebar-left/sidebar-left.component";
import { SidebarRightComponent } from "../sidebar-right/sidebar-right.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatComponent } from "../chat/chat.component";
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard', // Nom du composant pour être utilisé dans le HTML
  standalone: true,          // Permet d'utiliser le composant sans module Angular global
  imports: [                 // Les dépendances Angular/Composants nécessaires
    SidebarLeftComponent,
    SidebarRightComponent,
    CommonModule,
    FormsModule,
    RouterOutlet
  ],
  templateUrl: './dashboard.component.html', // Vue associée
  styleUrl: './dashboard.component.css'      // Styles associés
})
export class DashboardComponent implements OnInit, OnDestroy {
  // destroy$ est un Subject utilisé pour "notifier" quand on détruit le composant.
  // Cela permet de couper proprement les abonnements RxJS (éviter les fuites mémoire).
  private destroy$ = new Subject<void>();
  
  // États locaux pour savoir si les sidebars sont ouvertes ou non
  leftSidebarOpen = false;
  rightSidebarOpen = false;

  // Savoir si on est en mode mobile (taille écran < 992px)
  isMobile = false;

  // Injection du DashboardService
  constructor(private dashboardService: DashboardService) {
    // Vérifie la taille de l’écran dès la création du composant
    this.checkScreenSize();
  }

  // ----------- Cycle de vie Angular ------------
  ngOnInit(): void {
    // Abonnement à l'état du "leftSidebarOpen$" depuis le service
    this.dashboardService.leftSidebarOpen$
      .pipe(takeUntil(this.destroy$)) // se désabonner quand destroy$ émettra
      .subscribe(open => {
        this.leftSidebarOpen = open;
        console.log('Left sidebar state changed:', open);
      });

    // Abonnement à l'état du "rightSidebarOpen$" depuis le service
    this.dashboardService.rightSidebarOpen$
      .pipe(takeUntil(this.destroy$))
      .subscribe(open => {
        this.rightSidebarOpen = open;
        console.log('Right sidebar state changed:', open);
      });
  }

  // À la destruction du composant
  ngOnDestroy(): void {
    this.destroy$.next();    // envoie un signal aux abonnements
    this.destroy$.complete(); // ferme le Subject (nettoyage)
  }

  // ----------- Gestion du redimensionnement écran ------------
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenSize(); // recalculer isMobile
    
    if (window.innerWidth >= 992) {
      // En mode "desktop", ouvrir les deux sidebars par défaut
      this.dashboardService.setLeftSidebar(true);
      this.dashboardService.setRightSidebar(true);
    } else {
      // En mode "mobile", fermer les deux sidebars par défaut
      this.dashboardService.setLeftSidebar(false);
      this.dashboardService.setRightSidebar(false);
    }
  }

  // Vérifie la taille de l’écran pour savoir si on est en mode mobile
  private checkScreenSize(): void {
    this.isMobile = window.innerWidth < 992;
  }

  // ----------- Actions utilisateur ------------
  toggleLeftSidebar(): void {
    this.dashboardService.toggleLeftSidebar();
  }

  toggleRightSidebar(): void {
    this.dashboardService.toggleRightSidebar();
  }

  // Ferme les sidebars si on clique sur le contenu principal en mode mobile
  onMainContentClick(): void {
    if (this.isMobile) {
      this.dashboardService.setLeftSidebar(false);
      this.dashboardService.setRightSidebar(false);
    }
  }

  // ----------- Classes CSS dynamiques ------------
  get mainContentClasses(): string {
    let classes = 'main-content';
    
    // Si la sidebar gauche est fermée ou si on est en mobile → ajoute "left-collapsed"
    if (!this.leftSidebarOpen || this.isMobile) {
      classes += ' left-collapsed';
    }
    
    // Si la sidebar droite est fermée ou si on est en mobile → ajoute "right-collapsed"
    if (!this.rightSidebarOpen || this.isMobile) {
      classes += ' right-collapsed';
    }
    
    return classes;
  }

  // ----------- Icônes dynamiques ------------
  get leftToggleIcon(): string {
    // Si la sidebar gauche est ouverte → bouton = "times" (croix pour fermer)
    // Sinon → bouton = "bars" (hamburger pour ouvrir)
    return this.leftSidebarOpen ? 'fas fa-times' : 'fas fa-bars';
  }

  get rightToggleIcon(): string {
    // Si la sidebar droite est ouverte → bouton = "times"
    // Sinon → bouton = "history"
    return this.rightSidebarOpen ? 'fas fa-times' : 'fas fa-history';
  }
}
