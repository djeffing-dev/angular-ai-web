import { Component, ViewChild, Inject, OnInit } from '@angular/core';
import { EmailGeneratorService } from '../../services/email/email-generator.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { EmailRequest, initEmailRequest, toEmailRequest } from '../../models/emailRequest';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap'; // Import spécifique
import { jsPDF } from 'jspdf'; // Pour mettre au utilisateur de detelecharger les documents via pdf
// import "../../../assets/fonts/NotoColorEmoji-Regular-normal.js"; // police convertie en JS
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
  emailRequest: EmailRequest = initEmailRequest();

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
          this.emailRequest = toEmailRequest(currentEmail);
          this.resultat = currentEmail.content;
        }
      });
  }

  resetComponent(): void {
    console.log("resetComponent");
    this.id = null;
    this.isCreate = (this.id == null || this.id == undefined)
    this.emailRequest = initEmailRequest();
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
      next: response => {
        const body = response.body;
        const headers = response.headers;

        if (response.status == 200) {
          this.resultat = body ?? '';

          this.toastr.success(
            `Votre email gratuit a été généré. 
            Il vous reste ${headers.get('x-ratelimit-remaining')} sur ${headers.get('x-ratelimit-limit')} requêtes.`,
            "Email généré avec succès 🎉",
            {
              timeOut: 7000,
              positionClass: 'toast-top-right'
            }
          );

        }
      },

      error: err => {
        if (err.status == 400) {
          this.toastr.error(
            "Vous avez épuisé vos essais gratuits. Revenez demain ou connectez-vous pour continuer.",
            "Limite atteinte 🚫",
            {
              timeOut: 7000,
              positionClass: 'toast-top-right'
            }
          );

        } else {
          console.error("Une erreur c'est produite : ", err.message);
          this.toastr.error(
            "Un problème est survenu lors de la génération de l’email. Veuillez réessayer plus tard.",
            "Erreur inattendue ⚠️",
            {
              timeOut: 7000,
              positionClass: 'toast-top-right'
            }
          );
        }
        this.isLoading = false;
      },

      complete: () => {
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
