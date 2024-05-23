import { ProductCrudComponent } from './Component/Core/product-crud/product-crud.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Component/Core/home/home.component';
import { DashboardComponent } from './Component/Core/dashboard/dashboard.component';
import { NotfoundComponent } from './Component/Core/notfound/notfound.component';
import { LayoutComponent } from './Component/Shared/layout/layout.component';
import { ProductsComponent } from './Component/Core/products/products.component';
import { ContactComponent } from './Component/Core/contact/contact.component';
import { ProductDetailsComponent } from './Component/Core/product-details/product-details.component';
import { ProductFormComponent } from './Component/Core/product-form/product-form.component';
import { LoginFormComponent } from './Component/Core/login-form/login-form.component';
import { authenticationGuard } from './Guards/authentication.guard';
import { CategoryComponent } from './Component/Core/category/category.component';
import { UnauthorizedcomponentComponent } from './Component/Shared/unauthorizedcomponent/unauthorizedcomponent.component';

//home/products

const routes: Routes = [
  {path:'',component:LayoutComponent},
  {path:'layout',redirectTo:''},
  {path:'contact',component:ContactComponent},
  {path:'products',component:ProductsComponent},
  {path:'products/details/:id',component:ProductDetailsComponent},
  {path:'products/edit/:id',component:ProductFormComponent},
  {path:'products/add',component:ProductFormComponent},
  {path:'dashboard',component:DashboardComponent,children:[
    // {path:'product',component:ProductsComponent}
    {path:'products/details/:id',component:ProductDetailsComponent},
    {path:'products/add',component:ProductFormComponent},
    {path:'products/edit/:id',component:ProductFormComponent},
    {path:'productDashboard',component:ProductCrudComponent,canActivate:[authenticationGuard]},
    {path:'category',component:CategoryComponent},
    {path:'unauthorized',component:UnauthorizedcomponentComponent},

]},
  // {path:'product',component:ProductsComponent},
  {path:'home',component:LayoutComponent,children:[
       {path:'products',component:ProductsComponent},
       {path:'contact',component:ContactComponent},
       {path:'login',component:LoginFormComponent},
       //home/products/details
       {path:'products/details/:id',component:ProductDetailsComponent},
       {path:'products/add',component:ProductFormComponent},
       {path:'products/edit/:id',component:ProductFormComponent},
       //{path:'home/addproduct',component:ProductFormComponent},
  ]},
  //ليه ما نفعت يا حمزاوى
//   {path:'home',component:ProductsComponent,children:[
//     {path:'products/add',component:ProductFormComponent},
// ]},
  // {path:'productDashboard',component:ProductCrudComponent},
  
  {path:'**',component:NotfoundComponent},
  
  //   {path:'home',component:ProductsComponent,children:[
//     {path:'products/add',component:ProductFormComponent},
// ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
