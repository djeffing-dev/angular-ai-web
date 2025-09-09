import { Component, Inject, ViewChild } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginRequest } from '../../../models/loginRequest';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  @ViewChild("loginForm") loginForm!: NgForm;
  isLoading: boolean = false;
  loginRequest: LoginRequest = { email: "", password: "" };

  constructor(private authService: AuthService,
    @Inject(ToastrService) private toastr: ToastrService
  ) { }

  login() {
    this.isLoading = true;
    this.authService.signin(this.loginRequest).subscribe({
      next: response => { 
        localStorage.setItem("user", JSON.stringify(response));
        this.isLoading = false;
        window.location.reload();

        this.toastr.success("Authtantification reussie !", 'SUCCESS', {
          timeOut: 5000,
          positionClass: 'toast-top-right'
        });

        setTimeout(()=>{
          this.isLoading = false;
          window.location.reload();
        }, 5000);

      },

      error: err => {
        console.error("Une erreur c'est produite : ", err.message);
        this.toastr.error("Email ou mot de passe incorrect!", 'ECHEC :(',{
          timeOut: 5000,
          positionClass: 'toast-top-right'
        });
        this.isLoading = false;
      }
    })
  }
}
