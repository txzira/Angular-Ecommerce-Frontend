import { Pipe, PipeTransform } from '@angular/core';
import { ProductVariantAttribute } from 'src/app/core/models/product.model';

@Pipe({
  name: 'colorFirstAttribute',
})
export class ColorFirstAttributePipe implements PipeTransform {
  transform(value: ProductVariantAttribute[], ...args: unknown[]): any[] {
    const productVariantAttributes = value.map((productVariantAttribute) => {
      return { ...productVariantAttribute };
    });
    for (let i = 0; i < productVariantAttributes.length; i++) {
      if (
        ['style', 'styles', 'color', 'colors'].includes(
          value[i].attributeGroup.name.toLowerCase()
        )
      ) {
        return [
          productVariantAttributes.splice(i, 1)[0],
          ...productVariantAttributes,
        ];
      }
    }
    console.log(value);
    return productVariantAttributes;
  }
}
