import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environement } from '../../environements/environements';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GptService {

  url = `${environement.apiUrl}/api/gpt`
    constructor(private http : HttpClient) { }
  
    getRoadmap = (skill:string, nbMonth:number):Observable<string> => {
      return this.http.get<string>(`${this.url}/roadmap?skill=${skill}&nbMonth=${nbMonth}`, 
        {responseType: 'text' as 'json'}
      );
    };
  
    prompt1 = (messages:string[]):Observable<string> => {
      return this.http.post<string>(`${this.url}/prompt`,
        messages,
        {responseType: 'text' as 'json'}
      )
    }
  
    prompt2= (messages:string[]):Observable<string> => {
      return new Observable<string>(observer =>{
        fetch(`${this.url}/prompt`,{
          method:'POST',
          headers:{
            'Content-Type' : 'application/json'
          },
          body: JSON.stringify(messages)
        })
  
        .then( reponse =>{
          console.log('Statut de la réponse HTTP:', reponse.status);
          const reader = reponse.body?.getReader();
          const decoder =  new TextDecoder();
  
          // Fonction récursive pour lire le flux
          function readChunk() {
            reader?.read().then(({ done, value }) => {
              if (done) {
                observer.complete();
                return;
              }
              // Décode le morceau de données et l'envoie à l'observable
              const chunk = decoder.decode(value);
              // Chaque événement SSE est formaté comme "data: contenu\n"
              const lines = chunk.split('\n').filter(line => line.startsWith('data:'));
              lines.forEach(line => {
                observer.next(line.substring(5).trim()); // Enlève "data:"
              });
              readChunk();
            }).catch(error => {
              observer.error(error);
            });
          }
  
          readChunk();
  
        }).catch(error =>{
          observer.error(error);
        });
        
      });
    };
  
}
