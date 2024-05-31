import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutorderService {

  private baseURL = 'https://localhost:7269/api/Order';

  constructor(private http: HttpClient) { }

  SaveOrderItems(orderItems:any):Observable<any>{
    return this.http.post(`${this.baseURL}/addOrder`,orderItems)

  }


  getAllOrderByUserID(UserID:string):Observable<any>{
    const params = new HttpParams().set('UserID', UserID);
    //return this.http.get(`${this.baseURL}/GetOrdersByUser`,{params})
    return this.http.get(`${this.baseURL}/GetOrdersByUser/${UserID}`)

  }

  lastOrderForCurrenUser(UserID:string):Observable<any>{
    return this.http.get(`${this.baseURL}/GetLastOrderByUser/${UserID}`)
  }


}
