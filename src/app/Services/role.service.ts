import { Injectable } from '@angular/core';
import { IRole } from '../Component/Model/iRole';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private http: HttpClient,private router:Router) { }

  private baseURL = 'https://localhost:7269/api/Role';

  AddRole(role:IRole):Observable<any>{
     return this.http.post(`${this.baseURL}/AddRole`,role)
  }
  
  


}
