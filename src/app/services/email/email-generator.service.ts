import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { baseUrl } from '../../environements/environements';
import { EmailRequest } from '../../models/emailRequest';
import { EmailGenerator } from '../../models/emailGenerator';
import { httpOption } from '../../const/const';

@Injectable({
  providedIn: 'root'
})
export class EmailGeneratorService {

  url = `${baseUrl}/gpt`;
  url2 = `${baseUrl}/emailGenrator`
  private emailSelected = new BehaviorSubject<EmailGenerator>({} as EmailGenerator)
  
  constructor(private http: HttpClient) { }

  public emailSelected$: Observable<EmailGenerator> = this.emailSelected.asObservable();
  setEmailSelected(emailGenerator: EmailGenerator){
    this.emailSelected.next(emailGenerator);
  }

  feshfreeEmail = (emailRequest :EmailRequest):Observable<string> =>{
    return this.http.post<string>(`${this.url}/emailGenerator-admin-free`, emailRequest, { responseType: 'text' as 'json' });
  }

  // Obtenir la liste des email d'un utlisateur auhtentifier.
  findEmailByUserToken = ():Observable<EmailGenerator[]> =>{
    return this.http.get<EmailGenerator[]>(`${this.url2}/findByUserToken`, httpOption())
  }
}
