import { Component, Inject, ViewChild } from '@angular/core';
import { RegisterRequest } from '../../../models/registerRequest';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  @ViewChild("signupForm") signupForm!: NgForm;

  isLoading: boolean = false;
  passwordConfirm: string = "";
  registerRequest: RegisterRequest = {
    username: "",
    email: "",
    password: "",
    roles: []
  };

  constructor(
    private authService: AuthService,
    @Inject(ToastrService) private toastr: ToastrService
  ) { }

  signup() {
    this.isLoading = true;
    if (this.checkPassword()) { // Checkpassword
      this.authService.register(this.registerRequest).subscribe({
        next: result => {
          console.log("Resulat de la creation de compte :  ", result);

          this.toastr.success("Votre compte a été crée avec succès. Vous pouvez vous connetez maintenant.", 'SUCCESS', {
            timeOut: 7000,
            positionClass: 'toast-top-right'
          });

          setTimeout(() => {
            this.isLoading = false;
            window.location.reload();
          }, 7000);
        },
        error: err => {
          console.error("Une erreur c'est produite : ", err.status);
          this.toastr.error("Une erreur c'est produite!", 'ECHEC :(', {
            timeOut: 5000,
            positionClass: 'toast-top-right'
          });
          this.isLoading = false;
        }
      })
    } else {
      this.toastr.error("Les mots de passe ne corresponde pas!", 'ECHEC :(', {
        timeOut: 5000,
        positionClass: 'toast-top-right'
      });
      this.isLoading = false;
    }
  }

  checkPassword = () => { return this.registerRequest.password == this.passwordConfirm; }


}
