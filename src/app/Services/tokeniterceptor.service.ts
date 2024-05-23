// import { TokeniterceptorService } from './tokeniterceptor.service';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { ElementRef, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokeniterceptorService implements HttpInterceptor {

  //private elementRef: ElementRef
  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const usertoken=localStorage.getItem("token");
    let tokenHead=req.clone({
      setHeaders:{
        Authorization:'Bearer '+usertoken
      }
    })
    // let val=8828
    // const ProductsCounter = this.elementRef.nativeElement.querySelector("#ProductsCounter") as HTMLElement;
    // ProductsCounter.innerText=val.toString()
    //throw new Error('Method not implemented.');
    return next.handle(tokenHead);
    
  }
  
}
