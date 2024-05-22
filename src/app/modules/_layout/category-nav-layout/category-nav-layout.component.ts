import { Component, OnInit } from '@angular/core';
import { NavbarService } from 'src/app/core/services/navbar/navbar.service';
import { BrowserDetectorService } from 'src/app/core/services/user/broswer-detector/browser-detector.service';
import { Category } from 'src/app/core/models/category.model';
import { CategoriesService } from 'src/app/core/services/user/categories/categories.service';

@Component({
  selector: 'app-category-nav-layout',
  templateUrl: './category-nav-layout.component.html',
  styleUrls: ['./category-nav-layout.component.css'],
})
export class CategoryNavLayoutComponent implements OnInit {
  categories: Array<Category> | undefined;
  navBarIsOpen = false;
  constructor(
    public browserDetectorService: BrowserDetectorService,
    private navBarService: NavbarService,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.navBarService.isOpen.subscribe(
      (navBarIsOpen) => (this.navBarIsOpen = navBarIsOpen)
    );
    this.categoriesService.getParentCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }
  onIsOpenUpdated() {
    this.navBarService.changeIsOpen();
  }
}
