import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { marked } from 'marked';
import { GptService } from '../../services/gpt/gpt.service';
import { DashboardService } from '../../services/dashboard/dashboard.service';

@Component({
  selector: 'app-conversation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './conversation.component.html',
  styleUrl: './conversation.component.css'
})
export class ConversationComponent {
  prompt: string ='';
  isLoading: boolean = false;
  reponseChunks: string = '';
  messages: string[] = [];
  activeAppId = "code-generator"

  constructor(private gptService: GptService, private dashboardService: DashboardService){
    this.dashboardService.activeApp.subscribe(appId =>{
      this.activeAppId = appId;
    })
  }



  sendMessage = () => {
    this.messages.push(this.prompt);
    this.prompt = '';
    this.isLoading = true;
    
    this.gptService.prompt1(this.messages).subscribe({
      next : async (response) =>{
        console.log(response)
        this.reponseChunks = await marked(response);
        this.messages.push(this.reponseChunks);
        this.isLoading = false;
      },
      error: (err) => {
        console.log('Erreur de Streaming', err);
        this.isLoading = false;
      },

      complete : () => {console.log('Streaming Terminié.')}
    })
  }

}
