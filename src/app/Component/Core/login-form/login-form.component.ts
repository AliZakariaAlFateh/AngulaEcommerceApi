import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { catchError, concatMap, delay, of, tap, throwError, timer } from 'rxjs';
import { AccountService } from 'src/app/Services/AccountService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements AfterViewInit,OnInit {
  
  userlogin:FormGroup=new FormGroup({
    email:new FormControl('',[Validators.required,Validators.email]),
    password:new FormControl('',Validators.required)
  })



  Roles:any;

  userRegister: FormGroup;

  constructor(private accountservcie:AccountService,private router:Router,private elementRef: ElementRef,private fb:FormBuilder){


    this.userRegister = this.fb.group({
      id: [0],
      fullName: ['', [Validators.required,Validators.minLength(7),Validators.maxLength(100)]],
      email: ['', [Validators.required,Validators.email,Validators.minLength(10),Validators.maxLength(30)]],
      password: ['', [Validators.required, Validators.minLength(10)]],
      phoneNumber:['', [Validators.required, Validators.minLength(11),Validators.maxLength(11)]],
      imageName:[''] ,
      imagefile: [null] ,// Add image field to the form,
      roleName: ['', [Validators.required, this.customRoleValidator()]]
    });

   
    
  }
  ngOnInit(): void {

    this.GetRoles()
    //throw new Error('Method not implemented.');
  }

  @ViewChildren('pwHideIcon1, pwHideIcon2, pwHideIcon3') pwHideIcons!: QueryList<ElementRef>;
 


  ngAfterViewInit(): void {
    const formOpenBtn = this.elementRef.nativeElement.querySelector("#form-open");
    const home = this.elementRef.nativeElement.querySelector(".home");
    const formContainer = this.elementRef.nativeElement.querySelector(".form_container");
    const formCloseBtn = this.elementRef.nativeElement.querySelector(".form_close");
    const formCloseBtn2 = this.elementRef.nativeElement.querySelector(".form_close2");
    const signupBtn = this.elementRef.nativeElement.querySelector("#signup");
    const loginBtn = this.elementRef.nativeElement.querySelector("#login");

    formOpenBtn.addEventListener("click", () => home.classList.add("show"));
    formCloseBtn.addEventListener("click", () => home.classList.remove("show"));

    // this.pwHideIcons.forEach((icon) => {
    //   icon.nativeElement.addEventListener("click", () => {
    //     const getPwInput = icon.nativeElement.previousElementSibling;
    //     if (getPwInput.getAttribute("type") === "password") {
    //       getPwInput.setAttribute("type", "text");
    //       icon.nativeElement.classList.replace("uil-eye-slash", "uil-eye");
    //     } else {
    //       getPwInput.setAttribute("type", "password");
    //       icon.nativeElement.classList.replace("uil-eye", "uil-eye-slash");
    //     }
    //   });
    // });

   
    


    this.pwHideIcons.forEach((icon) => {
      icon.nativeElement.addEventListener("click", () => {
        let getPwInput = icon.nativeElement.parentElement.querySelector("input");
        if (getPwInput.type === "password") {
          getPwInput.type = "text";
          icon.nativeElement.classList.replace("uil-eye-slash", "uil-eye");
        } else {
          getPwInput.type = "password";
          icon.nativeElement.classList.replace("uil-eye", "uil-eye-slash");
        }
      });
    });

    

    signupBtn.addEventListener("click", (e: Event) => {
      e.preventDefault();
      formContainer.classList.add("active");
    });

    loginBtn.addEventListener("click", (e: Event) => {
      e.preventDefault();
      formContainer.classList.remove("active");
    });
  }



  customRoleValidator() {
    return (control:any) => {
      const value = control.value;
      if (value == 'Select The Role') {
        return { invalidRole: true };
      }
      return null;
    };
  }


  get roleControl(){
    return this.userRegister.get('roleName');
  }


  get emailControl(){
    return this.userlogin.get('email');
  }

  get passwordControl(){
    return this.userlogin.controls['password']
  }


  get emailControlRegister(){
    return this.userRegister.get('email');
  }

  get passwordControlRegister(){
    return this.userRegister.controls['password']
  }
   
  get usernameControlRegister(){
    return this.userRegister.controls['fullName']
  }


  get phoneNumberControlRegister(){
    return this.userRegister.controls['phoneNumber']
  }


  



  LogIn(e:Event){
    e.preventDefault()
    console.log()

    if(this.emailControl?.errors || this.passwordControl.errors || this.userlogin.errors){
      console.log("Error in form ...............")
      
    }else{
      console.log("UserLogin Foramte .....................")
      console.log(this.userlogin.value)
      console.log("UserLogin Foramte .....................")
      console.log(this.emailControl?.value)
      console.log(this.emailControl?.errors)
      console.log(this.emailControl?.touched)
      console.log(this.emailControl?.valid)
      console.log(this.passwordControl.value)
      //this.userlogin.setErrors({invalid:true})
      // this.accountservcie.login('','');


      // this.accountservcie.login(this.userlogin.value).subscribe((res:any)=>{
      //   console.log("Result from Login ",res)
      //   localStorage.setItem("token",res.token)
      //   this.accountservcie.user={}
      //   this.router.navigate(['/dashboard/productDashboard'])
      // })



      this.accountservcie.login(this.userlogin.value)
      .pipe(
        tap((res: any) => {
          console.log("Result from Login ", res);
          console.log(res.tokenn.token)
          localStorage.setItem("token", res.tokenn.token);
          localStorage.setItem('user',JSON.stringify(res.user));
          //let ob = JSON.parse(localStorage.getItem('user')) //give error
          let ob=localStorage.getItem("user");
          let ob_user=ob?JSON.parse(ob):null;
          console.log("Object after parseing:::::::::::::::::::::")
          console.log(ob_user)
          console.log("Email ::::::::::::::::: ",ob_user.email)
          console.log(localStorage.getItem("user"));
          //this.accountservcie.user={}
          let uthorized=localStorage.getItem("token");
          //uthorized?JSON.parse(uthorized):null
          this.accountservcie.user =ob_user;
        }),
        concatMap((res: any) => {
          return of(res).pipe(
            tap(() => {
              Swal.fire({
                title: 'Success!',
                text: 'Login successful!',
                icon: 'success',
                showConfirmButton: false // Hide the confirm button
              });
              // Automatically close the SweetAlert after 2 seconds
              timer(2000).subscribe(() => Swal.close());
            })
          );
        }),
        tap(() => {
          let ob=localStorage.getItem("user");
          let ob_user=ob?JSON.parse(ob):null;
          if(ob_user.roleName=="User"){
             
            this.router.navigate(['/home/products']);
          }else{
            this.router.navigate(['/dashboard/productDashboard']);
          }
          
        }),
      //   catchError(error => {
      //     console.error('Login request failed:', error);
      //     let errorMessage = 'Password or Email invalid....';
      //     if (error && error.error && error.error.message) {
      //       errorMessage = error.error.message;
      //     }
      //     Swal.fire({
      //       title: 'Error!',
      //       text: errorMessage,
      //       icon: 'error'
      //     });
      //     return throwError(() => errorMessage);
      //   })
      // )
      catchError((error: HttpErrorResponse) => {
        console.error('Add request failed:', error);
        let errorMessage = 'An error occurred while Editing the product.';
  
        if (error && error.error && error.error) {
          // Extract and format validation errors from the error response
          errorMessage = '';
          Object.keys(error.error).forEach(field => {
            const fieldErrors = error.error[field].join('\n');
            errorMessage += `${field}: ${fieldErrors}\n`+' \n';
            
          });
          console.log("Error Status:  ",error.status)
          console.log("Error Message:  ",error.message)
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
    )
      .subscribe();

    }
    


  }

  // logout(){
  //   //clear the token from localstorge
  //   localStorage.setItem("token","")
  //   this.accountservcie.user=undefined
  // }



  url:string|null=null

  selectedFile: File | null = null;

  onFileSelectedImage(e:any){


    this.selectedFile = e.target.files[0] ;//as File

    if (this.selectedFile) {
      // Set the display of the image div to "block"
      //this.imageDiv.nativeElement.style.display = 'block';
    } else {
      // Handle no file selected scenario
    }
  
  
  
  
    const file: File = e.target.files[0];
    console.log("from on select Imaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaagggggggggggggggggeeeee")
    this.userRegister.patchValue({ imagefile: file });
   //this.userRegister.controls['imagefile'].setValue(this.selectedFile); //this.selectedFile?.name
    var reader=new FileReader();
    reader.readAsDataURL(file);
    reader.onload=(event:any)=>{
      this.url=event.target.result;
    }
    console.log(this.userRegister.value)


  }
  



  Register() {
    console.log("Inside the Register");
    console.log(this.userRegister.value);
    debugger;
  
    // Get references to the home and close button elements
    const home = this.elementRef.nativeElement.querySelector(".home");
    const formCloseBtn = this.elementRef.nativeElement.querySelector(".form_close");
  
    this.accountservcie.register(this.userRegister.value).subscribe({
      next: (response) => {
        console.log("User registration successful");
        // Listen for click event on the close button and remove the "show" class
        formCloseBtn.click();
      },
      error: (err) => {
        console.log('Error:', err);
        // Handle the error as needed
      }
    });
  
  
      //     this.accountservcie.login(this.userlogin.value).subscribe((res:any)=>{
      //   console.log("Result from Login ",res)
      //   localStorage.setItem("token",res.token)
      //   this.accountservcie.user={}
      //   this.router.navigate(['/dashboard/productDashboard'])
      // })



    
    // this.accountservcie.register(this.userRegister.value)
    //   .pipe(
    //     tap((res: any) => {
    //       // console.log("Result from Login ", res);
    //       // localStorage.setItem("token",res.token);
    //       // this.accountservcie.user = {};
    //     }),
    //     concatMap((res: any) => {
    //       return of(res).pipe(
    //         tap(() => {
    //           Swal.fire({
    //             title: 'Success!',
    //             text: 'Login successful!',
    //             icon: 'success',
    //             showConfirmButton: false // Hide the confirm button
    //           });
    //           // Automatically close the SweetAlert after 2 seconds
    //           //timer(2000).subscribe(() => Swal.close());
    //         })
    //       );
    //     }),
    //     tap(() => {
    //       this.router.navigate(['/dashboard/productDashboard']);
    //     }),
    //     catchError(error => {
    //       console.error('Login request failed:', error);
    //       let errorMessage = 'Whatch your data and type correct data...';
    //       if (error && error.error && error.error.message) {
    //         errorMessage = error.error.message;
    //       }
    //       Swal.fire({
    //         title: 'Error!',
    //         text: errorMessage,
    //         icon: 'error'
    //       });
    //       return throwError(() => errorMessage);
    //     })
    //   )
    //   .subscribe();
    

  }






  GetRoles(){
  
    this.accountservcie.GetRoles().subscribe((res)=>{
      this.Roles=res;
      console.log("Roles are  :::::::: ",res)
    })


  }





























}
