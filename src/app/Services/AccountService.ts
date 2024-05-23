import { HttpClient ,HttpErrorResponse,HttpResponse} from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, tap, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { IUserRegister } from '../Component/Model/iRegisterUser';


@Injectable({
  providedIn: 'root'
})
export class AccountService {

  user: {} | undefined;
  private baseURL = 'https://localhost:7269/api/Account';
  tokenNotFound: EventEmitter<void> = new EventEmitter<void>();
  constructor(private http: HttpClient,private router:Router) { }
  
  // login(email:string,passowrd:string){
  //   this.user={};
  // }
  login(obj: any):Observable<any> {
    return this.http.post(`${this.baseURL}/Login`,obj);
    
  }

  // register(objregister: IUserRegister):Observable<any>{

  //   const formData = new FormData();
  //   formData.append('fullName', objregister.fullName);
  //   formData.append('email', objregister.email.toString());
  //   formData.append('password', objregister.password.toString());
  //   formData.append('phoneNumber', objregister.phoneNumber.toString());
  //   formData.append('imagefile', objregister.imagefile??"");
  //   console.log("from the final station....");
  //   console.log("file:::")
  //   console.log(objregister.imagefile);
  //   console.log("Name:::")
  //   console.log(objregister.fullName);
  //   return this.http.post(`${this.baseURL}/Register`,formData,{ observe: 'response' }).pipe(
  //     tap((response: HttpResponse<any>) => {
  //       console.log('Add request successful with status code:', response.status);
  //       console.log('Response body:', response.body); // Log the response body
  //       Swal.fire({
  //         title: 'Success!',
  //         text: response.body.message,
  //         icon: 'success'
  //       });
  //     }),
  //     catchError(error => {
  //       // Handle error here
  //       //console.error('Add request failed:', error);
  //       console.log("Errors While Adding User...............................")
  //       console.log(error)
  //       let errorMessage = error.errorModel.message;
  //       if (error && error.error && error.error.message) {
  //         errorMessage = error.error.message;
  //       }
  //       // You can display error message to the user or handle it as per your application's requirements
  //       Swal.fire({
  //         title: 'Error!',
  //         text: errorMessage,
  //         icon: 'error'
  //       });
  //       return throwError(()=>errorMessage);
  //     })



  //   );

  // }


  register(objregister: IUserRegister): Observable<any> {
    const formData = new FormData();
    formData.append('fullName', objregister.fullName);
    formData.append('email', objregister.email.toString());
    formData.append('password', objregister.password.toString());
    formData.append('phoneNumber', objregister.phoneNumber.toString());
    formData.append('imagefile', objregister.imagefile ?? '');
    formData.append('roleName', objregister.roleName.toString());
    console.log("from the final station....");
    console.log("file:::");
    console.log(objregister.imagefile);
    console.log("Name:::");
    console.log(objregister.fullName);
    return this.http.post(`${this.baseURL}/Register`, formData, { observe: 'response' }).pipe(
      tap((response: HttpResponse<any>) => {
        console.log('Add request successful with status code:', response.status);
        console.log('Response body:', response.body); // Log the response body
        Swal.fire({
          title: 'Success!',
          text: response.body.message,
          icon: 'success'
        });
      }),
      catchError((error: HttpErrorResponse) => {
        console.log("Errors While Adding User...............................")
        console.log(error)
        let errorMessage = "An error occurred"; // Default error message
        if (error && error.error && error.error.errorModel) {
          errorMessage = error.error.errorModel.join('\n');
        } else if (error && error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        // Display error message to the user or handle it as per your application's requirements
        Swal.fire({
          title: 'Error!',
          text: errorMessage,
          icon: 'error'
        });
        return throwError(() => errorMessage);
      })



      
    );
  }

  isAuthenticated() {

    const usertoken=localStorage.getItem("token");
    return Boolean(usertoken)
    //return Boolean(this.user);
  }

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    this.user = undefined;
    this.router.navigate(['/'])

  }


  // checkLocalStorage(): void {
  //   if (localStorage.getItem('token')) {
  //     console.log('Token exists:', localStorage.getItem('token'));
  //     // Token exists, perform necessary actions
  //   } else {
  //     console.log('Token does not exist');
  //     this.tokenNotFound.emit();
  //     // Token doesn't exist, execute your function here
  //     //window.location.reload();
  //     //clearInterval(this.intervalId);
  //   }
  // }

  GetRoles():Observable<any> {
    return this.http.get(`${this.baseURL}/GetRoles`);
  }

}
