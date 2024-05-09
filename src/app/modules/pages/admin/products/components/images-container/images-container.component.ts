import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-images-container',
  templateUrl: './images-container.component.html',
})
export class ImagesContainerComponent {
  @Output() imagesEvent = new EventEmitter<
    Array<{
      id?: number;
      imageName: string;
      imagePath?: string | ArrayBuffer | null | undefined;
      url?: string;
    }>
  >();
  @Input() images: {
    id?: number;
    imageName: string;
    imagePath?: string | ArrayBuffer | null | undefined;
    url?: string;
  }[] = [];
  @Input() uniqueId = '';

  dropImage(
    event: CdkDragDrop<
      {
        imageName: string;
        imagePath: string | ArrayBuffer | null | undefined;
      }[]
    >
  ) {
    moveItemInArray(this.images, event.previousIndex, event.currentIndex);
  }

  async handleImage(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    await this.setFileToBase(file);
  }
  handleImages(event: Event) {
    const files = (event.target as HTMLInputElement).files;

    Array.from(files || []).map(async (file, i) => {
      await this.setFileToBase(file);
    });
    this.imagesEvent.emit(this.images);
  }

  private setFileToBase(file: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = (event) => {
        this.images.push({
          imageName: file.name,
          imagePath: event.target?.result,
        });
        resolve();
      };
    });
  }
}
