import { Component, ViewChild, Inject, OnInit } from '@angular/core';
import { EmailGeneratorService } from '../../services/email/email-generator.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { EmailRequest } from '../../models/emailRequest';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap'; // Import spécifique
import { jsPDF } from 'jspdf'; // Pour mettre au utilisateur de detelecharger les documents via pdf
import "../../../assets/fonts/NotoColorEmoji-Regular-normal.js"; // police convertie en JS
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { isUserConnected } from '../../const/const';
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
export class EmailComponent implements OnInit {
  @ViewChild("loginForm") loginForm!: NgForm;
  id!: number | null;
  emailRequest: EmailRequest = {
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
  resultat: string = "";
  isLoading: boolean = false;
  isCreate!: boolean;
  copied: boolean = false;

  constructor(
    private emailGeneratorService: EmailGeneratorService,
    @Inject(ToastrService) private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    // Abonnement à l'email selectionner "emailSelected$" depuis le service
    this.emailGeneratorService.emailSelected$
      .pipe(takeUntil(this.destroy$))
      .subscribe(currentEmail => {

        this.id = currentEmail.id;
        this.isCreate = (this.id == null || this.id == undefined) // si l'id prend une valeur alors l'utilisateur veux faire une mise a jour

        if (currentEmail.id != undefined) {
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
        }
      });
  }

  resetComponent(): void {
    console.log("resetComponent");
    this.id = null;
    this.isCreate = (this.id==null || this.id==undefined)
    this.emailRequest = {
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
    this.resultat = "";
  }


  generateEmail = () => {
    this.isLoading = true;
    (isUserConnected()) ? this.generateAuthenticateEmail() : this.generateFreeEmail()
  }

  // Generer des emails gratuitements
  generateFreeEmail() {
    console.log("L'utilisateur non connecter --->");
    this.emailGeneratorService.feshGenerateFreeEmail(this.emailRequest).subscribe({
      next: result => {
        this.resultat = result
        this.isLoading = false;
      },

      error: err => {
        console.error("Une erreur c'est produite : ", err.message);
        this.toastr.error("Une erreur c'est produite!", 'ECHEC :(', {
          timeOut: 5000,
          positionClass: 'toast-top-right'
        });
        this.isLoading = false;
      }
    })
  }

  // Generer les emails d'un utilisateurs connecter,
  generateAuthenticateEmail() {
    console.log("---> L'utilisateur connecter connecter --->");
    this.emailGeneratorService.feshGenerateAuthenticateEmaill(this.emailRequest).subscribe({
      next: result => {
        this.resultat = result
        this.isLoading = false;
      },

      error: err => {
        console.error("Une erreur c'est produite : ", err.message);
        this.toastr.error("Une erreur c'est produite!", 'ECHEC :(', {
          timeOut: 5000,
          positionClass: 'toast-top-right'
        });
        this.isLoading = false;
      }
    })
  }

  // Generer et mettre a jour l'email de l'utilisateur
  updateEmail() {
    if (this.id != null) {
      this.isLoading = true;
      console.log("---> Mettre a jour l'email de l'utilisateur connecter connecter --->");
      this.emailGeneratorService.feshUpdateEmaill(this.id, this.emailRequest).subscribe({
        next: result => {
          this.resultat = result
          this.isLoading = false;
        },

        error: err => {
          console.error("Une erreur c'est produite : ", err.message);
          this.toastr.error("Une erreur c'est produite!", 'ECHEC :(', {
            timeOut: 5000,
            positionClass: 'toast-top-right'
          });
          this.isLoading = false;
        }
      })
    }
  }

  copyText = (): void => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(this.resultat)
        .then(() => {
          this.copied = true;
          setTimeout(() => this.copied = false, 2000);
        })
        .catch(err => console.error("Erreur de copie : ", err))

    } else {
      // Fallback pour les mobiles anciens
      const textarea = document.createElement("textarea");
      textarea.value = this.resultat;
      textarea.style.position = "fixed"; // évite le scroll sur iOS
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand("copy");
        this.copied = true;
        setTimeout(() => this.copied = false, 2000);
      } catch (err) {
        console.error("Fallback: impossible de copier", err);
      }
      document.body.removeChild(textarea);
    }
  }

  downloadPDF(): void {
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
