export interface IProduct {
    id:number;
    productName:string;
    price:number;
    qty:number;
    categoryid:number;
    imageName?:string;
    imagefile?:File;
}
