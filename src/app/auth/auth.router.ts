import { Routes } from "@angular/router";
import { Component } from '@angular/core';
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";

export const AUTH_ROUTE: Routes = [
  {
    path: 'auth/login',
    component: LoginComponent
  },
  {
    path: 'auth/register',
    component: RegisterComponent
  }
];
