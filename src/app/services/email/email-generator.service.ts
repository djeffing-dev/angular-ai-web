import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from '../../environements/environements';
import { EmailRequest } from '../../models/emailRequest';

@Injectable({
  providedIn: 'root'
})
export class EmailGeneratorService {

  url = `${baseUrl}/gpt`;
  constructor(private http: HttpClient) { }

  feshfreeEmail = (emailRequest :EmailRequest):Observable<string> =>{
    return this.http.post<string>(`${this.url}/emailGenerator-admin-free`, emailRequest, { responseType: 'text' as 'json' });
  }
}
