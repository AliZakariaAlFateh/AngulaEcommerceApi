import { Component, OnInit } from '@angular/core';
import { IProduct } from '../../Model/iproduct';
import { ProductsService } from 'src/app/Services/products.service';
import { ActivatedRoute } from '@angular/router';
import { ProductWithApiService } from 'src/app/Services/product-with-api.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',//`<h2>Details for avoid routerlink Error</h2>`, //'./product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit{

  productId:number=0;
  product: IProduct|any;

  //inject for Activated routing to catch Id for the product you want display its details ...
  constructor(private activatedRoute:ActivatedRoute , private stdService:ProductWithApiService){

  }
  ngOnInit(): void {
        this.productId=this.activatedRoute.snapshot.params['id'];
       this.stdService.getById(this.productId).subscribe((data)=>{this.product=data} );
  }
}
