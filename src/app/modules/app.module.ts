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

import { ProductCardComponent } from './pages/products-page/components/product-card/product-card.component';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { LoginPageComponent } from './pages/auth/login-page/login-page.component';
import { SignupPageComponent } from './pages/auth/signup-page/signup-page.component';
import { MyAccountPageComponent } from './pages/my-account-page/my-account-page.component';
import { CartComponent } from './components/cart/cart.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductsHeaderComponent } from './_layout/components/products-header/products-header.component';

import { CheckoutPageComponent } from './pages/checkout/checkout-page/checkout-page.component';
import { GooglePlacesAutocompleteComponent } from './components/google-places/google-places-autocomplete/google-places-autocomplete.component';
import { FormsModule } from '@angular/forms';

import { AuthInterceptor } from '../core/interceptors/auth/auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { GoogleButtonComponent } from './components/google-button/google-button.component';
import { VerifyEmailPageComponent } from './pages/auth/verify-email-page/verify-email-page.component';
import { ForgotPasswordPageComponent } from './pages/auth/forgot-password-page/forgot-password-page.component';
import { LoginRedirectPageComponent } from './pages/auth/login-redirect-page/login-redirect-page.component';
import { UnauthorizedPageComponent } from './pages/auth/unauthorized-page/unauthorized-page.component';
import { OrderDetailModalComponent } from './pages/my-account-page/components/order-detail-modal/order-detail-modal.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { AdminNavbarComponent } from './_layout/admin-layout/components/admin-navbar/admin-navbar.component';
import { AdminProductsPageComponent } from './pages/admin/products/products-page.component';
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
import { CategoryNavLayoutComponent } from './_layout/category-nav-layout/category-nav-layout.component';
import { OrderConfirmationPageComponent } from './pages/checkout/order-confirmation-page/order-confirmation-page.component';
import { ContactPageComponent } from './pages/contact-page/contact-page.component';
import { AboutUsPageComponent } from './pages/about-us-page/about-us-page.component';
import { CategoryNavComponent } from './_layout/components/category-nav/category-nav.component';
import { NavCartButtonComponent } from './_layout/components/nav-bar/components/nav-cart-button/nav-cart-button.component';
import { NavLoginButtonComponent } from './_layout/components/nav-bar/components/nav-login-button/nav-login-button.component';
import { NavBarComponent } from './_layout/components/nav-bar/nav-bar.component';
import { AdminShippingMethodsComponent } from './pages/admin/shipping-method/shipping-method-page.component';
import { AdminAddShippingMethodModalComponent } from './pages/admin/shipping-method/components/add-shipping-method-modal/add-shipping-method-modal.component';
import { AdminEditShippingMethodModalComponent } from './pages/admin/shipping-method/components/edit-shipping-method-modal/edit-shipping-method-modal.component';
import { AdminDeleteShippingMethodModalComponent } from './pages/admin/shipping-method/components/delete-shipping-method-modal/delete-shipping-method-modal.component';
import { NavCartModalComponent } from './_layout/components/nav-bar/components/nav-cart-button/components/nav-cart-modal/nav-cart-modal.component';
import { CapitalizeFirstLetterPipe } from '../shared/pipes/capitalize-first-letter/capitalize-first-letter.pipe';
import { ColorFirstAttributePipe } from '../shared/pipes/color-first-attribute/color-first-attribute.pipe';
import { ResetPasswordPageComponent } from './pages/auth/reset-password-page/reset-password-page.component';

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
    CategoryNavLayoutComponent,
    OrderConfirmationPageComponent,
    ContactPageComponent,
    AboutUsPageComponent,
    CategoryNavComponent,
    AdminShippingMethodsComponent,
    AdminAddShippingMethodModalComponent,
    AdminEditShippingMethodModalComponent,
    AdminDeleteShippingMethodModalComponent,
    NavCartModalComponent,
    CapitalizeFirstLetterPipe,
    ColorFirstAttributePipe,
    ResetPasswordPageComponent,
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
