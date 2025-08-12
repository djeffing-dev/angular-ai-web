import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../../environements/environements';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoadmapService {

   url = `${baseUrl}/roadmap`
  constructor(private http : HttpClient) { }

  getRoadmap = (skill:string, nbMonth:number):Observable<string> => {
    return this.http.get<string>(`${this.url}?skill=${skill}&nbMonth=${nbMonth}`, 
      {responseType: 'text' as 'json'}
    )
  };

}
