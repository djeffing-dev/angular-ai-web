import { Component, OnInit } from '@angular/core';
import { JwtResponse } from '../../../models/jwtResponse';
import { isUserConnected, userConnected } from '../../../const/const';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  user: any = userConnected();
  isUserConnected:boolean = isUserConnected();

  ngOnInit(): void {
    
  }



  isLogin(){
    if(!isUserConnected){
     this.user = JSON.stringify(localStorage.getItem("user"));
    }
  }
}
