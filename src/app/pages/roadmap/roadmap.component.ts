import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { marked } from 'marked';
import { GptService } from '../../services/gpt/gpt.service';

@Component({
  selector: 'app-roadmap',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './roadmap.component.html',
  styleUrl: './roadmap.component.css'
})
export class RoadmapComponent {
  @ViewChild("loginForm") loginForm!:NgForm;
  nbrMonth:number = 1;
  skill:string = '';
  apiResponseHtml = ''
  isLoading:boolean=false;
  constructor(private gptService: GptService ){}

  envoyerRequete(){
    this.isLoading=true;
    this.gptService.getRoadmap(this.skill, this.nbrMonth).subscribe({
      next: async response=>{
        this.apiResponseHtml = await marked(response);
        this.isLoading = false;
      },

      error: err => {
        console.error(err);
        this.isLoading = false;
      }
    })
  }

}
