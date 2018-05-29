import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MainLayoutComponent } from './app-layouts/main-layout.component';
import { EmptyLayoutComponent } from './app-layouts/empty-layout.component';
import { AuthLayoutComponent } from './app-layouts/auth-layout.component';
import { HeaderComponent } from './header/header.component';
import { NavigationComponent } from './navigation/navigation.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  imports: [CommonModule, FormsModule, RouterModule],
  declarations: [
    MainLayoutComponent,
    EmptyLayoutComponent,
    AuthLayoutComponent,
    HeaderComponent,
    NavigationComponent,
    BreadcrumbComponent,
    FooterComponent
  ],
  exports: [
    MainLayoutComponent,
    AuthLayoutComponent,
    HeaderComponent,
    NavigationComponent,
    BreadcrumbComponent,
    FooterComponent
  ]
})
export class LayoutModule {}
