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


// }
