import { ProductsService } from './../../../Services/products.service';
import { Component, OnInit, Output } from '@angular/core';
import { IProduct } from '../../Model/iproduct';
import { ProductWithApiService } from 'src/app/Services/product-with-api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { ICategory } from '../../Model/icategory';
import { IproductViewModelWithCategory } from '../../Model/iproductViewModel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-crud',
  templateUrl: './product-crud.component.html',
  styleUrls: ['./product-crud.component.css']
})
export class ProductCrudComponent implements OnInit {
  // products:IProduct[]=[];
  
  // //here i 'll inject services at constructor ----> (prodservice)....
  // constructor(private prodservice:ProductsService){

  // }

  // ngOnInit(): void {
  //   this.products=this.prodservice.getall();
  // }

  // //then i use the services in onInit

  // Delete(id:number){

  //   var res=confirm('Are you sure to delete this item .')
  //   if(res)
  //   {
  //     this.prodservice.delete(id);
  //   }
  // }

    


  products: IProduct[] = [];
  categories: ICategory[] = [];
  products_category: IproductViewModelWithCategory[] = [];
  
  createdProductUrl: string | null = null;
  loading = false; // Flag to track loading status
  error: string | null = null;
  

  @Output() IdForDelete:number=0;
  @Output() productnameDeleted:string="";
  constructor(private prodserviceapi: ProductWithApiService,private spinner: NgxSpinnerService,private dialog: MatDialog,private route:Router) {}

  ngOnInit(): void {
    

        // Show the spinner
        this.spinner.show();

        // Simulate an asynchronous operation
        //this.loadProducts();
        //this.loadCategories();
        this.loadProducts_Category()
        //this.getAllProduct_Category();
        setTimeout(() => {
          // Hide the spinner after 2 seconds
          this.spinner.hide();
        }, 3000);
  }


  loadProducts() {
    this.prodserviceapi.getAll().subscribe({
      next: (data: IProduct[]) => {
        this.products = data;
        console.log("All Products .............")
        console.log(this.products)
      },
      error: (err) => {
        console.log('Error:', err);
        this.error = err; // Set the error message
      }
    });
  }
   

  loadCategories() {
    this.prodserviceapi.getAllCategories().subscribe({
      next: (data: ICategory[]) => {
        this.categories = data;
        console.log("All Categories Only Categories also include Products .......")
        console.log(this.categories)
      },
      error: (err) => {
        console.log('Error:', err);
        this.error = err; // Set the error message
      }
    });
  }


  loadProducts_Category() {
    this.prodserviceapi.getAllProduct_Category().subscribe({
      next: (data: IproductViewModelWithCategory[]) => {
        this.products_category = data;
        console.log("All Products each one has category name .......")
        console.log(this.products_category)
      },
      error: (err) => {
        if(err.errorCode==403 || err.errorCode== 401){
          // Swal.fire({
          //   title: 'error!',
          //   text: "You are unauthorized Person .........",
          //   icon: 'error'
          // });
          //'NotFound'
          this.route.navigate(['/dashboard/unauthorized'])
          this.error="You are unauthorized Person ........."

        }else if(err.errorCode==0){
          this.error=` Server Error ... \n ${err.errorStatusText} \n for load Data from ${err.url}`
          //this.error = "Server Error...\n" + err.errorStatusText +"\n"+ " for load Data from " + err.url; // Set the error message
          console.log(this.error)
        }else{
          this.error = err.errorCode;
        }
        console.log('Error:', err);
        
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
        Swal.fire({
          title: 'Success!',
          text: `Product "${productToDelete.productName}" deleted successfully`,
          icon: 'success'
        });
      },

    );

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



}
