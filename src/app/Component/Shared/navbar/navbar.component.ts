import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, concatMap, of, tap, throwError, timer } from 'rxjs';
import { AccountService } from 'src/app/Services/AccountService';
import Swal from 'sweetalert2';
import { OrderActions } from '../../Model/order-actions';
import { ProductWithApiService } from 'src/app/Services/product-with-api.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit,AfterViewInit {


  //@ViewChildren('formOpenBtn') ForLogin!: QueryList<ElementRef>;
  @ViewChild('formOpenBtn') formOpenBtn1!: ElementRef;
  @ViewChild('OpenForAdd_User_Or_Admin_ByAdmin') OpenForAdd_User_Or_Admin_ByAdmin!: ElementRef;
  @ViewChild('OpenForAdd_Role_ByAdmin') OpenForAdd_Role_ByAdmin!: ElementRef;
  countActions: OrderActions[] = [];
  Ali:string="Ali Zakaryaa Kamel Thabet....";
  
  private intervalId: any;
  UserName:string=""
  isHomeVisible: boolean = false;

  userlogin:FormGroup=new FormGroup({
    email:new FormControl('',[Validators.required,Validators.email]),
    password:new FormControl('',Validators.required)
  })
  
  

  Roles:any;

  userRegister: FormGroup;
  RoleObj: FormGroup;
  IsAdminNow:string|undefined
  constructor(private accountservcie:AccountService,private router:Router,
              private elementRef: ElementRef,private renderer: Renderer2
              ,private fb:FormBuilder,private accountservcieProduct:ProductWithApiService){
                
    this.RoleObj = this.fb.group({
      id: [''],
      roleName: ['', [Validators.required,Validators.minLength(7),Validators.maxLength(100)]],
    });
    
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


  @Output() openFormEvent = new EventEmitter<void>();

  openForm() {
    this.openFormEvent.emit();
  }


  toggleHome() {
    const homeElement = this.elementRef.nativeElement.querySelector('.home');
    // if (homeElement) {
    //   const displayStyle = window.getComputedStyle(homeElement).display;
    //   if (displayStyle === 'none') {
    //     homeElement.style.display = 'block';
    //   } else {
    //     homeElement.style.display = 'none';
    //   }
    // }
      homeElement.style.display = 'block';
      homeElement.classList.add("show")
    console.log("yahoooooooooooooooooooooooooooooooooooooooooooooooo........................")
  }


  
  ngOnInit(): void {

    let CountPin;
    this.accountservcieProduct.forUpdateItemsCountService().subscribe((res)=>{
      this.assignForHtml(res)
      CountPin=res
    })
    console.log("The Number of items in Order ::::::::::   ",CountPin)
    //this.functionforUpdateItemsCount()
    this.GetRoles()

    const formOpenBtn = this.elementRef.nativeElement.querySelector("#form-open");
    const home = this.elementRef.nativeElement.querySelector(".home");
    const home2 = this.elementRef.nativeElement.querySelector(".home2");
    const formContainer = this.elementRef.nativeElement.querySelector(".form_container");
    const formContainer2 = this.elementRef.nativeElement.querySelector(".form_container2");
    const formCloseBtn = this.elementRef.nativeElement.querySelector(".form_close");
    const formCloseBtn2 = this.elementRef.nativeElement.querySelector(".form_close2");
    const signupBtn = this.elementRef.nativeElement.querySelector("#signup");
    const loginBtn = this.elementRef.nativeElement.querySelector("#login");
    const pwShowHide = document.querySelectorAll(".pw_hide");



  //   formCloseBtn.addEventListener("click", () => home.classList.remove("show"));


    // formOpenBtn.addEventListener("click", () => {
    //   //this.isHomeVisible = !this.isHomeVisible;
    //   home.style.display = 'block';
    //   home.classList.add("show")

    // });

    formCloseBtn.addEventListener("click", () => home.classList.remove("show"));
    signupBtn.addEventListener("click", (e: Event) => {
      e.preventDefault();
      formContainer.classList.add("active");
    });


    formCloseBtn2.addEventListener("click", () => {
      home2.classList.remove("show")
      console.log("Closeeeeeeeeeeeeeeeeeeeeeeeeee Add Rolllleeeeeeeeeeeeeee......")
    });

    loginBtn.addEventListener("click", (e: Event) => {
      e.preventDefault();
      formContainer.classList.remove("active");
    });

    // Execute checkLocalStorage initially
    //check for token in local storage with each 2 seconds ..
    // this.accountservcie.checkLocalStorage();

    // // Set up interval to check localStorage every 2 seconds
    // this.intervalId = setInterval(() => {
    //   this.accountservcie.checkLocalStorage();
    // }, 2000);

    // // Listen for tokenNotFound event
    // this.accountservcie.tokenNotFound.subscribe(() => {
    //   // Stop the interval
    //   clearInterval(this.intervalId);
    //   // Reload the page
    //   window.location.reload();
    // });
   
    if(localStorage.getItem("user")){

      const ob=localStorage.getItem("user");
     const ob_user=ob?JSON.parse(ob):null;
      this.UserName=ob_user.fullName;
      this.IsAdminNow=ob_user.roleName;

    }else{


      console.log("No one Register Now...........")
      this.userRegister.controls['roleName'].setValue("User");
      console.log( this.userRegister.value)
      
    }




  }


  ngAfterViewInit(): void {
    //throw new Error('Method not implemented.');
    // if (this.formOpenBtn1 && this.formOpenBtn1.nativeElement) {
    //   this.formOpenBtn1.nativeElement.addEventListener('click', this.toggleHome.bind(this));
    // }
    // if (this.formOpenBtn1 && this.formOpenBtn1.nativeElement) {
    //   this.renderer.listen(this.formOpenBtn1.nativeElement, 'click', () => this.toggleHome());
    // }


    if (this.formOpenBtn1 && this.formOpenBtn1.nativeElement) {
      this.formOpenBtn1.nativeElement.addEventListener('click', ()=>{
        const homeElement = this.elementRef.nativeElement.querySelector('.home');
        homeElement.style.display = 'block';
        homeElement.classList.add("show")
      });
    }

    
    //To Add user By Admin.............
    //OpenForAdd_Role_ByAdmin



    if (this.OpenForAdd_Role_ByAdmin && this.OpenForAdd_Role_ByAdmin.nativeElement) {

      this.OpenForAdd_Role_ByAdmin.nativeElement.addEventListener("click", () => 
        {
          //const signupBtn = this.elementRef.nativeElement.querySelector("#signup");
          const homeElement = this.elementRef.nativeElement.querySelector('.home2');
          homeElement.style.display = 'block';
          homeElement.classList.add("show")
          //signupBtn.click()
          console.log("Add Roooooooooooooollllllllllleeeeeeeeeeee........")
        }
    );
    }



    if (this.OpenForAdd_User_Or_Admin_ByAdmin && this.OpenForAdd_User_Or_Admin_ByAdmin.nativeElement) {

      this.OpenForAdd_User_Or_Admin_ByAdmin.nativeElement.addEventListener("click", () => 
        {
          const signupBtn = this.elementRef.nativeElement.querySelector("#signup");
          const homeElement = this.elementRef.nativeElement.querySelector('.home');
          homeElement.style.display = 'block';
          homeElement.classList.add("show")
          signupBtn.click()
          console.log("I'm Herrreeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee...........")
        }
    );
    }



  }



  CheckifTokenExists=this.accountservcie.isAuthenticated();
  LogOut(){
     this.accountservcie.logout();
     console.log("LogggggggggggggggggggggggggggggggggggggggggOutttttttttttttttttt....")
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

  get roleNameControl(){
    //console.log(this.RoleObj.get('roleName')?.value)
    return this.RoleObj.get('roleName')
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
          if(ob_user.roleName=="Admin"){
            this.router.navigate(['/dashboard/productDashboard']);
          }else{
            this.router.navigate(['/home/products']);
          }
          
        }),


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

  }






  GetRoles(){
  
    this.accountservcie.GetRoles().subscribe((res)=>{
      this.Roles=res;
      console.log("Roles are  :::::::: ",res)
    })

   }

   

   AddRole(){


   }


   functionforUpdateItemsCount(){

    console.log("from Nav Bar I Want Update The coun of Items..........");
    const ProductsCounter = this.elementRef.nativeElement.querySelector("#ProductsCounter") as HTMLElement;
    //let vvvalue=882219
    let ob=localStorage.getItem("countActions");
    let ob_user=ob?JSON.parse(ob):null;
    console.log("From Nav Component............:",ob_user)
      let allItems=0
      const countActionsStr = localStorage.getItem('countActions');
          if (countActionsStr) {
            this.countActions = JSON.parse(countActionsStr);
            // Apply count actions to update counts
            this.countActions.forEach(action => {

              // const index = this.ProductsIds.indexOf(action.productId);
              // if (index !== -1) {
              //   this.productCounts[index] = action.count;
              // }
                allItems+=action.count

            });


            
            ProductsCounter.innerText=allItems.toString()
          }

    
   }

   assignForHtml(num:number){
    const ProductsCounter = this.elementRef.nativeElement.querySelector("#ProductsCounter") as HTMLElement;
    ProductsCounter.innerText=num.toString()
   }




}
