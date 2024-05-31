export interface iOrderItems {
    id:number;
    userId:string,
    username:string;
    orderItems:[
    {
        id:number,
        productId:0,
        productName:string,
        price:number,
        count:number,
        // categoryid:number,
        imageName:string,
        OrderId:number,
    }
    ];
}


// export interface ICategory {
//     id:number;
//     categoryName:string;
//     products:[
//         {
//             id:number,
//             productName:string,
//             price:number,
//             qty:number,
//             categoryid:number,
//             imageName:string,
//             imagefile:File,
//         }
//     ];
//     catimageName:string; //Added New
//     catimagefile:File;
// }