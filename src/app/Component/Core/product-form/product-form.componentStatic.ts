import { Component, OnInit, Output } from '@angular/core';
import { IProduct } from '../../Model/iproduct';
import { ProductsService } from 'src/app/Services/products.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-form',
  template: `./product-form.component.html`,
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit{



  @Output() productName:string="";
  @Output() Productprice:number=0;
  @Output() Productqty:number=0;
  @Output() ProductAddress:number=0;
  get isNameValid(){
    return this.productName !='' && this.productName.length>3
   }

   get isAgeValid(){
    return this.Productprice !=0 && this.Productprice<17
   }

   get isSchoolValid(){
    return this.Productqty !=0 && this.Productqty<12
   }

   get isAddressValid(){
    return this.ProductAddress !=0 && this.ProductAddress<12
   }


   Product:IProduct={
    id:0,
    productName:'',
    price:0,
    qty:0,
    categoryid:0
  }

  ProductId:number=0;
    //we use a (Router) service to make redirect after submit form and save data ...
   //we use an (ActivatedRoute) to catch ID from url through OnInit method ...

  constructor(private prodservice:ProductsService,private activatedRoute:ActivatedRoute,private router:Router){}
  ngOnInit(): void {
    this.ProductId=this.activatedRoute.snapshot.params['id'];
    if(this.ProductId != 0)
    {
      let prod=this.prodservice.getById(this.ProductId)
      if(prod) 
       this.Product=prod
    }
  }



   GetData(e:Event){
    e.preventDefault();


    console.log(this.Product)
    if(this.ProductId)
    {
      //edit
      this.prodservice.edit(this.ProductId,this.Product)

    }else{
      //add
      this.prodservice.add(this.Product)

    }
 
    //go to product
    this.router.navigate(['/products']);

   }


}

