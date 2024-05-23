import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './Component/Shared/navbar/navbar.component';
import { FooterComponent } from './Component/Shared/footer/footer.component';
import { AsideComponent } from './Component/Shared/aside/aside.component';
import { HomeComponent } from './Component/Core/home/home.component';
import { ProductsComponent } from './Component/Core/products/products.component';
import { ContactComponent } from './Component/Core/contact/contact.component';
import { NotfoundComponent } from './Component/Core/notfound/notfound.component';
import { DashboardComponent } from './Component/Core/dashboard/dashboard.component';
import { LayoutComponent } from './Component/Shared/layout/layout.component';
import { ProductCrudComponent } from './Component/Core/product-crud/product-crud.component';
import { ProductFormComponent } from './Component/Core/product-form/product-form.component';
import { ProductDetailsComponent } from './Component/Core/product-details/product-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from './Component/Core/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { LoadingSpinnerComponent } from './Component/Core/loading-spinner/loading-spinner.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoginFormComponent } from './Component/Core/login-form/login-form.component';
import { TokeniterceptorService } from './Services/tokeniterceptor.service';
import { CategoryComponent } from './Component/Core/category/category.component';
import { ModalComponent } from './Component/Shared/modal/modal.component';
import { UnauthorizedcomponentComponent } from './Component/Shared/unauthorizedcomponent/unauthorizedcomponent.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    AsideComponent,
    HomeComponent,
    ProductsComponent,
    ContactComponent,
    NotfoundComponent,
    DashboardComponent,
    LayoutComponent,
    ProductCrudComponent,
    ProductFormComponent,
    ProductDetailsComponent,
    DeleteConfirmationDialogComponent,
    LoadingSpinnerComponent,
    LoginFormComponent,
    CategoryComponent,
    ModalComponent,
    UnauthorizedcomponentComponent,
   

  ],
  imports: [
    AppRoutingModule,
    RouterModule,
    BrowserModule,
    //for turn on ngModel
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    MatDialogModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule
    
  ],
  providers: [{provide:HTTP_INTERCEPTORS,useClass:TokeniterceptorService,multi:true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
