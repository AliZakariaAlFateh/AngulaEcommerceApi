import { AfterViewInit, Component, OnInit, Output,ElementRef, ViewChild } from '@angular/core';
import { ICategory } from '../../Model/icategory';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ProductsService } from 'src/app/Services/products.service';
import { CategoryServicesService } from 'src/app/Services/category-services.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit , AfterViewInit{
  @ViewChild('formOpen2') formOpen2!: ElementRef;
  loading = false; // Flag to track loading status
  error: string | null = null;
  Categories: ICategory[] = [];
  @Output() url=""
  @Output() IdForDelete:number=0;
  @Output() productnameDeleted:string="";
  // url:string|null=null
  selectedFile: File | null = null;
  CategoryId:number=0;
  Category:FormGroup;
  productImage:string|null=null;
  CategoryForDetails:ICategory|undefined
  @ViewChild('dialog') dialog!: ElementRef;
  constructor(private categoryserviceapi:CategoryServicesService,private elementRef: ElementRef,private activatedRoute:ActivatedRoute,private fb:FormBuilder){


    this.Category = this.fb.group({
      id: [0],
      categoryName: ['', [Validators.required,Validators.minLength(7),Validators.maxLength(100)]],
      catimageName:[''] ,
      products:[],
      catimagefile: [null] // Add image field to the form
    });
  }
  ngOnInit(): void {

    this.GetAllCategories();
    //throw new Error('Method not implemented.');
  //   this.CategoryId=this.activatedRoute.snapshot.params['id'];
  //   if(this.CategoryId>0){
  //     //Edit
  //     //console.log()
  //     this.categoryserviceapi.getById(this.CategoryId).subscribe(
  //      (data:any)=>{
  //        console.log(data)
  //        const categoryId: number = parseInt(data.categoryid);
        
  //        this.productImage=data.imageName;
  //        this.url=`https://localhost:7269/resources/${this.productImage}`
  //        this.Category.patchValue(data) //to summeray the next code .........
  //       //  this.ProductsForm.controls['productName'].setValue(data.productName)
  //       //  this.ProductsForm.controls['price'].setValue(data.price)
  //       //  this.ProductsForm.controls['qty'].setValue(data.qty)
  //       //  this.ProductsForm.controls['categoryid'].setValue(categoryId);
  //       //  this.ProductsForm.controls['imageName'].setValue(data.imageName);
  //      }
  //     )
  //  }

  // const dialog = document.querySelector("dialog");
  // const cartButton = document.getElementById("add__to__cart");
  // const dialogButton = document.getElementById("close__dialog");
  
  
  // cartButton?.addEventListener("click", () => {
  //   dialog?.showModal();
  //   });

  //   dialogButton?.addEventListener("click", () => {
  //     dialog?.close();
  //   });

  }

  // openDialog(){
  //   const dialog = document.querySelector("dialog");
  //   const cartButton = document.getElementById("add__to__cart");
  //   cartButton?.addEventListener("click", () => {
  //   dialog?.showModal();
  //   });

  // }

  // closeDialog(){
    
  //   const dialog = document.querySelector("dialog");
  //   const dialogButton = document.getElementById("close__dialog");
  //   dialogButton?.addEventListener("click", () => {
  //     dialog?.close();
  //   });

  // }

  ngAfterViewInit(): void {
    const formOpenBtn = this.elementRef.nativeElement.querySelector("#form-open");
    const openModalForDetails=this.elementRef.nativeElement.querySelector("#form-open1");
    const formForEdit=this.elementRef.nativeElement.querySelector("#form-open2")
    const home = this.elementRef.nativeElement.querySelector(".home");
    const formContainer = this.elementRef.nativeElement.querySelector(".form_container");
    const formCloseBtn = this.elementRef.nativeElement.querySelector(".form_close");
    const signupBtn = this.elementRef.nativeElement.querySelector("#signup");
    // const loginBtn = this.elementRef.nativeElement.querySelector("#login");

    formOpenBtn.addEventListener("click", () => {
      this.CategoryId = 0;
      this.Category.reset();
      setTimeout(() => {
        home.classList.add("show");
      }, 100); // Adjust the delay (in milliseconds) as needed
    });


    // openModalForDetails.addEventListener("click", () => {
    //   this.CategoryId = 0;
    //   this.Category.reset();
    //   setTimeout(() => {
    //     home.classList.add("show");
    //   }, 100); // Adjust the delay (in milliseconds) as needed
    // });
       
    



    formCloseBtn.addEventListener("click", () => 
      {
      home.classList.remove("show")
      setTimeout(() => {
        this.Category.reset();
      }, 500); 
    }
  );
    
    //formForEdit.addEventListener("click", () => home.classList.add("show"));

    // signupBtn.addEventListener("click", (e: Event) => {
    //   e.preventDefault();
    //   formContainer.classList.add("active");
    // });

    // loginBtn.addEventListener("click", (e: Event) => {
    //   e.preventDefault();
    //   formContainer.classList.remove("active");
    // });
  }

  
  get CategoryNameControl(){
    return this.Category.get('categoryName');
  }


  GetAllCategories(){
    
    this.categoryserviceapi.GetAll().subscribe(
      (res:ICategory[])=>{
        this.Categories=res;
        console.log("All Categories From Category Controller ............ Again")
        console.log(res)
        console.log("All Categories after transaction to categories  ..")
        console.log(this.Categories)
        console.log("All Products after transaction to categories  ..")
        console.log(this.Categories)

      }
    );

  }




  LoadAllCategories(){
      
  }


  SendToEdit(id:number){
    this.CategoryId=id;
    console.log("Id For this Category :::::::::::::     ",id)
    this.categoryserviceapi.getById(id).subscribe(
      (data:any)=>{
        console.log(data)
        const categoryId: number = parseInt(data.id);
       console.log("Category id From Data.id ::::::: ",categoryId)
        this.productImage=data.imageName;
        this.url=`https://localhost:7269/resources/${this.productImage}`
        this.Category.patchValue(data) //to summeray the next code .........
       //  this.ProductsForm.controls['productName'].setValue(data.productName)
       //  this.ProductsForm.controls['price'].setValue(data.price)
       //  this.ProductsForm.controls['qty'].setValue(data.qty)
       //  this.ProductsForm.controls['categoryid'].setValue(categoryId);
       //  this.ProductsForm.controls['imageName'].setValue(data.imageName);
      }
     )
    const home = this.elementRef.nativeElement.querySelector(".home");
    home.classList.add("show")
    
  }

  SendIDForBackEnd(id:number){
    //console.log(`"id for product is :: "${id }`)
    let ProductDeleted = this.Categories.find(cat => cat.id === id);
    if(!ProductDeleted){}
    else{
      this.productnameDeleted=ProductDeleted.categoryName;
    }
    
    this.IdForDelete=id;
    console.log("id for deleted item  ...",this.IdForDelete)
  } 

  


  Delete(id: number) {
    const productToDelete = this.Categories.find(cat => cat.id === id);
    if (!productToDelete) {
      console.error('Product not found');
      return;
    }
    this.categoryserviceapi.delete(id).subscribe(
      () => {
        debugger
        this.Categories = this.Categories.filter(cat => cat.id !== id);
        Swal.fire({
          title: 'Success!',
          text: `Product "${productToDelete.categoryName}" deleted successfully`,
          icon: 'success'
        });
      },

    );

  }

  onFileSelectedImage(e:any){


    this.selectedFile = e.target.files[0] ;//as File

    if (this.selectedFile) {
      // Set the display of the image div to "block"
      //this.imageDiv.nativeElement.style.display = 'block';
    } else {
      // Handle no file selected scenario
    }
  
  
  
  
    const file: File = e.target.files[0];
    console.log("from on select Imaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaagggggggggggggggggeeeee")
    this.Category.patchValue({ catimagefile: file });
   //this.userRegister.controls['imagefile'].setValue(this.selectedFile); //this.selectedFile?.name
    var reader=new FileReader();
    reader.readAsDataURL(file);
    reader.onload=(event:any)=>{
      this.url=event.target.result;
    }
    console.log(this.Category.value)


  }
  
  SubmitCategory(){
    if(this.CategoryId>0){
      
      //const categoryId: number = parseInt(this.CategoryId?);
      this.categoryserviceapi.edit(this.CategoryId,this.Category.value).subscribe(
        {
          next: (response) => {
            console.log('Product created:', response.body.product);
            console.log('Message:', response.body.message);
            console.log('Url:', response.body.url);
            //const createdProductId = response.body.product.id; // Assuming the product ID is returned in the response
            const home = this.elementRef.nativeElement.querySelector(".home");
            home.classList.remove("show")

          },
          error: (err) => {
            console.log('Error:', err);
          }
        }
      );

    }else{
   
      this.categoryserviceapi.add(this.Category.value).subscribe(
        {
          next: (response) => {
            console.log('Product created:', response.body.product);
            console.log('Message:', response.body.message);
            console.log('Url:', response.body.url);
            //const createdProductId = response.body.product.id; // Assuming the product ID is returned in the response
            const home = this.elementRef.nativeElement.querySelector(".home");
            home.classList.remove("show")

          },
          error: (err) => {
            console.log('Error:', err);
          }
        }
      );

    }

  }



  GetCategForDetails(id:number){

    this.categoryserviceapi.getById(id).subscribe(
      (res:any)=>{
        console.log("Category For Details For Modal........",res)
        this.CategoryForDetails=res
        console.log("Reeeeeeeeeeeeeeeeeeeeeesssssssssssssssssssssssssssssssssss:::::::: ",this.CategoryForDetails)
        // const DetailsModel=this.elementRef.nativeElement.querySelector("#ModalForDetails")
        // const home2 = this.elementRef.nativeElement.querySelector(".home2");
        // home2.classList.add("show2")
        // const home2 = this.elementRef.nativeElement.querySelector(".home3");
        // home2.classList.add("show2");
        //This is the write code.............
        // const cartButton = document.getElementById("add__to__cart");
        // const dialogButton = document.getElementById("close__dialog");
        //cartButton?.click();
        // this.openDialog();
        // this.closeDialog()
        //const openModalForDetails=this.elementRef.nativeElement.querySelector("#form-open1");
        //openModalForDetails.click();
        // this.openModal();

        console.log("After Display Modal.........")

      }
    );



  }



  // isModalOpen: boolean = false;

  // openModal() {
  //   this.isModalOpen = true;
  // }

  // closeModal() {
  //   this.isModalOpen = false;
  // }


}
