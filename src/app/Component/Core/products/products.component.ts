import { HttpHeaders } from '@angular/common/http';
// import { ProductsService } from './../../../Services/products.service';
// import { Component, OnInit, ViewChild, Input } from '@angular/core';
// import { IProduct } from '../../Model/iproduct';

// @Component({
//   selector: 'app-products',
//   templateUrl: './products.component.html',
//   styleUrls: ['./products.component.css']
// })
// export class ProductsComponent implements OnInit {
//   products:IProduct[]=[];
  
//   //here i 'll inject services at constructor ----> (prodservice)....
//   constructor(private prodservice:ProductsService){

//   }

//   ngOnInit(): void {
//     this.products=this.prodservice.getall();
//   }

//   //then i use the services in onInit

//   Delete(id:number){

//     var res=confirm('Are you sure to delete this item .')
//     if(res)
//     {
//       this.prodservice.delete(id);
//     }
//   }

// }




/////////////////////////////////////// Using Api //////////////////


// import { ProductsService } from '../../../Services/products.service';
// import { Component, OnInit } from '@angular/core';
// import { IProduct } from '../../Model/iproduct';
// import { ProductWithApiService } from 'src/app/Services/product-with-api.service';

// @Component({
//   selector: 'app-products',
//   templateUrl: './products.component.html',
//   styleUrls: ['./products.component.css']
// })
// export class ProductsComponent implements OnInit {
//   products:IProduct[]=[];
  
//   //here i 'll inject services at constructor ----> (prodservice)....
//   constructor(private prodserviceapi:ProductWithApiService){

//   }

//   ngOnInit(): void {
//     // this.products=this.prodservice.getall();
//     //to connect api with service
//     this.prodserviceapi.getAll().subscribe({
//       next:(data) =>{this.products=data;},
//       error:(err) =>{console.log('Error'+err)},
//       complete:() =>{}
//     })
//     console.log(this.products)
//   }

//   //then i use the services in onInit
//      Delete(id:number){
//       this.prodserviceapi.delete(id).subscribe(()=>{
//        this.products= this.products.filter((prod)=>prod.id != id);
        
//       });
//      }
// }
//import { MatDialog } from '@angular/material/dialog';
import { Component, ElementRef, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { IProduct } from '../../Model/iproduct';
import { ProductWithApiService } from 'src/app/Services/product-with-api.service';
import Swal from 'sweetalert2';
import {NgxSpinnerService} from 'ngx-spinner';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { NavbarComponent } from '../../Shared/navbar/navbar.component';
import * as $ from 'jquery';
import 'bootstrap';


// interface Notification {
//   title: string;
//   body: string;
//   imgUrl: string;
//   hidden: boolean;
// }
interface Notification {
  title: string;
  body: string;
  type: 'success' | 'warning' |'danger';
  hidden: boolean;
}
interface ProductInternalInterface {
  id: number;
  name: string;
  imageName: string;
  productName: string;
  price: number;
  qty: number;
}

interface CountAction {
  productId: number;
  productName:string;
  count: number;
  inedxOfItem:number;
  imageName:string;
  price:number;
}
interface CountAction1 {
  productId: number;
  count: number;
  action: 'increase' | 'decrease';
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})

export class ProductsComponent implements OnInit {
  
  //notifications: Notification[] = [];
  //notifications = [];
  showNotification: boolean = false;
  wishlistItems: CountAction[] = [];
  notifications: Notification[] = [];
  products: IProduct[] = [];
  createdProductUrl: string | null = null;
  loading = true; // Flag to track loading status
  error: string | null = null;
  productCounts: number[] = [];
  WishListproductCounts: number[] = [];
  WishListproductIndecies: number[] = [];
  ProductsIds:number[]=[]
  countActions: CountAction[] = [];
  @ViewChild(NavbarComponent)navbar!: NavbarComponent;
  //@Input()navbar!:NavbarComponent;
  @Output() IdForDelete:number=0;
  @Output() productnameDeleted:string="";
  constructor(private prodserviceapi: ProductWithApiService,private spinner: NgxSpinnerService
    ,private dialog: MatDialog,private elementRef: ElementRef,private render:Renderer2
    //,private navBarForAction:NavbarComponent
    ) {

      // const storedProductCounts = localStorage.getItem('ProductscountItems');
      // if (storedProductCounts) {
      //   this.productCounts = JSON.parse(storedProductCounts) as number[];
      // } else {
      //   this.productCounts = [];
      // }
  
      // // Save the initial productCounts array to local storage
      // localStorage.setItem('ProductscountItems', JSON.stringify(this.productCounts));
    }

    // 
  ngOnInit(): void {
    

    //////////////////End   Notification


    // const notificationData = [
    //   { 
    //     title: "Notification Title a", 
    //     body: "This is the first macOS-style notification for your web application.",
    //     imgUrl: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/i/075007f6-42d1-410f-9cfd-105699dc8c31/devzjrq-861495c9-1341-4c60-87c4-8c0c78cacc75.png"
    //   },
    //   { 
    //     title: "Notification Title b", 
    //     body: "This is the second macOS-style notification for your web application.",
    //     imgUrl: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/i/075007f6-42d1-410f-9cfd-105699dc8c31/devzjrq-861495c9-1341-4c60-87c4-8c0c78cacc75.png"
    //   },
    //   { 
    //     title: "Notification Title c", 
    //     body: "This is the third macOS-style notification for your web application.",
    //     imgUrl: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/i/075007f6-42d1-410f-9cfd-105699dc8c31/devzjrq-861495c9-1341-4c60-87c4-8c0c78cacc75.png"
    //   }
    // ];

    // notificationData.forEach((data, index) => {
    //   setTimeout(() => {
    //     this.createNotification(data.title, data.body, data.imgUrl);
    //   }, 1000 + 5000 * index); // Increase delay for each notification
    // });


    /////////////Start  Notification


    // let count=0
    // const ProductItemsCount = localStorage.getItem('ProductscountItems');
    // if(ProductItemsCount){

    //   const productCountss2 =ProductItemsCount; // or replace `this.productCounts` with the actual reference
      
    //   const spans = document.querySelectorAll('span.Display_Icreasing_Decreasing');
      
    //   // Loop through each span and set its value from productCounts
    //   spans.forEach((span, index) => {
    //       // Ensure that the productCounts has a value for this index
    //       if (productCountss2[index] !== undefined) {
    //           span.textContent = productCountss2[index].toString();
    //           count++
    //       }
    //   });
    // }
    // console.log("count of spans are :: ",count)

    // Select all spans with the class Display_Icreasing_Decreasing
    
    
    const storedWishListIndecies = localStorage.getItem('WishListproductIndeciesStorage');
    if (storedWishListIndecies){
      this.productCounts=JSON.parse(storedWishListIndecies)
      this.WishListproductIndecies=JSON.parse(storedWishListIndecies)
      console.log("WishListproductCounts are /is ",this.WishListproductCounts)
    }
    else{
      this.WishListproductIndecies=[]
    }
    // Show the spinner
    this.spinner.show();
    
    // Simulate an asynchronous operation
    this.loadProducts();
    
    ///
    setTimeout(() => {
      // Hide the spinner after 2 seconds
      this.spinner.hide();
      this.loading = false;
    }, 1000);
    this.loadCountActions();
        
  }






  ////////////////Notification Functions 


  // createNotification(title: string, body: string, imgUrl: string) {
  //   const newNotification: Notification = {
  //     title,
  //     body,
  //     imgUrl,
  //     hidden: true
  //   };

  //   this.notifications.unshift(newNotification);

  //   setTimeout(() => {
  //     newNotification.hidden = false;
  //   }, 100);

  //   setTimeout(() => {
  //     this.closeNotification(newNotification);
  //   }, 30000);
  // }

  // closeNotification(notification: Notification) {
  //   notification.hidden = true;
  //   setTimeout(() => {
  //     this.notifications = this.notifications.filter(notif => notif !== notification);
  //   }, 500);
  // }

   

  

  /////////////////Notification Functions 













  loadProducts() {

    this.loading =true;///
    this.prodserviceapi.getAll().subscribe({
      next: (data: IProduct[]) => {
        this.products = data;

        const storedProductCounts = localStorage.getItem('ProductscountItems');
        if (storedProductCounts){
          this.productCounts=JSON.parse(storedProductCounts)
          this.WishListproductCounts=JSON.parse(storedProductCounts).filter((i:any)=>i!=0)
          console.log("WishListproductCounts are /is ",this.WishListproductCounts)
        }else{

          this.productCounts = new Array(this.products.length).fill(0);
          this.WishListproductCounts=[]
        }

        this.ProductsIds=this.products.map(product => product.id);
        console.log("Products Ids from loading products: ",this.ProductsIds)
        console.log("Products Counts from loadingProducts: ",this.productCounts)
      },
      error: (err) => {
        console.log('Error:', err);
        this.error = err; // Set the error message
      }
    });
  }
  
   
  // loadProducts() {
  //   this.loading = true; // Set loading to true when data loading starts
  //   this.prodserviceapi.getAll().subscribe({
  //     next: (data) => {
  //       this.products = data;
  //       this.loading = false; // Set loading to false when data loading completes
  //     },
  //     error: (err) => {
  //       console.log('Error:', err);
  //       this.loading = false; // Set loading to false in case of error
  //     }
  //   });
  // }


  // loadProducts() {
  //   this.prodserviceapi.getAll().subscribe({
  //     next: (data) => {
  //       this.products = data;
  //     },
  //     error: (err) => {
  //       console.log('Error:', err);
  //     }
  //   });
  // }

  // createProduct(newProduct: IProduct) {
  //   this.prodserviceapi.add(newProduct).subscribe({
  //     next: (response) => {
  //       console.log('Product created:', response.body.product);
  //       console.log('Message:', response.body.message);
  //       const locationHeader = response.headers.get('Location');
  //       if (locationHeader !== null) {
  //         this.createdProductUrl = locationHeader;
  //         console.log('URL:', this.createdProductUrl);
  //       } else {
  //         console.log('No URL returned from the server');
  //       }
  //     },
  //     error: (err) => {
  //       console.log('Error:', err);
  //     }
  //   });
  // }

  // delete(id: number) {
  //   this.prodserviceapi.delete(id).subscribe(() => {
  //     this.products = this.products.filter((prod) => prod.id !== id);
  //   });
  // }
  SendIDForBackEnd(id:number){
    //console.log(`"id for product is :: "${id }`)
    let ProductDeleted = this.products.find(prod => prod.id === id);
    if(!ProductDeleted){}
    else{
      this.productnameDeleted=ProductDeleted.productName;
    }
    
    this.IdForDelete=id;
    console.log("id for deleted item  ...",this.IdForDelete)
  } 

  


  Delete(id: number) {
    const productToDelete = this.products.find(prod => prod.id === id);
    if (!productToDelete) {
      console.error('Product not found');
      return;
    }
    this.prodserviceapi.delete(id).subscribe(
      () => {
        
        this.products = this.products.filter(prod => prod.id !== id);
        window.location.reload()
       
        // Swal.fire({
        //   title: 'Success!',
        //   text: `Product "${productToDelete.productName}" deleted successfully`,
        //   icon: 'success'
        // });

      },

    );
    //confirm message by alert in typescript
    // const isConfirmed = window.confirm(`Are you sure you want to delete "${productToDelete.productName}"?`);
    // if (isConfirmed) {
    //   this.prodserviceapi.delete(id).subscribe(
    //     () => {
    //       this.products = this.products.filter(prod => prod.id !== id);
    //       Swal.fire({
    //         title: 'Success!',
    //         text: `Product "${productToDelete.productName}" deleted successfully`,
    //         icon: 'success'
    //       });
    //     },

    //   );
    // }
  }
   
  DeleteObjectWithTransportIdFromParentToChildAndInverse(id:number){


  }
  
  openDeleteConfirmationDialog(productId: number): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '250px',
      data: { productId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // User confirmed deletion, perform delete operation here
        this.Delete(productId);
      }
    });
  }
  

  // // Display_Icreasing_Decreasing

  // increasing(event:any,id:number){

  //   const Span = this.elementRef.nativeElement.querySelector(".Display_Icreasing_Decreasing");
  //   //console.log(event)
  //   const btnincrease=event.target as HTMLElement;

  //  // Span.innerHtmel=event
  //  console.log("Hiiiii in Increasing Item")
  //  //let prodid=btnincrease.getAttribute("name")
  //  const spannext=btnincrease.nextSibling as HTMLElement
  //  let value=parseInt(spannext.innerText,10)
  //  ++value
  //  this.render.setProperty(spannext,'innerText',value)
  //  console.log("This is the data-id propartyinclude id for product for increasing  :::",id)
  // }

  // decreasing(event: any,id:number){

  //   const Span = this.elementRef.nativeElement.querySelector(".Display_Icreasing_Decreasing") as HTMLElement;
  //   //Span.getElementsByClassName("")
  //   //console.log(event)
  //   const btnDecrease=event.target as HTMLElement;


  //   const spannext=btnDecrease.previousSibling as HTMLElement
  //   let value=parseInt(spannext.innerText,10)
  //   --value
  //   this.render.setProperty(spannext,'innerText',value)


  //  // btnDecreaseSpan.innerHtmel=event
  //  //let prodid=btnDecrease.getAttribute("name")
  //  console.log("This is the data-id propartyinclude id for product for Decrasing :::",id)
  //  console.log("Hiiiii in Decreasing Item")
   
  // }

    


  // changeValue(index: number, delta: number,id:number) {
  //   if (this.productCounts[index] + delta >= 0) { // Ensure the value doesn't go below 0
  //     this.productCounts[index] += delta;
  //     const productId = this.ProductsIds[index];
  //     const action: 'increase' | 'decrease' = delta > 0 ? 'increase' : 'decrease';
  //     const countAction: CountAction = { productId, count: delta, action };
  //     this.countActions.push(countAction);
  //     this.saveCountActions();
  //   }
  // }

  // saveCountActions() {
  //   localStorage.setItem('countActions', JSON.stringify(this.countActions));
  // }

  // loadCountActions() {
  //   const countActionsStr = localStorage.getItem('countActions');
  //   if (countActionsStr) {
  //     this.countActions = JSON.parse(countActionsStr);
  //     // Apply count actions to update counts
  //     this.countActions.forEach(action => {
  //       const index = this.ProductsIds.indexOf(action.productId);
  //       if (index !== -1) {
  //         if (action.action === 'increase') {
  //           this.productCounts[index] += action.count;
  //         } else if (action.action === 'decrease') {
  //           this.productCounts[index] -= Math.abs(action.count);
  //         }
  //       }
  //     });
  //   }
  // }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////



  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  

  // changeValue(index: number, delta: number,id:number) {
  //   const newCount = this.productCounts[index] + delta;
  //   const productQty = this.products[index].qty;
  //   if (newCount >= 0  && newCount <= productQty) { // Ensure the value doesn't go below 0
  //     this.productCounts[index] = newCount;
  //     const productId = this.ProductsIds[index];
  //     const ProductName=this.products[index].productName
  //     const existingActionIndex = this.countActions.findIndex(action => action.productId === productId);

  //     if (existingActionIndex !== -1) {

  //       if (newCount === 0) {

  //         this.countActions[existingActionIndex].count = newCount;
  //         localStorage.setItem('ProductscountItems', JSON.stringify(this.productCounts));
  //         // Remove the action if the new count is zero
  //         this.countActions.splice(existingActionIndex, 1);
  //         // this.productCounts[index] = newCount;

  //         this.addNotification('warning', 'Warning!', `The product ${ProductName} is already removed from wishlist and count updated to ${newCount}..`);
  //         console.log("lasttttttttttttttttttttttt",this.productCounts)
  //         // Swal.fire({
  //         //   title: 'Success!',
  //         //   text: "The product now removed from wishlist......",
  //         //   icon: 'success'
  //         // });
  //         // this.createNotification(
  //         //   "Product Removed",
  //         //   `${ProductName} has been removed from your wishlist.`,
  //         //   "warning"
  //         // );


  //       } else {
  //         // Update existing action
  //         // this.navBarForAction.functionforUpdateItemsCount()
  //         // if(this.navbar){
            
  //           // }
            
  //         //debugger
          
  //         //  if(localStorage.getItem('ProductscountItems')){
            
  //           //   this.productCounts=localStorage.getItem('ProductscountItems');
            
  //           //  }
  //           // this.productCounts
  //         //this.productCounts[existingActionIndex]=newCount
  //         this.countActions[existingActionIndex].count = newCount;
  //         localStorage.setItem('ProductscountItems', JSON.stringify(this.productCounts));
  //         console.log("Products Ids after adding or minus products: ",this.ProductsIds)
  //         console.log("Products Counts after adding or minus loadingProducts: ",this.productCounts)
  //         // this.createNotification(
  //         //   "Product Updated",
  //         //   `${ProductName} count updated to ${newCount}.`,
  //         //   "success"
  //         // );
  //         if(delta==-1){
  //           this.addNotification('warning', 'Warning!', `The product ${ProductName} is already removed from wishlist and count updated to ${newCount}..`);

  //         }else{

  //           this.addNotification('success', 'Success!', `${ProductName} count updated to ${newCount}. to wishlis`);
  //         }

  //          console.log(this.productCounts)

  //          //console.log(this.navbar.Ali)
  //         // if(this.navbar){

  //         //   this.navbar.functionforUpdateItemsCount()
  //         //   console.log("component is Exists..........")
  //         // }else{
  //         //  console.log("this component not found ........")
  //         // }
          
  //       } 
  //     } else {
  //       if (newCount > 0) {
  //         // Add new action
  //         const countAction: CountAction = { productId, count: newCount,productName:ProductName};
  //         this.countActions.push(countAction);
  //         // this.createNotification(
  //         //   "Product Added",
  //         //   `${ProductName} added to your wishlist.`,
  //         //   "success"
  //         // );
  //         this.addNotification('success', 'Success!', `${ProductName} count added to ${newCount}. to wishlist`);

  //         //this.showAlert()
  //       }
  //     }

  //     this.saveCountActions();
  //   }else if(newCount > productQty){

  //     // Swal.fire({
  //     //   icon: 'error',
  //     //   title: 'Oops...',
  //     //   text: `You cannot add more than ${productQty} items for ${this.products[index].productName}.`,
  //     // });
  //     this.addNotification('danger', 'Oops...', `You cannot add more than ${productQty} items for ${this.products[index].productName}.`);

  //   }
  //   else if(newCount < 0){
  //     // Swal.fire({
  //     //   title: 'Success!',
  //     //   text: "The product is allready removed from wishlist......",
  //     //   icon: 'success'
  //     // });
  //     this.addNotification('warning', 'Warning!', 'The product is already removed from wishlist.');

  //   }

  // }

  changeValue(index: number, delta: number, id: number) {
    //debugger
    const newCount = this.productCounts[index] + delta;
    const productQty = this.products[index].qty;
    // const productId = this.ProductsIds[index];
    const productId = id;

    const ProductName = this.products[index].productName;
    let ImageName=this.products[index].imageName;
    let price=this.products[index].price;
    let Product_Name=""
    this.products.forEach(element => {
      if(element.id==id){
        Product_Name=element.productName
      }

    });
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
  
    if (existingActionIndex !== -1) {
      if (newCount === 0) {
        // Remove the action if the new count is zero
        this.countActions.splice(existingActionIndex, 1);
        
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
    } else if (newCount > 0) {
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

    const countActionsStr = localStorage.getItem('countActions');
    if (countActionsStr) {
      const arrofActions=JSON.parse(countActionsStr)
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

    }
    console.log("Products Ids after adding or minus products: ", this.ProductsIds);
    console.log("Products Counts after adding or minus loadingProducts: ", this.productCounts);
  }
  

  saveCountActions() {
    localStorage.setItem('countActions', JSON.stringify(this.countActions));
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
//////////////////////////////////////////////////////////
/////////// For ALert/////////////////

// showAlert() {
//   const alert = $('#wishlist-alert');
//   if (alert.length) {
//     alert.removeClass('fade').addClass('show');
//     setTimeout(() => {
//       alert.addClass('fade').removeClass('show');
//     }, 3000); // Auto-hide after 3 seconds
//   }
// }
//to use $ i will install 
//npm i --save-dev @types/jquery
//install :npm install @types/jquery @types/bootstrap  for alert

////////////////////////////////////////////////////////////////////////////////////

  // changeValue(index: number, delta: number,id:number) {
  //   const newCount = this.productCounts[index] + delta;
  //   if (newCount >= 0) { // Ensure the value doesn't go below 0
  //     this.productCounts[index] = newCount;
  //     const productId = this.ProductsIds[index];
  //     const existingActionIndex = this.countActions.findIndex(action => action.productId === productId);

  //     if (existingActionIndex !== -1) {
  //       // Update existing action
  //       if(this.countActions[existingActionIndex].count==0){
          
  //         //this.countActions[existingActionIndex].splice(productId,1);
  //       }
  //       this.countActions[existingActionIndex].count = newCount;
  //     } else {
  //       // Add new action
  //       const countAction: CountAction = { productId, count: newCount };
  //       this.countActions.push(countAction);
  //     }

  //     this.saveCountActions();
  //   }
  // }

  // saveCountActions() {
  //   localStorage.setItem('countActions', JSON.stringify(this.countActions));
  // }

  // loadCountActions() {
  //   const countActionsStr = localStorage.getItem('countActions');
  //   if (countActionsStr) {
  //     this.countActions = JSON.parse(countActionsStr);
  //     // Apply count actions to update counts
  //     this.countActions.forEach(action => {
  //       const index = this.ProductsIds.indexOf(action.productId);
  //       if (index !== -1) {
  //         this.productCounts[index] = action.count;
  //       }
  //     });
  //   }
  // }




//////////////////////////////////////////////////////////////












  // changeValue(index: number, delta: number,id:number) {
  //   if (this.productCounts[index] + delta >= 0) { // Ensure the value doesn't go below 0
  //     this.productCounts[index] += delta;
  //     console.log(this.productCounts)
  //   }
  // }

  // increase(event: Event) {
  //   const btnIncrease = event.target as HTMLElement;
  //   const span = btnIncrease.nextElementSibling as HTMLElement;
  //   if (span && span.classList.contains('Display_Icreasing_Decreasing')) {
  //     let value = parseInt(span.innerText, 10);
  //     value++;
  //     this.render.setProperty(span, 'innerText', value);
  //   } else {
  //     console.error('Increase button: Could not find the next sibling span');
  //   }
  // }

  // decrease(event: Event) {
  //   const btnDecrease = event.target as HTMLElement;
  //   const span = btnDecrease.previousElementSibling as HTMLElement;
  //   if (span && span.classList.contains('Display_Icreasing_Decreasing')) {
  //     let value = parseInt(span.innerText, 10);
  //     value--;
  //     this.render.setProperty(span, 'innerText', value);
  //   } else {
  //     console.error('Decrease button: Could not find the previous sibling span');
  //   }
  // }



  // createNotification(title: string, body: string, type: 'success' | 'warning') {
  //   const newNotification: Notification = {
  //     title,
  //     body,
  //     type,
  //     hidden: true
  //   };

  //   this.notifications.unshift(newNotification);

  //   setTimeout(() => {
  //     newNotification.hidden = false;
  //   }, 100);

  //   setTimeout(() => {
  //     this.closeNotification(newNotification);
  //   }, 30000);
  // }

  // closeNotification(notification: Notification) {
  //   notification.hidden = true;
  //   setTimeout(() => {
  //     this.notifications = this.notifications.filter(notif => notif !== notification);
  //   }, 500);
  // }

  
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




  ////////////////////////////////////
 /////////WishList///////////
  ////////////////////////////////////
  showWishlist(): void {
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

  // removeItem(item: CountAction) {
  //   const countActionsJSON = localStorage.getItem('countActions');
  //   if(countActionsJSON){

  //     const countActions: CountAction[] = JSON.parse(countActionsJSON);
  //   }
  //   const index = this.countActions.findIndex((i) => i.productName === item.productName);
  //   if (index > -1) {
  //     this.countActions.splice(index, 1);
  //     //this.calculateTotalPrice();
  //   }
  // }


}
