import { Component, HostListener, OnInit } from '@angular/core';
import { Category } from 'src/app/core/models/category.model';
import { NavbarService } from 'src/app/core/services/navbar/navbar.service';
import { BrowserDetectorService } from 'src/app/core/services/user/broswer-detector/browser-detector.service';
import { CategoriesService } from 'src/app/core/services/user/categories/categories.service';

@Component({
  selector: 'app-category-nav',
  templateUrl: './category-nav.component.html',
})
export class CategoryNavComponent implements OnInit {
  categories: Array<Category> | undefined;

  isMobileDisplay: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobileDisplay = this.browserDetectorService.isMobile();
  }

  constructor(
    private navBarService: NavbarService,
    private categoriesService: CategoriesService,
    public browserDetectorService: BrowserDetectorService
  ) {}

  ngOnInit(): void {
    this.isMobileDisplay = this.browserDetectorService.isMobile();

    this.categoriesService.getParentCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  onIsOpenUpdated() {
    this.navBarService.changeIsOpen();
  }
}
