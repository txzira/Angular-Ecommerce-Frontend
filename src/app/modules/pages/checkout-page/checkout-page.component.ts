import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Stripe, StripeElements, loadStripe } from '@stripe/stripe-js';
import { Subscription } from 'rxjs';
import { Cart, CartItem } from 'src/app/core/models/cart.model';
import { CartService } from 'src/app/core/services/user/cart/cart.service';
import { CheckoutService } from 'src/app/core/services/user/checkout/checkout.service';

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.css'],
})
export class CheckoutPageComponent implements OnInit, OnDestroy {
  private stripe!: Stripe | null;
  private clientSecretSubscription: Subscription | undefined;
  private orderSubscription: Subscription | undefined;
  private clientSecret: any;
  private elements: StripeElements | undefined;
  checkoutForm!: FormGroup;
  shippingForm!: any;
  billingForm: any | undefined;
  shippingSameAsBilling = true;
  disablePaymentButton = true;
  cart!: Cart;
  cartTotal: number = 0;
  stripeOrderTotal: number = 0;
  minimumCharged: boolean = false;

  constructor(
    private checkoutService: CheckoutService,
    private cartService: CartService,
    private fb: FormBuilder
  ) {
    this.cart = this.cartService.getCart();
    this.cartTotal = this.cartService.getTotal(this.cart.items);
    this.getClientSecret(this.cart.items);
  }

  async ngOnInit(): Promise<void> {
    this.stripe = await loadStripe(
      'pk_test_51JpGR9IZK4v7qkytzmvxTLa0C4AtaOLAaxGxWKBxc5CL1US3qFCf9pWfUPnc6OhkxL2Xv5s97uSjQAgv73KyDTWI006SYC716Q'
    );
    this.checkoutForm = this.fb.group({
      email: ['', [Validators.required]],
    });
  }

  receiveShippingForm(form: FormGroup): void {
    this.checkoutForm.setControl('shipping', this.fb.group(form.controls));
  }

  receiveBillingForm(form: FormGroup): void {
    this.checkoutForm.setControl('billing', this.fb.group(form.controls));
  }

  toggleBillingAddress(): void {
    this.shippingSameAsBilling = !this.shippingSameAsBilling;

    this.shippingSameAsBilling
      ? this.checkoutForm.removeControl('billing')
      : null;
  }

  submitPaymentForm(): void {
    if (this.checkoutForm.valid && !this.disablePaymentButton) {
      let form: { email: string; shipping: any; billing: any };
      form = this.checkoutForm.value;

      if (this.shippingSameAsBilling) {
        form.billing = form.shipping;
      }

      if (this.stripe) {
        this.orderSubscription = this.checkoutService
          .createOrder({ ...form.shipping, email: form.email }, this.cart.items)
          .subscribe();

        this.stripe
          .confirmPayment({
            elements: this.elements,
            clientSecret: this.clientSecret,
            confirmParams: {
              return_url: 'https://txzira-ecommerce.netlify.app/',
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
          })
          .then((result) => {
            if (result.error) {
              console.log(result.error);
              // deleted prisma created order/cart/cartItems
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
      .subscribe((response) => {
        if (this.stripe) {
          this.elements = this.stripe.elements({
            appearance: { theme: 'stripe' },
            clientSecret: response.clientSecret,
          });

          this.stripeOrderTotal = Number(response.orderTotal) / 100;
          this.minimumCharged = response.minimumCharged;
          console.log(this.minimumCharged);

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
            console.log(event);
            console.log(this.disablePaymentButton);
          });

          payment.mount('#payment-element');
        }
      });
  }
}
