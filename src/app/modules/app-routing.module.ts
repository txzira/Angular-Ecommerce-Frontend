import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsPageComponent } from './pages/products-page/products-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ProductDetailPageComponent } from './pages/product-detail-page/product-detail-page.component';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { CheckoutPageComponent } from './pages/checkout/checkout-page/checkout-page.component';
import { LoginPageComponent } from './pages/auth/login-page/login-page.component';
import { SignupPageComponent } from './pages/auth/signup-page/signup-page.component';
import { MyAccountPageComponent } from './pages/my-account-page/my-account-page.component';
import { VerifyEmailPageComponent } from './pages/auth/verify-email-page/verify-email-page.component';
import { LoginRedirectPageComponent } from './pages/auth/login-redirect-page/login-redirect-page.component';
import { UnauthorizedPageComponent } from './pages/auth/unauthorized-page/unauthorized-page.component';
import { AuthGuard } from '../core/guards/auth/auth.guard';
import { NotLoginedGuard } from '../core/guards/notlogined/notlogined.guard';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { AdminGuard } from '../core/guards/admin/admin.guard';
import { AdminProductsPageComponent } from './pages/admin/products/products.component';
import { AdminCustomersPageComponent } from './pages/admin/customers/customers.component';
import { AdminOrdersPageComponent } from './pages/admin/orders/orders.component';
import { AdminCategoriesPageComponent } from './pages/admin/categories/categories-page.component';
import { AdminAddCategoryPageComponent } from './pages/admin/categories/add-category-page/add-category-page.component';
import { AdminEditCategoryPageComponent } from './pages/admin/categories/edit-category-page/edit-category-page.component';
import { AdminAddProductPageComponent } from './pages/admin/products/add-product-page/add-product-page.component';
import { AdminEditProductPageComponent } from './pages/admin/products/edit-product/edit-product-page/edit-product-page.component';
import { AdminBrandsPageComponent } from './pages/admin/brands/brands-page.component';
import { CategoriesPageComponent } from './pages/categories/categories-page/categories-page.component';
import { CategoryPageComponent } from './pages/categories/category-page/category-page.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { SiteLayoutComponent } from './_layout/site-layout/site-layout.component';
import { AdminLayoutComponent } from './_layout/admin-layout/admin-layout.component';
import { CommerceLayoutComponent } from './_layout/commerce-layout/commerce-layout.component';
import { CategoryNavLayoutComponent } from './_layout/category-nav-layout/category-nav-layout.component';
import { AboutUsPageComponent } from './pages/about-us-page/about-us-page.component';
import { ContactPageComponent } from './pages/contact-page/contact-page.component';

const routes: Routes = [
  {
    //Main layout
    path: '',
    component: SiteLayoutComponent,
    children: [
      {
        //Admin  Layout
        path: 'admin',
        canActivate: [AuthGuard, AdminGuard],
        canActivateChild: [AuthGuard, AdminGuard],
        component: AdminLayoutComponent,
        children: [
          {
            path: '',
            component: AdminDashboardComponent,
          },
          {
            path: 'products',
            children: [
              {
                path: '',
                component: AdminProductsPageComponent,
              },
              { path: 'add', component: AdminAddProductPageComponent },
              {
                path: 'edit/:productId',
                component: AdminEditProductPageComponent,
              },
            ],
          },
          {
            path: 'customers',
            component: AdminCustomersPageComponent,
          },
          {
            path: 'orders',
            component: AdminOrdersPageComponent,
          },
          {
            path: 'categories',
            children: [
              {
                path: '',
                component: AdminCategoriesPageComponent,
              },
              {
                path: 'add',
                component: AdminAddCategoryPageComponent,
              },
              {
                path: 'edit/:categoryId',
                component: AdminEditCategoryPageComponent,
              },
            ],
          },
          {
            path: 'brands',
            component: AdminBrandsPageComponent,
          },
        ],
      },
      {
        path: '',
        component: CategoryNavLayoutComponent,
        children: [
          {
            path: 'products/:id',
            component: ProductDetailPageComponent,
          },
          { path: 'about-us', component: AboutUsPageComponent },
          {
            path: 'contact',
            component: ContactPageComponent,
          },
          {
            //Layout for pages that show product
            path: '',
            component: CommerceLayoutComponent,
            children: [
              { path: '', redirectTo: 'products', pathMatch: 'full' },
              { path: 'home', redirectTo: 'products' },

              {
                path: 'products',
                children: [{ path: '', component: ProductsPageComponent }],
              },
              {
                path: 'categories',
                children: [
                  { path: '', component: CategoriesPageComponent },
                  { path: ':categoryName', component: CategoryPageComponent },
                ],
              },
            ],
          },
        ],
      },
      //Routes with only site layout
      {
        path: 'my-account',
        component: MyAccountPageComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'auth',
        children: [
          { path: '', redirectTo: 'login', pathMatch: 'full' },
          { path: 'signup', component: SignupPageComponent },
          {
            path: 'login',
            component: LoginPageComponent,
            canActivate: [NotLoginedGuard],
          },
          { path: 'verify', component: VerifyEmailPageComponent },
          { path: 'login-redirect', component: LoginRedirectPageComponent },
          { path: 'unauthorized', component: UnauthorizedPageComponent },
        ],
      },
      { path: 'checkout', component: CheckoutPageComponent },

      { path: 'cart', component: CartPageComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
