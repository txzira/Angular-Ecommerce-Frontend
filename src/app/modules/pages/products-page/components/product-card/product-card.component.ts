import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Attribute, Product } from 'src/app/core/models/product.model';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent implements OnInit {
  @Input() fullWidthMode = false;
  @Input() product: Product | undefined;
  displayImage: string | undefined;

  colors!: Attribute[];
  queryParams: any;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    console.log(this.product);
    if (this.product && this.product.attributeGroups) {
      this.displayImage = this.product?.images?.[0]?.url;
      for (let i = 0; i < this.product.attributeGroups.length; i++) {
        if (
          this.product.attributeGroups[i].name.toLowerCase() === 'colors' ||
          this.product.attributeGroups[i].name.toLowerCase() === 'styles'
        ) {
          this.colors = this.product.attributeGroups[i].attributes!;
        }
      }
    }
  }

  hoverImg(imageUrl: string, color: string): void {
    if (this.product && this.product.images) {
      this.displayImage = imageUrl;
    }
    this.queryParams = { color };
  }
}
