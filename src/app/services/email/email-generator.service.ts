import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environement } from '../../environements/environements';
import { EmailRequest } from '../../models/emailRequest';
import { EmailGenerator } from '../../models/emailGenerator';
import { httpOption } from '../../const/const';

@Injectable({
  providedIn: 'root'
})
export class EmailGeneratorService {

  url = `${environement.apiUrl}/gpt`;
  url2 = `${environement.apiUrl}/emailGenrator`
  private emailSelected = new BehaviorSubject<EmailGenerator>({} as EmailGenerator)

  constructor(private http: HttpClient) { }

  public emailSelected$: Observable<EmailGenerator> = this.emailSelected.asObservable();
  setEmailSelected(emailGenerator: EmailGenerator) {
    this.emailSelected.next(emailGenerator);
  }

  feshGenerateFreeEmail = (emailRequest: EmailRequest): Observable<string> => {
    return this.http.post<string>(`${this.url}/emailGenerator-admin-free`, emailRequest, { responseType: 'text' as 'json' });
  }

  // Generer les email avec le token de l'utilisateur
  feshGenerateAuthenticateEmaill = (emailRequest: EmailRequest): Observable<string> => {
    return this.http.post<string>(`${this.url2}`, emailRequest, { ...httpOption(), responseType: 'text' as 'json' });
  }

  // Mettre a jour l'email d'un utilisateur
  feshUpdateEmaill = (id:number, emailRequest: EmailRequest): Observable<string> => {
    return this.http.put<string>(`${this.url2}?id=${id}`, emailRequest, { ...httpOption(), responseType: 'text' as 'json' });
  }

  // Obtenir la liste des email d'un utlisateur auhtentifier.
  findEmailByUserToken = (): Observable<EmailGenerator[]> => {
    return this.http.get<EmailGenerator[]>(`${this.url2}/findByUserToken`, httpOption())
  }
}
