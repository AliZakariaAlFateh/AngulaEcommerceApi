import { HttpHeaders } from '@angular/common/http';
import { Component, Directive, ElementRef, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
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
import { CountAction } from '../../Model/iCountAction';
import { ShoppingbasketService } from 'src/app/Services/shoppingbasket.service';



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

// interface CountAction {
//   productId: number;
//   productName:string;
//   count: number;
//   inedxOfItem:number;
//   imageName:string;
//   price:number;
// }
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
  @Directive({
    selector: '[displayDiveFromWishList]'
  })
  @Input('displayDiveFromWishList') customProperty: any;
  //notifications: Notification[] = [];
  //notifications = [];
  shouldHideDiv: boolean = false;
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
  //@Input() displayDiveFromWishList:number|undefined
  @Output() IdForDelete:number=0;
  @Output() productnameDeleted:string="";
  constructor(private prodserviceapi: ProductWithApiService,private spinner: NgxSpinnerService
    ,private dialog: MatDialog,private elementRef: ElementRef,private render:Renderer2
    ,private shopingbin:ShoppingbasketService
    //,private navBarForAction:NavbarComponent
    ) {}

    // 
  ngOnInit(): void {
    

    //////////////////End   Notification

    
    ///For WIshList and count the number of products and its indecies
    const storedWishListIndecies = localStorage.getItem('WishListproductIndeciesStorage');
    if (storedWishListIndecies){
      this.productCounts=JSON.parse(storedWishListIndecies)
      this.WishListproductIndecies=JSON.parse(storedWishListIndecies)
      console.log("WishListproductCounts are /is ",this.WishListproductCounts)
    }
    else{
      this.WishListproductIndecies=[]
    }
    console.log("From product component wishlist count ::::::::::::",this.WishListproductCounts)
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


  

  /////////////////Notification Functions 


  loadProducts() {

    this.loading =true;///
    this.prodserviceapi.getAll().subscribe({
      next: (data: IProduct[]) => {
        this.products = data;
        
        localStorage.setItem('allProducts', JSON.stringify(this.products));
        

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
  

 ///////////////For Increasing and Decreasing buttons ////////////////////
  changeValue(index: number, delta: number, id: number) {
    debugger
    const productcountsproductcompo=localStorage.getItem('ProductscountItems');
    if(productcountsproductcompo)
      {
        console.log("From product component Counts of items paymented From Local Storage are  :::::  ",JSON.parse(productcountsproductcompo))
        this.productCounts=JSON.parse(productcountsproductcompo)
      }
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
  
    if (existingActionIndex !== -1) {
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
    if(newCount==0){
      if(this.showNotification==true){
        
        this.showWishlist()
      }
    }
    

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
    let counttobin=0
    this.WishListproductCounts.forEach(element=>{
      counttobin+=element
    })
    this.shopingbin.updateBin(counttobin.toString());
  }
  

  saveCountActions() {
    localStorage.setItem('countActions', JSON.stringify(this.countActions));
    this.shouldHideDiv=false
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


  isEmptyArray(str: string): boolean {
    try {
      const parsed = JSON.parse(str);
      return Array.isArray(parsed) && parsed.length === 0;
    } catch (e) {
      // If JSON parsing fails, it's not a valid array
      return false;
    }
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





}
