//import { throwError } from 'rxjs';
// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { IProduct } from '../Component/Model/iproduct';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class ProductWithApiService {
//   //to connect to any api url ....
//   baseURL:string="https://localhost:7269/api/Product";
//   //https://localhost:7269/api/Product/GetAll"  on my dot net Project ..
//   //port for launch setting in DotNetProject :: 44333
//   // :7269
//   //g="http://localhost:4003/products";   on my server json 
//   //make inject in constructor to use HttpClient
//   constructor(private http:HttpClient) { }

//   //http return observeable ....
//   //we must use observeable to execute the next functions for CRUD
//   //observable contains three functions 
//   //next()
//   //error()
//   //complete()
//   //to user observable or execute the code inside three functions belonge the observable we must make subscribe   
//   /*
//   subscribe({
//     next()=>{},
//     error()=>{},
//     complete()=>{}
//   })
  
//   we must make destroy for the subscribe untile execute the complete() function
//   we make unsubscribe inside it to execute the complete() function ...
//   by ngOnDestroy()

//   ngOnDestroy(){
//     unsubscribe()
//   }
//   */

//   getAll():Observable<IProduct[]>{
    
//     return this.http.get<IProduct[]>(`${this.baseURL}/GetAll`)
    
//   }

//   getById(id:number){

//     return this.http.get(`${this.baseURL}/Details/${id}`)
//   }

//   add(prod:IProduct){

//    return this.http.post(`${this.baseURL}/Post`,prod)
//   }

//   edit(id:number,prod:IProduct){
   
//       return this.http.put(`${this.baseURL}/Put/${id}`,prod)

//   }

//   delete(id:number){
    
//    return this.http.delete(`${this.baseURL}/Delete/${id}`)

   
//   }



// }

import { HttpClient, HttpResponse ,HttpErrorResponse,HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,throwError,of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { IProduct } from '../Component/Model/iproduct';
import Swal from 'sweetalert2';
import { ICategory } from '../Component/Model/icategory';
import { IProduct_Category } from '../Component/Model/iproductWithCategory';
import { IproductViewModelWithCategory } from '../Component/Model/iproductViewModel';
import { OrderActions } from '../Component/Model/order-actions';

@Injectable({
  providedIn: 'root'
})
export class ProductWithApiService {
  countActions: OrderActions[] = [];
  private baseURL = 'https://localhost:7269/api/Product'; // Set your base URL

  Errors: { errorMessage: string; errorCode: number; errorStatusText:string;url:string;name:string} = { errorMessage: '', errorCode: 0,errorStatusText:'',url:'',name:'' };

  constructor(private http: HttpClient) { }

  // getAll(): Observable<IProduct[]> {
  //   return this.http.get<IProduct[]>(`${this.baseURL}/GetAll`).pipe(
  //     catchError(this.handleError)
  //   );
  // }
  getAll(): Observable<IProduct[]>{
    // let token=localStorage.getItem('token')
    // let head_obj=new HttpHeaders().set("Authorization","Bearer "+token) //,{headers:head_obj}
    return this.http.get<IProduct[]>(`${this.baseURL}/GetAll`).pipe(
      catchError(error => {
        let errorMessage = 'An error occurred while fetching products.';
        if (error && error.error && error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Server-side error
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        // return throwError(errorMessage);
        return throwError(() => errorMessage);
        
      })
    );
  }



  getById(id: number): Observable<any> {
    return this.http.get(`${this.baseURL}/Details/${id}`).pipe(
      tap((response: any) => {
        console.log('GetById request successful');
        console.log('Response body:', response); // Log the response body
        // Handle success message if needed
      }),
      catchError(this.handleError)
    );
  }


  getAllCategories(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>(`${this.baseURL}/GetAllCategories`).pipe(
      catchError(error => {
        let errorMessage = 'An error occurred while fetching products.';
        if (error && error.error && error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Server-side error
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        // return throwError(errorMessage);
        return throwError(() => errorMessage);
        
      })
    );
  }



  getAllProduct_Category(): Observable<IproductViewModelWithCategory[]> {
    return this.http.get<IproductViewModelWithCategory[]>(`${this.baseURL}/GetProductsWithCategory`).pipe(
      catchError(error => {
        let errorMessage = 'An error occurred while fetching products.';
        if (error && error.error && error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error hhhshdhss: ${error.error.message}`;
          console.log(errorMessage)
        } else {
          // Server-side error
          //errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
          errorMessage = `${error.status}`;
          this.Errors.errorMessage=error.message
          this.Errors.errorCode=error.status
          this.Errors.errorStatusText=error.statusText
          this.Errors.url=error.url
          this.Errors.name=error.name
          
          console.log("Aliiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii ::::::::::::",error.statusText)
          console.log("our Object Errors...........")
          console.log(this.Errors)

        }
        // return throwError(errorMessage);
        return throwError(() => this.Errors);
        
      })
    );
  }



  // add(prod: IProduct_Category): Observable<any> {
  //   return this.http.post<any>(`${this.baseURL}/Post`, prod, { observe: 'response' }).pipe(
  //     tap((response: HttpResponse<any>) => {
  //       console.log('Add request successful with status code:', response.status);
  //       console.log('Response body:', response.body); // Log the response body
  //       Swal.fire({
  //         title: 'Success!',
  //         text: response.body.message,
  //         icon: 'success'
  //       });
  //     }),
  //     catchError(this.handleError)
  //   );
  // }


  postfile(filupload:File){

    const formdata=new FormData()
    formdata.append('file',filupload);
    const headers=new HttpHeaders().append('Content-Disposition','multiple/form-data'); //,{headers}
    return this.http.post(`${this.baseURL}/UploadImage2`,formdata);
  }


  add(prod: IProduct): Observable<any> {
    const formData = new FormData();
    formData.append('productName', prod.productName);
    formData.append('price', prod.price.toString());
    formData.append('qty', prod.qty.toString());
    formData.append('categoryId', prod.categoryid.toString());
    formData.append('imagefile', prod.imagefile??"");
    console.log("from the final station....");
    console.log("file:::")
    console.log(prod.imagefile);
    console.log("Name:::")
    console.log(prod.productName);

  return this.http.post<any>(`${this.baseURL}/Post`, formData, { observe: 'response' }).pipe(
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
      console.error('Add request failed:', error);
      let errorMessage = 'An error occurred while adding the product.';

      if (error && error.error && error.error.errors) {
        // Extract and format validation errors from the error response
        errorMessage = '';
        Object.keys(error.error.errors).forEach(field => {
          const fieldErrors = error.error.errors[field].join('\n');
          errorMessage += `${field}: ${fieldErrors}\n`+' \n';
        });
      } else if (error && error.error && error.error.message) {
        errorMessage = error.error.message;
      }

      // Display error message to the user using SweetAlert
      Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error'
      });

      return throwError(() => errorMessage);
    })

  );
}

  edit(id: number, prod: IProduct): Observable<any> {
    const formData = new FormData();
    formData.append('productName', prod.productName);
    formData.append('price', prod.price.toString());
    formData.append('qty', prod.qty.toString());
    formData.append('categoryId', prod.categoryid.toString());
    formData.append('imagefile', prod.imagefile??"");
    return this.http.put<any>(`${this.baseURL}/Put/${id}`, formData, { observe: 'response' }).pipe(
      tap((response: HttpResponse<any>) => {
        console.log('Edit request successful with status code:', response.status);
        console.log('Response body:', response.body); // Log the response body
        Swal.fire({
          title: 'Success!',
          text: response.body.message,
          icon: 'success'
        });
      }),

      
      //catchError(this.handleError)

      catchError((error: HttpErrorResponse) => {
        console.error('Add request failed:', error);
        let errorMessage = 'An error occurred while Editing the product.';
  
        if (error && error.error && error.error.errors) {
          // Extract and format validation errors from the error response
          errorMessage = '';
          Object.keys(error.error.errors).forEach(field => {
            const fieldErrors = error.error.errors[field].join('\n');
            errorMessage += `${field}: ${fieldErrors}\n`+' \n';
          });
        } else if (error && error.error && error.error.message) {
          errorMessage = error.error.message;
        }
  
        // Display error message to the user using SweetAlert
        Swal.fire({
          title: 'Error!',
          text: errorMessage,
          icon: 'error'
        });
  
        return throwError(() => errorMessage);
      })




    );
  }
  
  uploadImage(image: File): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('image', image, image.name);
    return this.http.post<string>(`${this.baseURL}/UploadImage/`, formData);
  }

  // delete(id: number): Observable<any> {
  //   return this.http.delete(`${this.baseURL}/Delete/${id}`).pipe(
  //     tap(() => {
  //       console.log('Delete request successful');
  //       // You can handle success message here if needed
  //     }),
  //     catchError((error: HttpErrorResponse) => {
  //       console.error('An error occurred:', error);
  //       let errorMessage = 'Failed to delete product.';
  //       if (error && error.status === 404) {
  //         errorMessage = 'Product not found.';
  //       }
  //       // Display error message using SweetAlert
  //       Swal.fire({
  //         title: 'Error!',
  //         text: errorMessage,
  //         icon: 'error'
  //       });
  //       //return throwError(errorMessage); // Use throwError from RxJS
  //       return throwError(() => error);
  //     })
  //   );
  // }

  // delete(id: number): Observable<any> {
  //   return this.http.delete(`${this.baseURL}/Delete/${id}`).pipe(
  //     tap(() => {
  //       console.log('Delete request successful');
  //       // You can handle success message here if needed
  //     }),
  //     catchError((error: HttpErrorResponse) => {
  //       console.error('An error occurred:', error);

  //       let errorMessage = 'Failed to delete product.';
  //       if (error && error.status === 404) {
  //         errorMessage = 'Product not found.';
  //       } else if (error && error.statusText === 'Unknown Error') {
  //         errorMessage = 'Failed to connect to the server.';
  //       }

  //       // Display error message using SweetAlert
  //       Swal.fire({
  //         title: 'Error!',
  //         text: errorMessage,
  //         icon: 'error'
  //       });
        
  //       // Return a custom error object without throwing it
  //       return throwError(() => error);
  //     })
  //   );
  // }




  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseURL}/Delete/${id}`, { observe: 'response' }).pipe(
      tap((response: HttpResponse<any>) => {
        console.log('Delete request successful with status code:', response.status);
        console.log('Response body:', response.body); // Log the response body
        console.log("Blllllllllllllllaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.............")
        console.log("Response Object :  ",response.body.prod)
        console.log("Response Message :  ",response.body.message)
        let messageForResponse=response.body.message;
        Swal.fire({
          title: 'Success!',
          text: messageForResponse,
          icon: 'success'
        });
      }),
      
      catchError((error: HttpErrorResponse) => {
        console.error('An error occurred:', error);

        let errorMessage; //= 'Failed to delete product.';
        if (error.status === 404) {
          errorMessage = 'Product not found.';
        } else if (error.status === 0) {
          errorMessage = 'Failed to connect to the server.';
        } else {
          errorMessage = `An error occurred: ${error.statusText}`;
        }

        // Display error message using SweetAlert with status code
        Swal.fire({
          title: 'Error!',
          text: errorMessage,
          icon: 'error'
        });
        
        // Return a custom error object without throwing it
        return throwError(() => error);
      })
    );
  }





  // private handleError(error: HttpErrorResponse): Observable<any> {
  //   let errorMessage = 'An error occurred while processing your request.';
  //   if (error && error.error && error.error instanceof ErrorEvent) {
  //     // Client-side error
  //     errorMessage = `Error: ${error.error.message}`;
  //   } else {
  //     // Server-side error
  //     errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
  //   }
  //   console.error('An error occurred:', error);
  //   // You can display the error message or take any appropriate action here
  //   // For example, display a sweet alert or show an error message
  //   Swal.fire({
  //     title: 'Error!',
  //     text: errorMessage,
  //     icon: 'error'
  //   });
  //   return throwError(errorMessage);
  // }
  private handleError(error: HttpErrorResponse): Observable<any> {
    // Optionally, you can handle different types of errors differently
    let errorMessage = 'An error occurred while processing your request.';
    if (error && error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else if (error && error.status === 0) {
      // Handle network error (e.g., connection refused)
      errorMessage = 'Network error occurred. Please check your internet connection.';
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    // You can handle the error silently here without displaying in the console
    // For example, you can show a generic error message to the user or perform any other action
    // Do not throw the error again, as it will be caught by the catchError operator in the calling function
    // return throwError(errorMessage);
    return throwError(() => errorMessage);
  }




 forUpdateItemsCountService(): Observable<number> {
    let allItems = 0;
  
    // Retrieve the count actions string from localStorage
    const countActionsStr = localStorage.getItem('countActions');
  
    if (countActionsStr) {
      // Parse the string to a JSON object
      const countActions = JSON.parse(countActionsStr);
  
      // Log the parsed object for debugging purposes
      console.log("From Nav Component............:", countActions);
  
      // Iterate over the count actions to update the total count
      countActions.forEach((action:any) => {
        allItems += action.count;
      });
    }
  
    // Return the total count as an observable
    return of(allItems);
  }





}
