// export interface ICategory {
//     id:number;
//     categoryName:string;
//     products:[];
// }


export interface ICategory {
    id:number;
    categoryName:string;
    products:[
        {
            id:number,
            productName:string,
            price:number,
            qty:number,
            categoryid:number,
            imageName:string,
            imagefile:File,
        }
    ];
    catimageName:string; //Added New
    catimagefile:File;
}