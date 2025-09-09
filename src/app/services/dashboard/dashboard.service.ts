// Import des outils Angular et RxJS nécessaires
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Message } from '../../../interfaces/Message';

// @Injectable permet d'injecter ce service partout dans l'application
@Injectable({
  providedIn: 'root'  // service disponible globalement (singleton)
})
export class DashboardService {

  /**
   * === SUBJECTS PRIVÉS ===
   * Les BehaviorSubjects sont utilisés pour stocker et gérer l'état interne.
   * Ils sont privés pour éviter que les composants manipulent directement leur état.
   */

  // Gère l'état d'ouverture de la sidebar gauche
  // Elle est ouverte par défaut si la largeur de l'écran >= 992px
  private leftSidebarOpenSubject = new BehaviorSubject<boolean>(window.innerWidth >= 992);

  // Gère l'état d'ouverture de la sidebar droite
  private rightSidebarOpenSubject = new BehaviorSubject<boolean>(window.innerWidth >= 992);

  // Liste des messages de chat (utilisateur et IA)
  private messagesSubject = new BehaviorSubject<Message[]>([
    {
      id: '1',
      text: 'Write an email to your Office boss for 2 days off',
      sender: 'user',           // expéditeur : utilisateur
      timestamp: new Date()
    },
    {
      id: '2',
      text: `<div class="mb-3"><strong>Subject: Request for Two-Day Leave</strong></div>
             <div class="mb-3">Dear [Boss's Name],</div>
             <div class="mb-3">I hope this email finds you well. I am writing to formally request a two-day leave from work on [start date] to [end date]. The reason for my request is [mention the reason briefly, such as personal commitments, family matters, or any other relevant reason].</div>
             <div class="mb-3">I have ensured that all my current tasks and responsibilities are up to date, and I have briefed [colleague's name or team] about the status of my ongoing projects. I am committed to ensuring a smooth transition during my absence and will make myself available for any necessary handovers or additional information as needed.</div>
             <div class="mb-3">Thank you for considering my request. I look forward to your approval and will be available to discuss any further details if necessary.</div>
             <div>Best regards,</div>`,
      sender: 'ai',             // expéditeur : IA
      timestamp: new Date()
    }
  ]);

  // Application active dans le tableau de bord (ex : générateur de texte)
  private activeAppSubject = new BehaviorSubject<string>('');

  /**
   * === OBSERVABLES PUBLICS ===
   * Ils exposent les Subjects sous forme d'Observable pour que les composants puissent s'abonner.
   * Cela protège l'état interne : les composants ne peuvent que lire, pas modifier directement.
   */
  public leftSidebarOpen$: Observable<boolean> = this.leftSidebarOpenSubject.asObservable();
  public rightSidebarOpen$: Observable<boolean> = this.rightSidebarOpenSubject.asObservable();
  public messages$: Observable<Message[]> = this.messagesSubject.asObservable();
  public activeApp$: Observable<string> = this.activeAppSubject.asObservable();

  /**
   * === MÉTHODES DE GESTION DES SIDEBARS ===
   */
  toggleLeftSidebar(): void {
    // Inverse l'état actuel de la sidebar gauche
    this.leftSidebarOpenSubject.next(!this.leftSidebarOpenSubject.value);
  }

  toggleRightSidebar(): void {
    // Inverse l'état actuel de la sidebar droite
    this.rightSidebarOpenSubject.next(!this.rightSidebarOpenSubject.value);
  }

  setLeftSidebar(open: boolean): void {
    // Définit explicitement l'état (true = ouvert, false = fermé)
    this.leftSidebarOpenSubject.next(open);
  }

  setRightSidebar(open: boolean): void {
    this.rightSidebarOpenSubject.next(open);
  }

  /**
   * === MÉTHODES DE GESTION DES MESSAGES ===
   */
  addMessage(text: string, sender: 'user' | 'ai'): void {
    // Crée un nouveau message
    const newMessage: Message = {
      id: Date.now().toString(),  // identifiant unique basé sur le timestamp
      text,
      sender,
      timestamp: new Date()
    };
    
    // Récupère la liste actuelle des messages
    const currentMessages = this.messagesSubject.value;

    // Ajoute le nouveau message et met à jour le BehaviorSubject
    this.messagesSubject.next([...currentMessages, newMessage]);
  }

  /**
   * === CHANGEMENT D'APPLICATION ACTIVE ===
   */
  setActiveApp(appId: string): void {
    this.activeAppSubject.next(appId);
  }

  /**
   * === SIMULATION DE RÉPONSE IA ===
   * Après un délai d'1 seconde, ajoute un message simulé envoyé par l'IA
   */
  simulateAIResponse(userMessage: string): void {
    setTimeout(() => {
      this.addMessage('Je traite votre demande...', 'ai');
    }, 1000);
  }

  /**
   * === ACCÈS DIRECT AU BehaviorSubject ===
   * (optionnel, utile si on a besoin de manipuler directement l'objet, 
   * mais en général l'Observable suffit largement)
   */
  get activeApp(): BehaviorSubject<string> {
    return this.activeAppSubject;
  }

  // Constructeur vide (pas de dépendances injectées ici)
  constructor() { }
}
