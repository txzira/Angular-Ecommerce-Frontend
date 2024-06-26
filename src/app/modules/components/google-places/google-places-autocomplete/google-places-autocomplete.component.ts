import {
  Component,
  ElementRef,
  Input,
  Output,
  OnInit,
  ViewChild,
  EventEmitter,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import countries from '../../../../../assets/countries.json';
import { ShippingMethod } from 'src/app/core/models/shippingMethod.model';

@Component({
  selector: 'app-google-places-autocomplete',
  templateUrl: './google-places-autocomplete.component.html',
  styleUrls: ['./google-places-autocomplete.component.css'],
})
export class GooglePlacesAutocompleteComponent implements OnInit {
  @ViewChild('inputField') inputField!: ElementRef;
  @Input() checkoutForm!: FormGroup;
  @Input() placeholder = '';
  @Input() title = '';
  @Input() phoneRequired = true;
  @Input() isShipping = true;
  @Output() formEvent = new EventEmitter<FormGroup>();
  @Output() selectCountryEvent = new EventEmitter<string>();

  form!: FormGroup;
  autocomplete: google.maps.places.Autocomplete | undefined;
  countriesList = countries;
  statesList: any[] = [];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      middleName: [''],
      lastName: ['', [Validators.required]],
      ...(this.phoneRequired
        ? { phone: ['', [Validators.required]] }
        : { phone: [''] }),
      country: ['', [Validators.required]],
      address1: ['', [Validators.required]],
      address2: [''],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
    });
    this.formEvent.emit(this.form);

    this.autocomplete = new google.maps.places.Autocomplete(
      this.inputField.nativeElement,
      {
        componentRestrictions: { country: 'us' },
        fields: ['address_component', 'adr_address', 'formatted_address'],
      }
    );
    this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete?.getPlace();
      if (place?.address_components) {
        const addrComponents = place.address_components;

        const streetAddressBuilderMap = new Map();
        const postalCodeBuilderMap = new Map();
        console.log(place.address_components);
        for (let i = 0; i < addrComponents.length; i++) {
          switch (addrComponents[i].types[0]) {
            case 'country':
              if (!this.isShipping)
                this.form.patchValue({
                  country: addrComponents[i].short_name,
                });
              break;
            case 'street_number':
              streetAddressBuilderMap.set(
                addrComponents[i].types[0],
                addrComponents[i].short_name
              );
              break;
            case 'route':
              streetAddressBuilderMap.set(
                addrComponents[i].types[0],
                addrComponents[i].short_name
              );
              break;
            case 'locality':
              this.form.patchValue({
                city: addrComponents[i].short_name,
              });
              break;
            case 'administrative_area_level_1':
              if (!this.isShipping)
                this.form.patchValue({
                  state: addrComponents[i].short_name,
                });
              break;
            case 'postal_code':
              postalCodeBuilderMap.set(
                addrComponents[i].types[0],
                addrComponents[i].short_name
              );

              break;
            case 'postal_code_suffix':
              postalCodeBuilderMap.set(
                addrComponents[i].types[0],
                addrComponents[i].short_name
              );
              break;
          }
        }

        if (streetAddressBuilderMap.size > 1) {
          this.form.patchValue({
            address1:
              streetAddressBuilderMap.get('street_number') +
              ' ' +
              streetAddressBuilderMap.get('route'),
          });
        } else {
          this.form.patchValue({
            address1: streetAddressBuilderMap.get('route'),
          });
        }

        if (postalCodeBuilderMap.size > 1) {
          this.form.patchValue({
            postalCode:
              postalCodeBuilderMap.get('postal_code') +
              '-' +
              postalCodeBuilderMap.get('postal_code_suffix'),
          });
        } else {
          this.form.patchValue({
            postalCode: postalCodeBuilderMap.get('postal_code'),
          });
        }
      }
      this.formEvent.emit(this.form);
    });
    // this.checkoutForm.addControl('shipping', this.form);
    // this.form.setParent(this.checkoutForm);
    // this.formEvent.emit(this.form);
    // this.form.valueChanges.subscribe((_form) => {
    //   this.formEvent.emit(_form);
    // });
  }

  showStates(event: any) {
    for (let i = 0; i < countries.length; i++) {
      if (event.value === countries[i].code) {
        this.statesList = countries[i].states;
      }
    }
  }

  selectCountry(event: any) {
    this.showStates(event);
    this.selectCountryEvent.emit(event.value);
  }

  ngAfterViewInit(): void {
    this.autocomplete = new google.maps.places.Autocomplete(
      this.inputField.nativeElement,
      {
        componentRestrictions: { country: 'us' },
        fields: ['address_component', 'adr_address', 'formatted_address'],
      }
    );
    google.maps.event.addListener(this.autocomplete, 'place_changed', () => {
      const place = this.autocomplete?.getPlace();
      if (place?.address_components) {
        const addrComponents = place.address_components;

        const streetAddressBuilderMap = new Map();
        const postalCodeBuilderMap = new Map();
        console.log(place.address_components);
        for (let i = 0; i < addrComponents.length; i++) {
          switch (addrComponents[i].types[0]) {
            case 'country':
              if (!this.isShipping)
                this.form.patchValue({
                  country: addrComponents[i].short_name,
                });
              break;
            case 'street_number':
              streetAddressBuilderMap.set(
                addrComponents[i].types[0],
                addrComponents[i].short_name
              );
              break;
            case 'route':
              streetAddressBuilderMap.set(
                addrComponents[i].types[0],
                addrComponents[i].short_name
              );
              break;
            case 'locality':
              this.form.patchValue({
                city: addrComponents[i].short_name,
              });
              break;
            case 'administrative_area_level_1':
              if (!this.isShipping)
                this.form.patchValue({
                  state: addrComponents[i].short_name,
                });
              break;
            case 'postal_code':
              postalCodeBuilderMap.set(
                addrComponents[i].types[0],
                addrComponents[i].short_name
              );

              break;
            case 'postal_code_suffix':
              postalCodeBuilderMap.set(
                addrComponents[i].types[0],
                addrComponents[i].short_name
              );
              break;
          }
        }

        if (streetAddressBuilderMap.size > 1) {
          this.form.patchValue({
            address1:
              streetAddressBuilderMap.get('street_number') +
              ' ' +
              streetAddressBuilderMap.get('route'),
          });
        } else {
          this.form.patchValue({
            address1: streetAddressBuilderMap.get('route'),
          });
        }

        if (postalCodeBuilderMap.size > 1) {
          this.form.patchValue({
            postalCode:
              postalCodeBuilderMap.get('postal_code') +
              '-' +
              postalCodeBuilderMap.get('postal_code_suffix'),
          });
        } else {
          this.form.patchValue({
            postalCode: postalCodeBuilderMap.get('postal_code'),
          });
        }
      }
      this.formEvent.emit(this.form);
    });
  }
}
