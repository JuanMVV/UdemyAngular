import { Component, OnInit, ViewChild } from '@angular/core';
import { ImageService } from './image.service';
import { Observable } from 'rxjs';
import { BlogImage } from '../../models/blog-image.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-image-selector',
  templateUrl: './image-selector.component.html',
  styleUrls: ['./image-selector.component.css'],
})
export class ImageSelectorComponent implements OnInit {
  private file?: File;
  fileName: string = '';
  title: string = '';
  images$?: Observable<BlogImage[]>;

  //creamos una variable para manipular el form popup
  @ViewChild('form', { static: false }) imageUploadForm?: NgForm;

  //creamos el constructor para inyectar el servicio
  constructor(private imageService: ImageService) {}
  ngOnInit(): void {
    this.getImages();
  }

  onFileUploadChange(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    this.file = element.files?.[0];
  }

  selectImage(image: BlogImage): void {
    this.imageService.selectImage(image);
  }

  uploadImage(): void {
    if (this.file && this.fileName !== '' && this.title !== '') {
      //image service to upload the image
      this.imageService
        .uploadImage(this.file, this.fileName, this.title)
        .subscribe({
          next: (response) => {
            //usamos el viewchild para una vez que cargo la img correctamente lo limpie al formulario con el metodo resetForm().
            this.imageUploadForm?.resetForm();
            this.getImages();
          },
        });
    }
  }

  private getImages() {
    this.images$ = this.imageService.getAllImages();
  }
}
