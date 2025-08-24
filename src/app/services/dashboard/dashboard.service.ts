import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Message } from '../../../interfaces/Message';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private leftSidebarOpenSubject = new BehaviorSubject<boolean>(window.innerWidth >= 992);
  private rightSidebarOpenSubject = new BehaviorSubject<boolean>(window.innerWidth >= 992);
  private messagesSubject = new BehaviorSubject<Message[]>([
    {
      id: '1',
      text: 'Write an email to your Office boss for 2 days off',
      sender: 'user',
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
      sender: 'ai',
      timestamp: new Date()
    }
  ]);

  private activeAppSubject = new BehaviorSubject<string>('text-generator');

  public leftSidebarOpen$: Observable<boolean> = this.leftSidebarOpenSubject.asObservable();
  public rightSidebarOpen$: Observable<boolean> = this.rightSidebarOpenSubject.asObservable();
  public messages$: Observable<Message[]> = this.messagesSubject.asObservable();
  public activeApp$: Observable<string> = this.activeAppSubject.asObservable();

  toggleLeftSidebar(): void {
    this.leftSidebarOpenSubject.next(!this.leftSidebarOpenSubject.value);
  }

  toggleRightSidebar(): void {
    this.rightSidebarOpenSubject.next(!this.rightSidebarOpenSubject.value);
  }

  setLeftSidebar(open: boolean): void {
    this.leftSidebarOpenSubject.next(open);
  }

  setRightSidebar(open: boolean): void {
    this.rightSidebarOpenSubject.next(open);
  }

  addMessage(text: string, sender: 'user' | 'ai'): void {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date()
    };
    
    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, newMessage]);
  }

  setActiveApp(appId: string): void {
    this.activeAppSubject.next(appId);
  }

  // Simuler une réponse IA
  simulateAIResponse(userMessage: string): void {
    setTimeout(() => {
      this.addMessage('Je traite votre demande...', 'ai');
    }, 1000);
  }

  constructor() { }
}
