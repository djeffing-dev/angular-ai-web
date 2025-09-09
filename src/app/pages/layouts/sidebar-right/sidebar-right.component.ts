import { EmailGeneratorService } from './../../../services/email/email-generator.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DashboardService } from '../../../services/dashboard/dashboard.service';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmailGenerator } from '../../../models/emailGenerator';
import { userConnected } from '../../../const/const';

@Component({
  selector: 'app-sidebar-right',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sidebar-right.component.html',
  styleUrl: './sidebar-right.component.css'
})
export class SidebarRightComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  emailHistorys: EmailGenerator[] = [];

  isOpen = false;
  searchQuery = '';
  activeAppId = ''; // Ajoutez cette propriété

  todayItems = [
    { id: 1, title: 'AiWaveDefination',updatedAt :"", preview: 'Your last Question' },
    { id: 2, title: 'Business Shortcut Methode',updatedAt :"", preview: 'Best way to maintain code Quality' }
  ];

  yesterdayItems = [
    { id: 3, title: 'How to write a code',updatedAt :"", preview: 'Form Html CSS JS' },
    { id: 4, title: 'HTML Shortcut Methode',updatedAt :"", preview: 'Best way to maintain code Quality' }
  ];

  weekItems = [
    { id: 5, title: 'User Assistant Request',updatedAt :"", preview: 'Function Js' }
  ];

  olderItems = [
  { id: 5, title: 'User Assistant Request',updatedAt :"", preview: 'Function Js' }
  ];   

  constructor(private dashboardService: DashboardService,
    private emailGeneratorService: EmailGeneratorService
  ) { }

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

    // Email de l'utilisateur connecter
    //this.getEmailHistory();
  }

  loadChatHistory(appId: string): void {
    // Dans une application réelle, vous feriez une requête HTTP
    // ou appelleriez un service de données ici.
    console.log(`Chargement de l'historique pour l'application : ${appId}`);

    // Logique temporaire pour simuler le changement de contenu
    if (appId == '') {
      this.todayItems = [
        { id: 1, title: 'AiWaveDefination',updatedAt :"", preview: 'Your last Question' },
        { id: 2, title: 'Business Shortcut Methode',updatedAt :"", preview: 'Best way to maintain code Quality' }
      ];
      this.yesterdayItems = [
        { id: 3, title: 'How to write a code',updatedAt :"", preview: 'Form Html CSS JS' },
        { id: 4, title: 'HTML Shortcut Methode',updatedAt :"", preview: 'Best way to maintain code Quality' }
      ];
      this.weekItems = [
        { id: 5, title: 'User Assistant Request',updatedAt :"", preview: 'Function Js' }
      ];
    } else if (appId == "image-editor") {
      this.todayItems = [
        { id: 6, title: 'Image de chat',updatedAt :"", preview: 'Générée à 14h' }
      ];
      this.yesterdayItems = [
        { id: 7, title: 'Image de chien',updatedAt :"", preview: 'Générée hier' }
      ];
      this.weekItems = [];
      this.olderItems = [];
    } else if(appId == "email-generator"){
      // Pour les autres applications, l'historique est vide
      (userConnected())? this.getEmailHistory() : this.initialiseList()
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
    
    if(this.activeAppId=="email-generator") this.selectedEmail(item);
  }

  showMore(): void {
    console.log('Show more clicked');
  }

  getEmailHistory() {
    if (userConnected()) {
      this.emailGeneratorService.findEmailByUserToken().subscribe({
        next: result => {
          this.emailHistorys = result;
          console.log("Historique des mail de l'utilisateurs connecter : ", this.emailHistorys)


          // Initialiser les tableaux
          this.initialiseList();
          
          // Obtenir la date d'aujourd'hui et hier
          const today = new Date();
          const yesterday = new Date();
          yesterday.setDate(today.getDate() - 1);
          
          this.emailHistorys.forEach((email) => {
            const updatedAt = this.parseCustomDate(email.updatedAt);
            
            // Vérifier si c'est aujourd'hui
            if (
              updatedAt.getDate() === today.getDate() &&
              updatedAt.getMonth() === today.getMonth() &&
              updatedAt.getFullYear() === today.getFullYear()
            ) {
              this.todayItems.push({
                id: email.id,
                title: email.objet,
                preview: email.content,
                updatedAt: email.updatedAt
              });
            }
            else if( // Vérifier si c'est dans les 7 derniers jours
              updatedAt.getDate() === yesterday.getDate() &&
              updatedAt.getMonth() === yesterday.getMonth() &&
              updatedAt.getFullYear() === yesterday.getFullYear()
            ){
              this.yesterdayItems.push({
                id: email.id,
                title: email.objet,
                preview: email.content,
                updatedAt: email.updatedAt
              });
            } else{
              const diffInMs = today.getTime() - updatedAt.getTime();
              const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

              if (diffInDays <= 7) {
                this.weekItems.push({
                  id: email.id,
                  title: email.objet,
                  preview: email.content,
                  updatedAt: email.updatedAt
                });
              }else{ // Si l'email n'a pas été crée il ya 7 jour, on le met dans la liste des enciens email
                this.olderItems.push({
                  id: email.id,
                  title: email.objet,
                  preview: email.content,
                  updatedAt: email.updatedAt
                })
              }

            }

            //Trier les tableaux par date (du plus récent au plus ancien)
            this.todayItems = this.sortByDateDesc(this.todayItems);
            this.yesterdayItems = this.sortByDateDesc(this.yesterdayItems);
            this.weekItems = this.sortByDateDesc(this.weekItems);
            this.olderItems = this.sortByDateDesc(this.olderItems);
          });
        },

        error: err => {
          console.log("Une erreur s'est produite lors de la recuperation de email de l'utilsateur connecter : ", err.message);
        }
      })
    }else{
      console.log("Aucun utilisateur connecter pour recuperer les email !! ");
    }

  }

  // Fonction utilitaire pour parser la date "dd/MM/yyyy HH:mm"
  parseCustomDate(DateStr: string): Date {
    const [datePart, timePart] = DateStr.split(" ");
    const [day, month, year] = datePart.split("/").map(Number);
    const [hours, minutes] = timePart.split(":").map(Number);
    return new Date(year, month - 1, day, hours, minutes);
  }

  // Fonction pour trier un tableau par date (desc = plus récent en premier)
  sortByDateDesc(items: any[]): any[] {
    return items.sort((a, b) => {
      const dateA = this.parseCustomDate(a.updatedAt).getTime();
      const dateB = this.parseCustomDate(b.updatedAt).getTime();
      return dateB - dateA // tri descendant
    })
  }

  // Reinitaliser la liste des tous les historiques
  initialiseList(){
    this.todayItems = [];
    this.yesterdayItems = [];
    this.weekItems = [];
    this.olderItems = [];
  }

  // Cette fonction est excuter lorsque un email est selectonner dans la liste des historiques
  selectedEmail(item: any){
    const emailSelected = this.emailHistorys.find((email)=> email.id == item.id);
    this.emailGeneratorService.setEmailSelected(emailSelected!) // "!" quand que le resultat ne sera jamais undefined
  }
}
