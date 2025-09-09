import { Component, ViewChild,Inject, OnInit } from '@angular/core';
import { EmailGeneratorService } from '../../services/email/email-generator.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { EmailRequest } from '../../models/emailRequest';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap'; // Import spécifique
import { jsPDF } from 'jspdf'; // Pour mettre au utilisateur de detelecharger les documents via pdf
import "../../../assets/fonts/NotoColorEmoji-Regular-normal.js"; // police convertie en JS
import { ToastrService } from 'ngx-toastr';
import { EmailGenerator } from '../../models/emailGenerator';
import { Subject, takeUntil } from 'rxjs';
import { right } from '@popperjs/core';

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
export class EmailComponent implements OnInit{
  @ViewChild("loginForm") loginForm!:NgForm;
  id!:number;
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

  private destroy$ = new Subject<void>();
  resultat:string = "";
  isLoading : boolean = false;
  copied:boolean =false;

  constructor(
    private emailGeneratorService: EmailGeneratorService,
    @Inject(ToastrService) private toastr: ToastrService
  ){}

  ngOnInit(): void {
     // Abonnement à l'email selectionner "emailSelected$" depuis le service
    this.emailGeneratorService.emailSelected$
    .pipe(takeUntil(this.destroy$))
    .subscribe(currentEmail=>{
      
      this.id = currentEmail.id;
      this.emailRequest = {
        nom: currentEmail.nom,
        destinataire: currentEmail.destinataire,
        objet: currentEmail.objet,
        context: currentEmail.context,
        objectif: currentEmail.objectif,
        langue: currentEmail.langue,
        taille: currentEmail.taille,
        style: currentEmail.style,
        ton: currentEmail.ton,
        humer: currentEmail.humer,
        emoji: currentEmail.emoji
      };
      this.resultat = currentEmail.content;

    });

  }

  generateEmail = () =>{
    this.isLoading = true;
    console.log("Le model email que l'utilisateur a crée : ", this.emailRequest);
    this.emailGeneratorService.feshfreeEmail(this.emailRequest).subscribe({
      next: result => {this.resultat = result
        this.isLoading = false;
      }
    })
    
  }

  copyText = ():void =>{
    if(navigator.clipboard){
      navigator.clipboard.writeText(this.resultat)
      .then(()=> {
        this.copied = true;
        setTimeout(()=> this.copied = false, 2000);
      })
      .catch(err => console.error("Erreur de copie : ", err))
    
    }else{
      console.error("API Clipboard non supportée");
    }
  }

  downloadPDF():void{
    const doc = new jsPDF();
    // Titre
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("📄 Résultat de génération", 10, 15);


    // Contenu
    doc.setFont("helvetica", "normal");
    doc.setFont("callAddFont"); // nouvelle police avec emojis
    doc.setFontSize(12);

    // Gérer le multi-lignes
    const lines = doc.splitTextToSize(this.resultat, 180); // 180mm largeur max
    doc.text(lines, 10, 30);
    
    doc.save("eamail.pdf"); // déclenche le téléchargement
  }


}
