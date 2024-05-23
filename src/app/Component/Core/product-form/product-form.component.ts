import { LoadingSpinnerComponent } from './../loading-spinner/loading-spinner.component';
import { HttpClient } from '@angular/common/http';
import { IProduct } from './../../Model/iproduct';
import { Component, ElementRef, OnInit, Output, ViewChild } from '@angular/core';
//import { IProduct } from '../../Model/iproduct';
import { ProductsService } from 'src/app/Services/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductWithApiService } from 'src/app/Services/product-with-api.service';
import Swal from 'sweetalert2';
import { ICategory } from '../../Model/icategory';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',//`<h2>Reactive Form</h2>`,
  styleUrls: ['./product-form.component.css']
})
///////////////////////////////////  Using Reactive Form //////////////////////////////////
export class ProductFormComponent implements OnInit{
  @ViewChild('imageDiv') imageDiv!: ElementRef;
  products:IProduct[]=[];
  // Product1:IProduct={
  //   id:0,
  //   productName:'Bed Room',
  //   price:1000,
  //   qty:10,
  //   categoryid:1,
  //   image:"sjdwjdwj"
  // }
  categories:ICategory[]=[];
  selectedFile: File | null = null;
  ProductsForm: FormGroup;
  productImage:string|null=null;
   //ProductsForm !: FormGroup
  //  ProductsForm:FormGroup=new FormGroup ({
  //     id:new FormControl(0),
  //     productName:new FormControl('',[Validators.required,Validators.minLength(7)]),
  //     price:new FormControl(0,[Validators.required,Validators.min(100),Validators.max(10000)]),
  //     qty:new FormControl(0,[Validators.required,Validators.max(100)]),
  //     categoryid:new FormControl(0,[Validators.required,Validators.min(1)]),
  //     image:new FormControl('')
  //   });
   
  url:string|null=null//"https://localhost:7269/resources"//{{productImage}}
  ProductId:number=0;
  Loading: boolean = false;

  loading: boolean = false;
  dialogRef: any;
    //we use a (Router) service to make redirect after submit form and save data ...
   //we use an (ActivatedRoute) to catch ID from url through OnInit method ...

  constructor(private prodserviceapi: ProductWithApiService,private activatedRoute:ActivatedRoute
              ,private router:Router,private fb:FormBuilder,private http:HttpClient, private dialog: MatDialog){


    this.ProductsForm = this.fb.group({
      id: [0],
      productName: ['', [Validators.required, Validators.minLength(7)]],
      price: [0, [Validators.required, Validators.min(100), Validators.max(10000)]],
      qty: [0, [Validators.required, Validators.max(100)]],
      categoryid: [0, [Validators.required, Validators.min(1)]],
      imageName:[''] ,
      imagefile: [null] // Add image field to the form
    });
  }
  ngOnInit(): void {
    //  this.ProductsForm = this.fb.group({
    //   id: [0],
    //   productName: [''],
    //   price: [''],
    //   qty: [''],
    // });
   // ({
    //   id:new FormControl(0),
    //   productName:new FormControl('',[Validators.required,Validators.minLength(7)]),
    //   price:new FormControl(0,[Validators.required,Validators.min(100),Validators.max(10000)]),
    //   qty:new FormControl(0,[Validators.required,Validators.max(100)]),
    // });
    this.prodserviceapi.getAllCategories().subscribe(
      (categories:any)=>{
        this.categories=categories
      }
     )



    this.ProductId=this.activatedRoute.snapshot.params['id'];
    if(this.ProductId>0){
       //Edit
       //console.log()
       this.prodserviceapi.getById(this.ProductId).subscribe(
        (data:any)=>{
          console.log(data)
          const categoryId: number = parseInt(data.categoryid);
         
          this.productImage=data.imageName;
          this.url=`https://localhost:7269/resources/${this.productImage}`
          //this.ProductsForm.patchValue(data) //to summeray the next code .........
          this.ProductsForm.controls['productName'].setValue(data.productName)
          this.ProductsForm.controls['price'].setValue(data.price)
          this.ProductsForm.controls['qty'].setValue(data.qty)
          this.ProductsForm.controls['categoryid'].setValue(categoryId);
          this.ProductsForm.controls['imageName'].setValue(data.imageName);
        }
       )


    }
  }

  
  
onFileSelected(event: any){
  this.selectedFile = event.target.files[0] ;//as File

  if (this.selectedFile) {
    // Set the display of the image div to "block"
    this.imageDiv.nativeElement.style.display = 'block';
  } else {
    // Handle no file selected scenario
  }




  const file: File = event.target.files[0];
  console.log("from on select Imaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaagggggggggggggggggeeeee")
  this.ProductsForm.patchValue({ imagefile: file });
 // this.ProductsForm.controls['imagefile'].setValue(this.selectedFile); //this.selectedFile?.name
  var reader=new FileReader();
  reader.readAsDataURL(file);
  reader.onload=(event:any)=>{
    this.url=event.target.result;
  }
  console.log(this.ProductsForm.value)
}






// onFileSelected(event: any) {
//   const file: File = event.target.files[0];
//   const formData = new FormData();
//   formData.append('file', file);
//   this.ProductsForm.patchValue({ imagefile: file });
//   console.log("ProductsForm after add file upload")
//   console.log(this.ProductsForm.value);
//   console.log("File Details")
//   console.log(file);
//   this.postfile(file);


// }
  // this.http.post('https://localhost:7269/api/Product/UploadImage2', formData).subscribe(
  //   (res: any) => {
  //     debugger;
  //   }
  // );

//postfile
postfile(file:File){
  
  this.prodserviceapi.postfile(file).subscribe(()=>{});
}

  // if (file) {
  //   this.prodserviceapi.uploadImage(file).subscribe(
  //     (res:any)=>{
  //       debugger;
  //     }
  //     // res => {
  //     //   console.log(res); // Handle success response
  //     // },
  //     // error => {
  //     //   console.error(error); // Handle error response
  //     // }
  //   );
  // }




   GetData(){
    //e.preventDefault();
     console.log(this.ProductsForm.value)
     let formData = new FormData();
     if(this.ProductsForm.valid){
      //console.log("mmmdffdmfdmfmdmfdmfdm")
      //console.log(this.ProductsForm.value)
      // this.ProductsForm.controls['image'].setValue(this.selectedFile)
      
      // formData.append('productName', this.ProductsForm.value.productName);
      // formData.append('price', this.ProductsForm.value.price);
      // formData.append('qty', this.ProductsForm.value.qty);
      // formData.append('categoryid', this.ProductsForm.value.categoryid);
      // formData.append('image', this.selectedFile??""); // Append the selected file
      // console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii")
      // console.log(this.ProductsForm.value)

     }
    // console.log(this.Product)
    if(this.ProductId>0)
    {
      //edit
      // const updatedFormData = {
      //   ...this.ProductsForm.value,
      //   categoryid: parseInt(this.ProductsForm.value.categoryid)
      // };
      //this.ProductsForm.value
      console.log("Before Updating.........................")
      console.log(this.ProductsForm.value)
      // this.loading = true;
      // this.dialogRef = this.dialog.open(LoadingSpinnerComponent, { disableClose: true });
      this.prodserviceapi.edit(this.ProductId,this.ProductsForm.value).subscribe(
      ()=>{
        //this.Loading = true;
        // this.loading = false;
        // this.dialogRef.close();
        this.router.navigate(['/dashboard/productDashboard']);
      }
      )
      this.products= this.products.filter((prod)=>prod.id !=this.ProductsForm.value.id);

    }else{
      //add

      //console.log(this.ProductsForm.value)

      // this.prodserviceapi.add(this.ProductsForm.value).subscribe(
      //  {
      //   next: (response) => {
      //     console.log('Product created:', response.body.product);
      //     console.log('Message:', response.body.message);
      //     console.log('URL:', response.headers.get('Location')); // Handle the returned URL
      //     // Handle the response as needed
      //   },
      //   error: (err) => {
      //     console.log('Error:', err);
      //     // Handle the error as needed
      //   }
      //  }
      // )
      
   //Services for Add 
   console.log("before add product.........")
   console.log(this.ProductsForm.value)
  //  this.loading = true;
  //  this.dialogRef = this.dialog.open(LoadingSpinnerComponent, { disableClose: true });
  this.prodserviceapi.add(this.ProductsForm.value).subscribe(
  {
    
    next: (response) => {
      //this.Loading = true;
      console.log('Product created:', response.body.product);
      console.log('Message:', response.body.message);
      console.log('Url:', response.body.url);
      // this.loading = false;
      // this.dialogRef.close();
      // Constructing the URL based on the response
      const createdProductId = response.body.product.id; // Assuming the product ID is returned in the response
      //const baseUrl = 'https://localhost:7269/api/Product'; // Set your base URL
      //const createdProductUrl = `${baseUrl}/Details/${createdProductId}`;
      //console.log('URL:', createdProductUrl);
      
      // Handle the response as needed
      this.router.navigate(['/dashboard/productDashboard']);
    },
    error: (err) => {
      console.log('Error:', err);
      // Handle the error as needed
    }
  }
);



      this.products= this.products.filter((prod)=>prod.id !=this.ProductsForm.value.id);
    }
 
    //go to product
    

   }




// GetData() {
//   console.log(this.ProductsForm.value);
//   if (this.ProductsForm.valid) {
//     if (this.ProductId > 0) {
//       // Edit
//       // Assuming you're retrieving the value of categoryid somewhere in your component
//       const categoryid: number = +this.ProductsForm.get('categoryid')?.value;
//       console.log("id after convert ...... :::: ",categoryid)
//       // Convert categoryid to a number
//       this.prodserviceapi.edit(this.ProductId, { 
//         ...this.ProductsForm.value,
//         categoryid: parseInt(this.ProductsForm.value.categoryid) // Convert categoryid to a number
//       }).subscribe(
//         // handle edit response
//       );
//     } else {
//       // Add
//       const selectedCategoryId: number = +this.ProductsForm.get('categoryid')?.value; // Convert categoryid to a number
//       console.log(selectedCategoryId)
//       this.prodserviceapi.add({ ...this.ProductsForm.value, selectedCategoryId }).subscribe({
//         next: (response) => {
//           console.log('Product created:', response.body.product);
//           console.log('Message:', response.body.message);
//           console.log('Url:', response.body.url);
//           const createdProductId = response.body.product.id;
//         },
//         error: (err) => {
//           console.log('Error:', err);
//         }
//       });
//     }

//     // Navigate to product dashboard
//     this.router.navigate(['/dashboard/productDashboard']);
//   }
// }












}



// import { Component, OnInit, Output } from '@angular/core';
// import { IProduct } from '../../Model/iproduct';
// import { ProductsService } from 'src/app/Services/products.service';
// import { ActivatedRoute, Router } from '@angular/router';

// @Component({
//   selector: 'app-product-form',
//   template: `./product-form.component.html`,
//   styleUrls: ['./product-form.component.css']
// })
// export class ProductFormComponent implements OnInit{



//   @Output() productName:string="";
//   @Output() Productprice:number=0;
//   @Output() Productqty:number=0;
//   @Output() ProductAddress:number=0;
//   get isNameValid(){
//     return this.productName !='' && this.productName.length>3
//    }

//    get isAgeValid(){
//     return this.Productprice !=0 && this.Productprice<17
//    }

//    get isSchoolValid(){
//     return this.Productqty !=0 && this.Productqty<12
//    }

//    get isAddressValid(){
//     return this.ProductAddress !=0 && this.ProductAddress<12
//    }


//    Product:IProduct={
//     id:0,
//     productName:'',
//     price:0,
//     qty:0,
//   }

//   ProductId:number=0;
//     //we use a (Router) service to make redirect after submit form and save data ...
//    //we use an (ActivatedRoute) to catch ID from url through OnInit method ...

//   constructor(private prodservice:ProductsService,private activatedRoute:ActivatedRoute,private router:Router){}
//   ngOnInit(): void {
//     this.ProductId=this.activatedRoute.snapshot.params['id'];
//     if(this.ProductId != 0)
//     {
//       let prod=this.prodservice.getById(this.ProductId)
//       if(prod) 
//        this.Product=prod
//     }
//   }



//    GetData(e:Event){
//     e.preventDefault();


//     console.log(this.Product)
//     if(this.ProductId)
//     {
//       //edit
//       this.prodservice.edit(this.ProductId,this.Product)

//     }else{
//       //add
//       this.prodservice.add(this.Product)

//     }
 
//     //go to product
//     this.router.navigate(['/products']);

//    }


// }

