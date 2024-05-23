import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { ICategory } from '../Component/Model/icategory';
import { ICategory_AddEdit } from '../Component/Model/icategoryAddEdit';

@Injectable({
  providedIn: 'root'
})
export class CategoryServicesService {

  baseURL="https://localhost:7269/api/Category"
  constructor(private http:HttpClient) { }



  GetAll(): Observable<ICategory[]> {
      return this.http.get<ICategory[]>(`${this.baseURL}/GetAll`).pipe(
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
      return this.http.get(`${this.baseURL}/GetById/${id}`).pipe(
        tap((response: any) => {
          console.log('GetById request successful');
          console.log('Response body:', response); // Log the response body
          // Handle success message if needed
        }),
        catchError(
          error => {
            let errorMessage = 'An error occurred while fetching Categoy.';
            if (error && error.error && error.error instanceof ErrorEvent) {
              // Client-side error
              errorMessage = `Error: ${error.error.message}`;
            } else {
              // Server-side error
              errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
            }
            // return throwError(errorMessage);
            return throwError(() => errorMessage);
            
          }
        )
      );
    }




    add(Cat: ICategory_AddEdit): Observable<any> {
      const formData = new FormData();
      formData.append('categoryName', Cat.categoryName);
      formData.append('products','');
      formData.append('catimageName','');
      formData.append('catimagefile', Cat.catimagefile??"");
      console.log("from the final station...."); //products
      console.log("file:::")
      console.log(Cat.catimagefile);
      console.log("Name:::")
      console.log(Cat.catimagefile);
  
    return this.http.post<any>(`${this.baseURL}/InsertCategory`, formData, { observe: 'response' }).pipe(
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
        let errorMessage = 'An error occurred while adding the Category.';
  
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




  edit(id: number, Cat: ICategory_AddEdit): Observable<any> {
    const formData = new FormData();
    formData.append('id',id.toString());
    formData.append('categoryName', Cat.categoryName);
    formData.append('products','');

    formData.append('catimageName','');
    formData.append('catimagefile', Cat.catimagefile??"");
    console.log("from the final station...."); //products
    console.log("file:::")
    console.log(Cat.catimagefile);
    console.log("Name:::")
    console.log(Cat.catimagefile);
    return this.http.put<any>(`${this.baseURL}/EditCategory/${id}`, formData, { observe: 'response' }).pipe(
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













  
  
  delete(id: number): Observable<any> {
    debugger
    return this.http.delete(`${this.baseURL}/DeleteCategory/${id}`, { observe: 'response' }).pipe(
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
        debugger
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




}
