import { Injectable } from '@angular/core';
import { IProduct } from '../Component/Model/iproduct';
import { ProductList } from '../Component/Model/productList';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  Products:IProduct[] 
  constructor() { 
    this.Products=ProductList;
  }

  getall():IProduct[]{
    return this.Products;
   }
    
   getById(id:number):IProduct|undefined{

    return this.Products.find((prod)=>prod.id==id);
   }
   

   add(prod:IProduct):void{
    let nextId=ProductList[ProductList.length-1].id+1;
    prod.id=nextId;
    this.Products.push(prod);
   }
 

   edit(id:number,prod:IProduct):void{
    let index=this.Products.findIndex((p)=>p.id==id)
    this.Products[index].productName=prod.productName;
    this.Products[index].price=prod.price;
    this.Products[index].qty=prod.qty;

   }


   delete(id:number):void{
    let index=this.Products.findIndex((s)=>s.id==id)
    if(index!=-1)
    this.Products.splice(index,1)   
   }





}
