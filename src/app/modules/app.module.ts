import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../shared/material.module';
import { AppRoutingModule } from './app-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { ProductsPageComponent } from './pages/products-page/products-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ProductDetailPageComponent } from './pages/product-detail-page/product-detail-page.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { ProductCardComponent } from './pages/products-page/components/product-card/product-card.component';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { LoginPageComponent } from './pages/auth/login-page/login-page.component';
import { SignupPageComponent } from './pages/auth/signup-page/signup-page.component';
import { MyAccountPageComponent } from './pages/my-account-page/my-account-page.component';
import { CartComponent } from './components/cart/cart.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CategoryNavComponent } from './components/category-nav/category-nav.component';
import { ProductsHeaderComponent } from './components/products-header/products-header.component';
import { NavCartButtonComponent } from './components/nav-bar/components/nav-cart-button/nav-cart-button.component';
import { CheckoutPageComponent } from './pages/checkout-page/checkout-page.component';
import { GooglePlacesAutocompleteComponent } from './components/google-places/google-places-autocomplete/google-places-autocomplete.component';
import { FormsModule } from '@angular/forms';
import { NavLoginButtonComponent } from './components/nav-bar/components/nav-login-button/nav-login-button.component';
import { AuthInterceptor } from '../core/interceptors/auth/auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { GoogleButtonComponent } from './components/google-button/google-button.component';
import { VerifyEmailPageComponent } from './pages/auth/verify-email-page/verify-email-page.component';
import { ForgotPasswordPageComponent } from './pages/auth/forgot-password-page/forgot-password-page.component';
import { LoginRedirectPageComponent } from './pages/auth/login-redirect-page/login-redirect-page.component';
import { UnauthorizedPageComponent } from './pages/auth/unauthorized-page/unauthorized-page.component';
import { OrderDetailModalComponent } from './pages/my-account-page/components/order-detail-modal/order-detail-modal.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { AdminNavbarComponent } from './pages/admin/components/admin-navbar/admin-navbar.component';
import { AdminProductsPageComponent } from './pages/admin/products/products.component';
import { AdminOrdersPageComponent } from './pages/admin/orders/orders.component';
import { AdminCustomersPageComponent } from './pages/admin/customers/customers.component';
import { AdminCategoriesPageComponent } from './pages/admin/categories/categories-page.component';
import { AdminAddCategoryPageComponent } from './pages/admin/categories/add-category-page/add-category-page.component';
import { AdminEditCategoryPageComponent } from './pages/admin/categories/edit-category-page/edit-category-page.component';
import { AdminAddProductPageComponent } from './pages/admin/products/add-product-page/add-product-page.component';
import { AdminEditProductPageComponent } from './pages/admin/products/edit-product/edit-product-page/edit-product-page.component';
import { AdminBrandsPageComponent } from './pages/admin/brands/brands-page.component';
import { AdminAddBrandModalComponent } from './pages/admin/brands/components/add-brand-modal/add-brand-modal.component';
import { AdminEditBrandModalComponent } from './pages/admin/brands/components/edit-brand-modal/edit-brand-modal.component';
import { AdminDeleteBrandModalComponent } from './pages/admin/brands/components/delete-brand-modal/delete-brand-modal.component';
import { AdminDeleteCategoyModalComponent } from './pages/admin/categories/components/delete-categoy-modal/delete-categoy-modal.component';
import { AdminDeleteProductModalComponent } from './pages/admin/products/components/delete-product-modal/delete-product-modal.component';
import { CategoriesPageComponent } from './pages/categories/categories-page/categories-page.component';
import { CategoryPageComponent } from './pages/categories/category-page/category-page.component';
import { SiteLayoutComponent } from './_layout/site-layout/site-layout.component';
import { AdminLayoutComponent } from './_layout/admin-layout/admin-layout.component';
import { CommerceLayoutComponent } from './_layout/commerce-layout/commerce-layout.component';
import { AdminVariantsModalComponent } from './pages/admin/products/edit-product/components/variants-modal/variants-modal.component';
import { AdminEditVariantModalComponent } from './pages/admin/products/edit-product/components/edit-variant-modal/edit-variant-modal.component';
import { AdminEditAttributeGroupModalComponent } from './pages/admin/products/edit-product/components/edit-attribute-group-modal/edit-attribute-group-modal.component';
import { ImagesContainerComponent } from './pages/admin/products/components/images-container/images-container.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductsPageComponent,
    HomePageComponent,
    ProductDetailPageComponent,
    NavBarComponent,
    ProductCardComponent,
    CartPageComponent,
    LoginPageComponent,
    SignupPageComponent,
    MyAccountPageComponent,
    CartComponent,
    CategoryNavComponent,
    ProductsHeaderComponent,
    NavCartButtonComponent,
    CheckoutPageComponent,
    GooglePlacesAutocompleteComponent,
    NavLoginButtonComponent,
    GoogleButtonComponent,
    VerifyEmailPageComponent,
    ForgotPasswordPageComponent,
    LoginRedirectPageComponent,
    UnauthorizedPageComponent,
    OrderDetailModalComponent,
    AdminDashboardComponent,
    AdminNavbarComponent,
    AdminProductsPageComponent,
    AdminOrdersPageComponent,
    AdminCustomersPageComponent,
    AdminCategoriesPageComponent,
    AdminAddCategoryPageComponent,
    AdminEditCategoryPageComponent,
    AdminAddProductPageComponent,
    AdminEditProductPageComponent,
    AdminBrandsPageComponent,
    AdminAddBrandModalComponent,
    AdminEditBrandModalComponent,
    AdminDeleteBrandModalComponent,
    AdminDeleteCategoyModalComponent,
    AdminDeleteProductModalComponent,
    CategoriesPageComponent,
    CategoryPageComponent,
    SiteLayoutComponent,
    AdminLayoutComponent,
    CommerceLayoutComponent,
    AdminVariantsModalComponent,
    AdminEditVariantModalComponent,
    AdminEditAttributeGroupModalComponent,
    ImagesContainerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
