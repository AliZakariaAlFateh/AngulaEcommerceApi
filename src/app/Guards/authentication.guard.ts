import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../Services/AccountService';

export const authenticationGuard: CanActivateFn = (route, state) => {
  //var accountservice=inject(AccountService).isAuthenticated(); //true
  var accountservice=inject(AccountService);
  //we need to inject for router to make navigate to the login  when the user call dashboardproduct page
  if(!accountservice.isAuthenticated())inject(Router).navigate(['/home/login'])
  return accountservice.isAuthenticated(); //true
  //return true;
};
