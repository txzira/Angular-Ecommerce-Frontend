import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Stripe, StripeElements, loadStripe } from '@stripe/stripe-js';
import { firstValueFrom, Subscription } from 'rxjs';
import { Cart, CartItem } from 'src/app/core/models/cart.model';
import { ShippingMethod } from 'src/app/core/models/shippingMethod.model';
import { BrowserDetectorService } from 'src/app/core/services/user/broswer-detector/browser-detector.service';
import { CartService } from 'src/app/core/services/user/cart/cart.service';
import { CheckoutService } from 'src/app/core/services/user/checkout/checkout.service';
import { ShippingMethodsService } from 'src/app/core/services/user/shipping-methods/shipping-methods.service';
import env from 'src/environments/environment';

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
})
export class CheckoutPageComponent implements OnInit, OnDestroy {
  private stripe!: Stripe | null;
  private clientSecretSubscription: Subscription | undefined;
  private orderSubscription: Subscription | undefined;
  private clientSecret: any;
  private elements: StripeElements | undefined;
  private paymentIntent: string = '';
  private taxCalculatedFlag = false;

  checkoutForm!: FormGroup;
  shippingSameAsBilling = false;
  disablePaymentButton = true;
  cart!: Cart;
  stripeOrderTotal: number = 0;
  minimumCharged: boolean = false;
  paymentError: any = null;
  isMobileDisplay: boolean = false;
  shippingMethods: ShippingMethod[] = [];
  selectedShippingMethod: ShippingMethod | undefined;
  calculatedTax: number | undefined;
  cartTotal: number = 0;
  response: any | undefined;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobileDisplay = this.browserDetectorService.isMobile();
  }

  constructor(
    private checkoutService: CheckoutService,
    private cartService: CartService,
    private shippingMethodService: ShippingMethodsService,
    private snackBar: MatSnackBar,
    private router: Router,
    public browserDetectorService: BrowserDetectorService
  ) {
    this.cart = this.cartService.getCart();
    this.cartTotal = this.cartService.getTotal(this.cart.cartItems);
    this.getClientSecret(this.cart.cartItems);
  }

  async ngOnInit(): Promise<void> {
    this.isMobileDisplay = this.browserDetectorService.isMobile();
    this.stripe = await loadStripe(
      'pk_test_51JpGR9IZK4v7qkytzmvxTLa0C4AtaOLAaxGxWKBxc5CL1US3qFCf9pWfUPnc6OhkxL2Xv5s97uSjQAgv73KyDTWI006SYC716Q'
    );
    this.checkoutForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  receiveCountrySelection(country: string): void {
    this.shippingMethodService
      .getShippingMethods(country)
      .subscribe((shippingMethods) => {
        this.shippingMethods = shippingMethods;
      });
  }

  toggleBillingAddress(): void {
    this.shippingSameAsBilling = !this.shippingSameAsBilling;

    if (this.shippingSameAsBilling) {
      const shippingForm = this.checkoutForm.get('shipping');
      this.checkoutForm.setControl(
        'billing',
        this.checkoutForm.get('shipping')
      );
    } else {
      this.checkoutForm.setControl(
        'billing',
        new FormGroup({
          firstName: new FormControl('', Validators.required),
          middleName: new FormControl(''),
          lastName: new FormControl('', Validators.required),
          phone: new FormControl(''),
          country: new FormControl('', Validators.required),
          address1: new FormControl('', Validators.required),
          address2: new FormControl(''),
          city: new FormControl('', Validators.required),
          state: new FormControl('', Validators.required),
          postalCode: new FormControl('', Validators.required),
        })
      );
    }
  }

  setShippingMethod(event: any) {
    this.selectedShippingMethod = event.value;
  }

  checkStep(event: any) {
    if (
      event.selectedIndex === 3 ||
      (event.selectedIndex !== 0 &&
        event.selectedIndex <= 3 &&
        this.taxCalculatedFlag)
    )
      this.checkoutService
        .calculateOrderTax(
          this.cart.cartItems,
          this.paymentIntent,
          this.selectedShippingMethod,
          this.checkoutForm.value?.shipping
        )
        .subscribe((response) => {
          this.stripeOrderTotal = Number(response.orderTotal) / 100;
          this.calculatedTax = Number(response.calculatedTax) / 100;
          this.taxCalculatedFlag = true;
        });
  }

  async submitPaymentForm() {
    if (this.checkoutForm.valid && !this.disablePaymentButton) {
      let form: { email: string; shipping: any; billing: any };
      form = this.checkoutForm.value;

      if (this.shippingSameAsBilling) {
        form.billing = form.shipping;
      }

      if (this.stripe) {
        const data = await firstValueFrom(
          this.checkoutService.createOrder(
            form.email,
            this.cart.cartItems,
            this.selectedShippingMethod!,
            this.calculatedTax,
            this.stripeOrderTotal,
            this.paymentIntent
          )
        );
        const orderId = data.order.id;

        this.stripe
          .confirmPayment({
            elements: this.elements,
            clientSecret: this.clientSecret,
            confirmParams: {
              return_url: env.production
                ? 'https://txzira-ecommerce.netlify.app/'
                : 'http://localhost:4200/',
              shipping: {
                name: `${form.shipping.firstName} ${
                  form.shipping.middleName ? form.shipping.middleName + ' ' : ''
                }${form.shipping.lastName}`,
                phone: form.shipping.phone,
                address: {
                  country: form.shipping.country,
                  line1: form.shipping.address1,
                  line2: form.shipping.address2,
                  city: form.shipping.city,
                  state: form.shipping.state,
                  postal_code: form.shipping.postalCode,
                },
              },
              payment_method_data: {
                billing_details: {
                  email: form.email,
                  name: `${form.billing.firstName} ${
                    form.billing.middleName ? form.billing.middleName + ' ' : ''
                  }${form.billing.lastName}`,
                  phone: form.billing.phone,
                  address: {
                    country: form.billing.country,
                    line1: form.billing.address1,
                    line2: form.billing.address2,
                    city: form.billing.city,
                    state: form.billing.state,
                    postal_code: form.billing.postalCode,
                  },
                },
              },
            },
            redirect: 'if_required',
          })
          .then((result) => {
            if (result.error) {
              console.log(result.error);
              // deleted prisma created order/cart/cartItems
            } else {
              if (
                result.paymentIntent.status === 'succeeded' ||
                result.paymentIntent.status === 'processing'
              ) {
                this.checkoutService
                  .updateOrder(
                    orderId,
                    form.shipping,
                    form.billing,
                    result.paymentIntent.id
                  )
                  .subscribe({
                    next: (response) => {
                      this.response = response;
                      this.cartService.clearCartFromCheckout();
                      this.router.navigate(['/checkout/order-confirmation'], {
                        queryParams: {
                          orderNumber: response.order.id,
                          email: response.order.email,
                        },
                      });
                    },
                  });
              } else {
                //failed
                this.snackBar.open('\u274cPayment Failed.', 'Ok', {
                  duration: 3000,
                });
              }
            }
          });
      } else {
        //Stripe not loaded related error
        console.log('Stripe Error');
      }
    } else {
      //notify user form not valid
      console.log('Form not valid.');
    }
  }

  ngOnDestroy(): void {
    this.clientSecretSubscription
      ? this.clientSecretSubscription.unsubscribe()
      : null;

    this.orderSubscription ? this.orderSubscription.unsubscribe() : null;
  }

  private getClientSecret(items: CartItem[]): void {
    this.clientSecretSubscription = this.checkoutService
      .getClientSecret(items)
      .subscribe({
        next: (response) => {
          if (this.stripe) {
            this.elements = this.stripe.elements({
              appearance: { theme: 'stripe' },
              clientSecret: response.clientSecret,
            });

            this.stripeOrderTotal = Number(response.orderTotal) / 100;
            this.minimumCharged = response.minimumCharged;
            this.paymentIntent = response.paymentIntent;

            const payment = this.elements.create('payment', {
              layout: 'tabs',
              fields: { billingDetails: 'never' },
            });

            payment.on('change', (event) => {
              if (!event.empty && event.complete) {
                //enable payment button
                this.disablePaymentButton = false;
              } else {
                //disable payment button
                this.disablePaymentButton = true;
              }
            });

            payment.mount('#payment-element');
          }
        },
        error: (response) => {
          this.paymentError = {
            message: response.error.message,
            products: JSON.parse(response.error.products),
          };
        },
      });
  }
}
