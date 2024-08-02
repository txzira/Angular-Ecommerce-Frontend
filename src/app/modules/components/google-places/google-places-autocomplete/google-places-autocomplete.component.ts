import {
  Component,
  ElementRef,
  Input,
  Output,
  OnInit,
  ViewChild,
  EventEmitter,
  inject,
  OnDestroy,
} from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import countries from '../../../../../assets/countries.json';

@Component({
  selector: 'app-google-places-autocomplete',
  templateUrl: './google-places-autocomplete.component.html',
  styleUrls: ['./google-places-autocomplete.component.css'],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
})
export class GooglePlacesAutocompleteComponent implements OnInit, OnDestroy {
  @ViewChild('map', { static: false }) mapElement!: ElementRef;
  @Input() placeholder = '';
  @Input() title = '';
  @Input() phoneRequired = true;
  @Input() isShipping = true;
  @Input({ required: true }) controlKey = '';
  @Output() selectCountryEvent = new EventEmitter<string>();
  parentContainer = inject(ControlContainer);
  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  autocomplete: google.maps.places.Autocomplete | undefined;
  countriesList = countries;
  statesList: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.parentFormGroup.addControl(
      this.controlKey,
      new FormGroup({
        firstName: new FormControl('', Validators.required),
        middleName: new FormControl(''),
        lastName: new FormControl('', Validators.required),
        ...(this.phoneRequired
          ? { phone: new FormControl('', Validators.required) }
          : { phone: new FormControl('') }),
        country: new FormControl('', Validators.required),
        address1: new FormControl('', Validators.required),
        address2: new FormControl(''),
        city: new FormControl('', Validators.required),
        state: new FormControl('', Validators.required),
        postalCode: new FormControl('', Validators.required),
      })
    );

    this.autocomplete = new google.maps.places.Autocomplete(
      this.mapElement.nativeElement,
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
                this.parentFormGroup.get(this.controlKey)?.patchValue({
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
              this.parentFormGroup.get(this.controlKey)?.patchValue({
                city: addrComponents[i].short_name,
              });
              break;
            case 'administrative_area_level_1':
              if (!this.isShipping)
                this.parentFormGroup.get(this.controlKey)?.patchValue({
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
          this.parentFormGroup.get(this.controlKey)?.patchValue({
            address1:
              streetAddressBuilderMap.get('street_number') +
              ' ' +
              streetAddressBuilderMap.get('route'),
          });
        } else {
          this.parentFormGroup.get(this.controlKey)?.patchValue({
            address1: streetAddressBuilderMap.get('route'),
          });
        }

        if (postalCodeBuilderMap.size > 1) {
          this.parentFormGroup.get(this.controlKey)?.patchValue({
            postalCode:
              postalCodeBuilderMap.get('postal_code') +
              '-' +
              postalCodeBuilderMap.get('postal_code_suffix'),
          });
        } else {
          this.parentFormGroup.get(this.controlKey)?.patchValue({
            postalCode: postalCodeBuilderMap.get('postal_code'),
          });
        }
      }
    });
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
      this.mapElement.nativeElement,
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
        for (let i = 0; i < addrComponents.length; i++) {
          switch (addrComponents[i].types[0]) {
            case 'country':
              if (!this.isShipping)
                this.parentFormGroup.get(this.controlKey)?.patchValue({
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
              this.parentFormGroup.get(this.controlKey)?.patchValue({
                city: addrComponents[i].short_name,
              });
              break;
            case 'administrative_area_level_1':
              if (!this.isShipping)
                this.parentFormGroup.get(this.controlKey)?.patchValue({
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
          this.parentFormGroup.get(this.controlKey)?.patchValue({
            address1:
              streetAddressBuilderMap.get('street_number') +
              ' ' +
              streetAddressBuilderMap.get('route'),
          });
        } else {
          this.parentFormGroup.get(this.controlKey)?.patchValue({
            address1: streetAddressBuilderMap.get('route'),
          });
        }

        if (postalCodeBuilderMap.size > 1) {
          this.parentFormGroup.get(this.controlKey)?.patchValue({
            postalCode:
              postalCodeBuilderMap.get('postal_code') +
              '-' +
              postalCodeBuilderMap.get('postal_code_suffix'),
          });
        } else {
          this.parentFormGroup.get(this.controlKey)?.patchValue({
            postalCode: postalCodeBuilderMap.get('postal_code'),
          });
        }
      }
    });
  }

  ngOnDestroy() {
    this.parentFormGroup.removeControl(this.controlKey);
  }
}
