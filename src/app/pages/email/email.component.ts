import { Component, ViewChild } from '@angular/core';
import { EmailGeneratorService } from '../../services/email/email-generator.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { EmailRequest } from '../../models/emailRequest';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap'; // Import spécifique

@Component({
  selector: 'app-email',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    NgbTooltipModule // Important pour faire fonctionner les badge d'informations sur les inputs
  ],
  templateUrl: './email.component.html',
  styleUrl: './email.component.css'
})
export class EmailComponent {
  @ViewChild("loginForm") loginForm!:NgForm;
  emailRequest : EmailRequest = {
    nom: "",
    destinataire: "",
    objet: "",
    context: "",
    objectif: "",
    langue: "fr",
    taille: "moyen",
    style: "auto",
    ton: "neutre",
    humer: "neutre",
    emoji: "modere"
  };

  resultat:string = "";
  isLoading : boolean = false;

  constructor(private emailGeneratorService: EmailGeneratorService){}

  generateEmail = () =>{
    this.isLoading = true;
    console.log("Le model email que l'utilisateur a crée : ", this.emailRequest);
    this.emailGeneratorService.feshfreeEmail(this.emailRequest).subscribe({
      next: result => {this.resultat = result
        this.isLoading = false;
      }
    })
    
  }


}
