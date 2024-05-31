import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, concatMap, of, tap, throwError, timer } from 'rxjs';
import { AccountService } from 'src/app/Services/AccountService';
import Swal from 'sweetalert2';
import { OrderActions } from '../../Model/order-actions';
import { ProductWithApiService } from 'src/app/Services/product-with-api.service';
import { IProduct } from '../../Model/iproduct';
import { CountAction } from '../../Model/iCountAction';
import { Notification } from '../../Model/inotification';
import { ShoppingbasketService } from 'src/app/Services/shoppingbasket.service';
import { CheckoutorderService } from 'src/app/Services/checkoutorder.service';
import { iOrderItems } from '../../Model/iOrderItems';

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
  notifications: Notification[] = [];
  countActionsForbin: OrderActions[] = [];
  allproductfromlocalstorage:IProduct[] = [];
  shouldHideDiv: boolean = false;
  showNotification: boolean = false;
  wishlistItems: CountAction[] = [];
  products: IProduct[] = [];
  createdProductUrl: string | null = null;
  loading = true; // Flag to track loading status
  error: string | null = null;
  productCounts: number[] = [];
  WishListproductCounts: number[] = [];
  WishListproductIndecies: number[] = [];
  ProductsIds:number[]=[]
  countActions: CountAction[] = [];
  bin:string="";

  isLoading = false;
  loadingTitle = '';
  MyOrders=false;

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
              ,private fb:FormBuilder,private accountservcieProduct:ProductWithApiService
              ,private prodserviceapi: ProductWithApiService,private render:Renderer2
              ,private shopingbin:ShoppingbasketService,private CheckOutOrderserv:CheckoutorderService){
                
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


    this.GetLastOrderByUser()
    this.getAllOrderForCurrentlyUser()
    this.shoppingbasket()
    //this.functionforUpdateItemsCount()
    this.shopingbin.currentBin.subscribe(bin => this.bin = bin);
   ///The next code will be in the oninit for the NavBar component ..........
   // i will use it instead of making another request , and use allproductfromlocalstorage:IProduct instead of products
   

  ///////////////////////////////////////////////////////////////////////////////////////
  const storedWishListIndecies = localStorage.getItem('WishListproductIndeciesStorage');
    if (storedWishListIndecies){
      this.productCounts=JSON.parse(storedWishListIndecies)
      this.WishListproductIndecies=JSON.parse(storedWishListIndecies)
      console.log("WishListproductCounts are /is ",this.WishListproductCounts)
    }
    else{
      this.WishListproductIndecies=[]
    }
    console.log("Indecies from navbarrrrrrrrrrrrrrrrrrr::::::::::::::::::::::::::::::: ",this.WishListproductIndecies)
    console.log("From nav bar wishlist count ::::::::::::",this.WishListproductCounts)


    //this.loadProducts();
       ///The next code will be in the oninit for the NavBar component ..........
   // i will use it instead of making another request , and use allproductfromlocalstorage:IProduct instead of products
   const allProducts=localStorage.getItem('allProducts');
    
   console.log("Is the reference  :::  ",allProducts?.length)
   if(allProducts){
     this.allproductfromlocalstorage=JSON.parse(allProducts)
   }
   console.log("The length of all products from local storage ::: ",this.allproductfromlocalstorage.length)
   console.log("All Products from local Storage :::::::",this.allproductfromlocalstorage)
   const storedProductCounts = localStorage.getItem('ProductscountItems');
   if (storedProductCounts){
     this.productCounts=JSON.parse(storedProductCounts)
     this.WishListproductCounts=JSON.parse(storedProductCounts).filter((i:any)=>i!=0)
     console.log("WishListproductCounts are /is ",this.WishListproductCounts)
   }else{

     this.productCounts = new Array(this.allproductfromlocalstorage.length).fill(0);
     console.log("Product Counts after make local storage for all products ::::::::: ",this.productCounts )
     this.WishListproductCounts=[]
   }

   this.ProductsIds=this.allproductfromlocalstorage.map(product => product.id);
   console.log("Products Ids from loading products: ",this.ProductsIds)
   console.log("Products Counts from loadingProducts: ",this.productCounts)


    this.loadCountActions();





    // let CountPin;
    // this.accountservcieProduct.forUpdateItemsCountService().subscribe((res)=>{
    //   this.assignForHtml(res)
    //   CountPin=res
    //   //this.bin=res.toString()
    //   //alert(CountPin)
    // })
    // console.log("From NavBar The Number of items in Order bin ::::::::::   ",CountPin)
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




  // loadProducts() {

  //   this.loading =true;///
  //   this.prodserviceapi.getAll().subscribe({
  //     next: (data: IProduct[]) => {
  //       this.products = data;
        
  //       localStorage.setItem('allProducts', JSON.stringify(this.products));
        

  //       const storedProductCounts = localStorage.getItem('ProductscountItems');
  //       if (storedProductCounts){
  //         this.productCounts=JSON.parse(storedProductCounts)
  //         this.WishListproductCounts=JSON.parse(storedProductCounts).filter((i:any)=>i!=0)
  //         console.log("WishListproductCounts are /is ",this.WishListproductCounts)
  //       }else{

  //         this.productCounts = new Array(this.products.length).fill(0);
  //         this.WishListproductCounts=[]
  //       }

  //       this.ProductsIds=this.products.map(product => product.id);
  //       console.log("Products Ids from loading products: ",this.ProductsIds)
  //       console.log("Products Counts from loadingProducts: ",this.productCounts)
  //     },
  //     error: (err) => {
  //       console.log('Error:', err);
  //       this.error = err; // Set the error message
  //     }
  //   });
  // }
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


////////////////////////////////////// Start Login ///////////////////
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
            alert(ob_user.roleName)
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
  
////////////////////////////////////// End Login ///////////////////



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
  


//////////////////////////// Start Register //////////////////////////////
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
//////////////////////////// End Register //////////////////////////////



///////////////////////// Start:::::::;; For Roles ////////////////////
  GetRoles(){
  
    this.accountservcie.GetRoles().subscribe((res)=>{
      this.Roles=res;
      console.log("Roles are  :::::::: ",res)
    })

   }

   

   AddRole(){


   }
/////////////////////////////////End For Roles ///////////////////////


///////////////////// Start For Notification and Wishlist And Increasing & Decreasing for items to bin ////////


changeValue(index: number, delta: number, id: number) {
  debugger

  console.log("From Nav Bar Counts of items paymented are  :::::  ",this.productCounts)
  const productcountsnavbar=localStorage.getItem('ProductscountItems');
  if(productcountsnavbar)
    {
      console.log("From Nav Bar Counts of items paymented From Local Storage are  :::::  ",JSON.parse(productcountsnavbar))
      this.productCounts=JSON.parse(productcountsnavbar)
    }

  const newCount = this.productCounts[index] + delta;


  const allProducts=localStorage.getItem('allProducts');
    
  console.log("Is the reference  :::  ",allProducts?.length)
  if(allProducts){
    this.allproductfromlocalstorage=JSON.parse(allProducts)
  }



  const productQty = this.allproductfromlocalstorage[index].qty;
  // const productId = this.ProductsIds[index];
  const productId = id;

  const ProductName = this.allproductfromlocalstorage[index].productName;
  let ImageName=this.allproductfromlocalstorage[index].imageName;
  let price=this.allproductfromlocalstorage[index].price;
  let Product_Name=""
  this.allproductfromlocalstorage.forEach(element => {
    if(element.id==id){
      Product_Name=element.productName
    }

  });


  const countActionsStr1 = localStorage.getItem('countActions');
  if (countActionsStr1) {
    this.countActions = JSON.parse(countActionsStr1);

  }
  const existingActionIndex = this.countActions.findIndex(action => action.productId === id);

  // Validate newCount within the range
  if (newCount < 0 || newCount > productQty) {
    const message = newCount < 0
      ? 'The product is already removed from wishlist.'
      : `You cannot add more than ${productQty} items for ${ProductName}.`;
    const type = newCount < 0 ? 'warning' : 'danger';
    this.addNotification(type, type === 'warning' ? 'Warning!' : 'Oops...', message);
    return;
  }

  // Update the productCounts array
  this.productCounts[index] = newCount;

  if (existingActionIndex !== -1) 
  {
    if (newCount === 0) {
      // Remove the action if the new count is zero
      this.countActions.splice(existingActionIndex, 1);
      for(let i=0;i<this.WishListproductIndecies.length;i++){
        if(this.WishListproductIndecies[i]==index)
          {
            this.WishListproductIndecies.splice(i,1)
            
            //this.shouldHideDiv=true;
            //window.location.reload()

            /////this.showWishlist()///
            
          }
      }
      //this.WishListproductIndecies
      
      this.addNotification('warning', 'Warning!', `The product ${ProductName} is already removed from wishlist and count updated to ${newCount}.`);
    } else {
      // Update the existing action
      //this.countActions[existingActionIndex].count = newCount;

     //this code instead of above.......
      this.countActions.forEach(element => {
        if(element.productId==id){
          element.count=newCount
        }
  
      });



      const message = delta === -1
        ? `The product ${ProductName} is already removed from wishlist and count updated to ${newCount}.`
        : `${ProductName} count updated to ${newCount}.`;
      const type = delta === -1 ? 'warning' : 'success';
      this.addNotification(type, type === 'warning' ? 'Warning!' : 'Success!', message);
    }
  } 
  else if (newCount > 0) {
    // Add a new action
    const countAction: CountAction = { productId, count: newCount, productName: ProductName,inedxOfItem:index,imageName:ImageName!.toString(),price:price};
    this.countActions.push(countAction);

    //WishListproductIndecies=
    this.addNotification('success', 'Success!', `${ProductName} count added to ${newCount}. to wishlist`);
  }

  // Save updates to localStorage and any other necessary persistence
  localStorage.setItem('ProductscountItems', JSON.stringify(this.productCounts));
  // const storedProductCounts = localStorage.getItem('ProductscountItems');
  // if (storedProductCounts){
  //   this.productCounts=JSON.parse(storedProductCounts)
  //   //this.WishListproductCounts=JSON.parse(storedProductCounts).filter((i:any) => i != 0)
  //   console.log("WishListproductCounts after each add or minus are /is ............. ",this.WishListproductCounts)
  // }
  this.saveCountActions();
  
  if(newCount==0){
    if(this.showNotification==true){
      
      this.showWishlist()
    }
  }
  
 //const arr_count_action=this.CheckForActionCount()
 console.log("arr_count_action :::")
  const countActionsStr = localStorage.getItem('countActions');
  if (countActionsStr !== null && !this.isEmptyArray(countActionsStr)) {
    const countActionsStr = localStorage.getItem('countActions'); // Example of how it might be set
    const arrofActions = JSON.parse(countActionsStr as string);
    //const arrofActions=JSON.parse(countActionsStr)
     for(let i=0;i<arrofActions.length;i++){
      this.WishListproductIndecies[i]=arrofActions[i].inedxOfItem
      this.WishListproductCounts[i]=arrofActions[i].count
     }
    //  localStorage.getItem('countActions',this.WishListproductIndecies)
    localStorage.setItem('WishListproductIndeciesStorage', JSON.stringify(this.WishListproductIndecies));
    //Call This forUpdateItemsCountService from Services ...
    this.prodserviceapi.forUpdateItemsCountService()
    //this.WishListproductIndecies= JSON.parse(countActionsStr).inedxOfItem;
    console.log("Indecies of WishListproductIndecies :::::::::::::::: ",this.WishListproductIndecies)
    console.log("WishListproductCounts after each add or minus are /is ............. ",this.WishListproductCounts)
    let bin=0
    this.shopingbin.getBin().subscribe(currentBinValue =>{

      bin=parseFloat(currentBinValue)
      bin=bin+delta
      alert("this bin after deleete from wishlist after each add or minus are /is   ::::      "+currentBinValue)
    })
    localStorage.setItem('bin',bin.toString())
    this.shopingbin.updateBin(bin.toString());

  }
  if(countActionsStr=== null || this.isEmptyArray(countActionsStr)){
    
    this.WishListproductCounts=[]
    this.WishListproductIndecies=[]
    localStorage.setItem('WishListproductIndeciesStorage', JSON.stringify(this.WishListproductIndecies));
    //this.hideWishlist()
    this.showWishlist()
    // total_items_Class
    this.updateTotalItemsClassText(0)
    this.shouldHideDiv=true
    
    
  }
  console.log("Products Ids after adding or minus products: ", this.ProductsIds);
  console.log("Products Counts after adding or minus loadingProducts: ", this.productCounts);
}


saveCountActions() {
  localStorage.setItem('countActions', JSON.stringify(this.countActions));
  this.shouldHideDiv=false
  this.shoppingbasket()
  //this.functionforUpdateItemsCount()
}

loadCountActions() {
  const countActionsStr = localStorage.getItem('countActions');
  if (countActionsStr) {
    this.countActions = JSON.parse(countActionsStr);
    // Apply count actions to update counts
    this.countActions.forEach(action => {
      const index = this.ProductsIds.indexOf(action.productId);
      if (index !== -1) {
        this.productCounts[index] = action.count;
      }
    });
  }
}


//////////////////////// For Notifications //////////////
addNotification(type: 'success' | 'warning' | 'danger', title: string, body: string) {
  
  const notification: Notification = { type, title, body, hidden: false };
  this.notifications.push(notification);
  setTimeout(() => this.hideNotification(notification), 3000);
}

hideNotification(notification: Notification) {
  notification.hidden = true;
  setTimeout(() => {
    this.notifications = this.notifications.filter(n => n !== notification);
  }, 500);
}

closeNotification(notification: Notification) {
  this.hideNotification(notification);
}



updateTotalItemsClassText(newNumber: number) {
  const totalItemsClassElement = this.elementRef.nativeElement.querySelector('.total_items_Class');
  const totalItemsClassElement2 = this.elementRef.nativeElement.querySelector('.total_items_Class2');

  if (totalItemsClassElement && totalItemsClassElement2) {
    
    this.render.setProperty(totalItemsClassElement, 'textContent', `${newNumber.toString()} item`);
    this.render.setProperty(totalItemsClassElement2, 'textContent', `${newNumber.toString()} item`);
  }

}


////////////////////////////////////
/////////WishList///////////
////////////////////////////////////
showWishlist(): void {
  this.SetCountsOfItemsInWishList()
  // Retrieve countActions from local storage
  const countActionsJSON = localStorage.getItem('countActions');
  if (countActionsJSON) {
    const countActions: CountAction[] = JSON.parse(countActionsJSON);
    
    // Check if countActions is not empty
    if (countActions.length > 0) {
      // Show the wishlist notification
      this.showNotification = true;
      this.wishlistItems = countActions;
    } else {
      // Optionally, handle case when countActions is empty
    }
  }
}

hideWishlist(): void {
  this.showNotification = false;
}



isEmptyArray(str: string): boolean {
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) && parsed.length === 0;
  } catch (e) {
    // If JSON parsing fails, it's not a valid array
    return false;
  }
}








removeItemFromWishList(id: number,actualIndexInPage:number) {
  debugger
  const countActionsJSONforremove = localStorage.getItem('countActions');
  let countactionforremovefromlist:CountAction[]
  if(countActionsJSONforremove){

    countactionforremovefromlist= JSON.parse(countActionsJSONforremove);
    const index =countactionforremovefromlist.findIndex((i) => i.productId === id);
    let countOfRemovedItem=0 
    let bin1 = localStorage.getItem('bin') ?? ''; 
    let bin=0 //= parseFloat(bin1) || 0;
    if (index > -1) {
      countactionforremovefromlist.forEach((element)=>{
        if(element.productId===id)
        {
          countOfRemovedItem=element.count
        }
      })
      countactionforremovefromlist.splice(index, 1);
      this.shopingbin.getBin().subscribe(currentBinValue =>{

        bin=parseFloat(currentBinValue)
        alert("this bin after deleete from wishlist   ::::      "+currentBinValue)
      })
      
      
      bin=bin-countOfRemovedItem
      this.shopingbin.updateBin(bin.toString());
      this.prodserviceapi.forUpdateItemsCountService()
      const storedProductCounts = localStorage.getItem('ProductscountItems');
      if (storedProductCounts){

        this.productCounts=JSON.parse(storedProductCounts)
      }
      this.productCounts[actualIndexInPage] = 0;
      //this.loadCountActions()
      localStorage.setItem('ProductscountItems', JSON.stringify(this.productCounts));

      localStorage.setItem('bin',bin.toString())
      localStorage.setItem('countActions',JSON.stringify(countactionforremovefromlist));
      if(countactionforremovefromlist.length==0){
        //this.shouldHideDiv=true
        this.hideWishlist()
        window.location.reload()
      }


      //this.calculateTotalPrice();
      this.showWishlist()
    }

  }
}


// removeItemFromWishList(id: number) {
//   debugger;
//   const countActionsJSONforremove = localStorage.getItem('countActions');
//   let countactionforremovefromlist: CountAction[];

//   if (countActionsJSONforremove) {
//     countactionforremovefromlist = JSON.parse(countActionsJSONforremove);
//     const index = countactionforremovefromlist.findIndex((i) => i.productId === id);
//     let countOfRemovedItem = 0;

//     if (index > -1) {
//       countOfRemovedItem = countactionforremovefromlist[index].count;
//       countactionforremovefromlist.splice(index, 1);

//       // Get the current bin value asynchronously
//       this.shopingbin.getBin().subscribe(currentBinValue => {
//         const newBinValue = parseInt(currentBinValue) - countOfRemovedItem;
        
//         // Update the bin value using the service
//         this.shopingbin.updateBin(newBinValue.toString());

//         // Update the localStorage
//         localStorage.setItem('countActions', JSON.stringify(countactionforremovefromlist));

//         // Show or hide the wishlist based on the count of items
//         if (countactionforremovefromlist.length == 0) {
//           this.hideWishlist();
//         } else {
//           this.showWishlist();
//         }

//         // Call the service to update items count
//         this.prodserviceapi.forUpdateItemsCountService();
//       });
//     }
//   }
// }







/////////////////////End For Notification and Wishlist And Increasing & Decreasing for items to bin ////////



  //  functionforUpdateItemsCount(){
    
  //   console.log("from Nav Bar I Want Update The coun of Items..........");
  //   const ProductsCounter = this.elementRef.nativeElement.querySelector("#ProductsCounter") as HTMLElement;
  //   //let vvvalue=882219
  //   let obactions=localStorage.getItem("countActions");
  //   let ob_actions=obactions?JSON.parse(obactions):null;
  //   console.log("From Nav Component............: ob_actions :::::::: ",ob_actions)
  //     let allItems=0
  //     const countActionsForbinStr = localStorage.getItem('countActions');
  //         if (countActionsForbinStr) {
  //           this.countActionsForbin = JSON.parse(countActionsForbinStr);
  //           // Apply count actions to update counts
  //           this.countActionsForbin.forEach(action => {

  //             // const index = this.ProductsIds.indexOf(action.productId);
  //             // if (index !== -1) {
  //             //   this.productCounts[index] = action.count;
  //             // }
  //               allItems+=action.count

  //           });


  //           console.log("From NavBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaarr :::::: AAAAAAAAAAAAAAAAAAAAAliiiiiiiiii ",this.countActionsForbin)
  //           ProductsCounter.innerText=allItems.toString()
  //           this.bin=allItems.toString()
  //           console.log("Count of items purshes ::::::::::::::::::::: From NavBarrrrr :::::::: AAAAAAAAAAAAAAAAAAAAAliiiiiiiiii   ",allItems.toString())
  //         }

    
  //  }

   shoppingbasket(){
            
    let allItems=0
    const countActionsForbinStr = localStorage.getItem('countActions');
        if (countActionsForbinStr) {
          this.countActionsForbin = JSON.parse(countActionsForbinStr);
          // Apply count actions to update counts
          this.countActionsForbin.forEach(action => {

            // const index = this.ProductsIds.indexOf(action.productId);
            // if (index !== -1) {
            //   this.productCounts[index] = action.count;
            // }
              allItems+=action.count

          });


          //console.log("From NavBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaarr :::::: AAAAAAAAAAAAAAAAAAAAAliiiiiiiiii ",this.countActionsForbin)
          //ProductsCounter.innerText=allItems.toString()
          this.bin=allItems.toString()
          // this.prodserviceapi.forUpdateItemsCountService()
          //this.shopingbin.currentBin.subscribe(bin => this.bin = allItems.toString());
          // alert(allItems.toString()) 
          //console.log("Count of items purshes ::::::::::::::::::::: From NavBarrrrr :::::::: AAAAAAAAAAAAAAAAAAAAAliiiiiiiiii   ",allItems.toString())
        }
   }


   assignForHtml(num:number){
    const ProductsCounter = this.elementRef.nativeElement.querySelector("#ProductsCounter") as HTMLElement;
    ProductsCounter.innerText=num.toString()
    console.log("From Nav Baaaaaaaaaaaaaaaaaaaaaaaaaaaaar  Count of items purshes :::::::::::::::::::::  ",num.toString())
   }



   SetCountsOfItemsInWishList(){


    const countActionsStr = localStorage.getItem('countActions');
    if (countActionsStr !== null && !this.isEmptyArray(countActionsStr)) {
      const countActionsStr = localStorage.getItem('countActions'); // Example of how it might be set
      const arrofActions = JSON.parse(countActionsStr as string);
      //const arrofActions=JSON.parse(countActionsStr)
       for(let i=0;i<arrofActions.length;i++){
        this.WishListproductIndecies[i]=arrofActions[i].inedxOfItem
        this.WishListproductCounts[i]=arrofActions[i].count
       }

       console.log("WishListFromLocalStorage At beggining of the press to show list :::",this.WishListproductCounts)

   }

  }


  CheckForActionCount():CountAction{
    const countActionsStr = localStorage.getItem('countActions');
    let arrofActions;
    if (countActionsStr !== null && !this.isEmptyArray(countActionsStr))
     {
      const countActionsStr = localStorage.getItem('countActions'); // Example of how it might be set
      arrofActions = JSON.parse(countActionsStr as string);
      
    }
    return arrofActions;
  }



    // Method to start loading with a specific title
    startLoading(title: string) {
      this.isLoading = true;
      this.loadingTitle = title;
    }
  
    // Method to stop loading
    stopLoading() {
      this.isLoading = false;
      this.loadingTitle = '';
    }


    
    orderItem: iOrderItems = {
      id: 0,
      userId: '',
      username: '',
      orderItems: [
        {
          id: 0,
          productId: 0 ,
          productName: '',
          price: 0,
          count: 0,
          // categoryid: 0,
          imageName: '',
          OrderId:0

        }
      ]
    };


    Save_order(){
      
      //after make an order you must make clear for cach or local storage Except token.....
      const usertoken=localStorage.getItem("token");
      if(usertoken){
        const userOb=localStorage.getItem("user")
        const User = JSON.parse(userOb ?? '[]');
        this.orderItem.userId=User.userId;
        this.orderItem.username=User.fullName
        const countActionsStr1 = localStorage.getItem('countActions');
        if (countActionsStr1) {
          this.orderItem.orderItems = JSON.parse(countActionsStr1);
        }
        console.log("Order items is ::: this.orderItem.orderItems :::",this.orderItem.orderItems)
        console.log("Order items is ::: this.orderItem.userId ::: ",this.orderItem.userId)
        console.log("Order items is ::: this.orderItem.orderItems :::",this.orderItem)
        /////////Go To Service
        this.startLoading("Saving Data")
        this.CheckOutOrderserv.SaveOrderItems(this.orderItem).subscribe({
          next: (response) => {
            this.hideWishlist()
            this.stopLoading()
            console.log("User registration successful");
           
            //localStorage.setItem('countActions',[])
            localStorage.removeItem('countActions')
            localStorage.removeItem('ProductscountItems') 
            localStorage.removeItem('WishListproductIndeciesStorage')
            localStorage.removeItem('bin')
            
            // Listen for click event on the close button and remove the "show" class
            //formCloseBtn.click();
            
            Swal.fire({
              title: 'Success!',
              text: `${response.message}`,
              icon: 'success',
              showConfirmButton: false // Hide the confirm button
            });
            // Automatically close the SweetAlert after 2 seconds
            timer(5000).subscribe(() => Swal.close());
            window.location.reload()
          },
          error: (err) => {
            console.log('Error:', err);
            // Handle the error as needed
            this.stopLoading()
            Swal.fire({
              title: 'Success!',
              text: `${err.message}`,
              icon: 'success',
              showConfirmButton: false // Hide the confirm button
            });
            // Automatically close the SweetAlert after 2 seconds
            timer(2000).subscribe(() => Swal.close());

          }
        });
      }else{
        this.hideWishlist()
        Swal.fire({
          title: 'error!',
          text: 'You Must Login First...',
          icon: 'error',
          showConfirmButton: false // Hide the confirm button
        });
      }
      
    }



    getAllOrderForCurrentlyUser(){
      const usertoken=localStorage.getItem("token");
      if(usertoken){
        const userOb=localStorage.getItem("user")
        const User = JSON.parse(userOb ?? '[]');
        //this.orderItem.userId=User.userId;
        console.log("User ID ::::::::",User.userId)
        this.CheckOutOrderserv.getAllOrderByUserID(User.userId).subscribe((res)=>{
          if(res){
            this.MyOrders=true
          }
          console.log("AllOrders For this User Is :::" ,res)
        })
      }
    }

    GetLastOrderByUser(){

      const usertoken=localStorage.getItem("token");
      if(usertoken){
        const userOb=localStorage.getItem("user")
        const User = JSON.parse(userOb ?? '[]');
        //this.orderItem.userId=User.userId;
        console.log("User ID ::::::::",User.userId)
        this.CheckOutOrderserv.lastOrderForCurrenUser(User.userId).subscribe((res)=>{
          if(res){
            this.MyOrders=true
          }
          console.log("Last Order  For this User Is :::" ,res)
        })
      }

    }


}
