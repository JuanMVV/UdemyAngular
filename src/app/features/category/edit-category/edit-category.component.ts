import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';
import { UpdateCategoryRequest } from '../models/update-category-request.model';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent implements OnInit, OnDestroy {


  id: string | null = null;
  paramsSubscription?: Subscription;
  editCategorySubscription?: Subscription;

  category?: Category;


  constructor(private route: ActivatedRoute,
    private categoryService: CategoryService,
    private router: Router)  {

  }


  ngOnInit(): void {
    this.paramsSubscription = this.route.paramMap.subscribe({
      next: (params) => {
        this.id = params.get('id');
        if(this.id){
          //ibtenemos la data de la API
          this.categoryService.getCategoryById(this.id)
          .subscribe({
            next: (response) => {
              this.category = response;
            }
          });
        }
      }
    });
  }

  onFormSubmit(): void{
    //console.log(this.category);
    const updateCategoryRequest: UpdateCategoryRequest = {
      name: this.category?.name ?? '',
      urlHandle: this.category?.urlHandle ?? '' //si es null usa un string vacio
    };

    //pasamos ahora el objeto al servicio.
    if(this.id){
      this.editCategorySubscription = this.categoryService.updateCategory(this.id, updateCategoryRequest)
      .subscribe({
        next: (response) => {
          this.router.navigateByUrl('/admin/categories');
        }
      });
    }
  }


ngOnDestroy(): void {
  this.paramsSubscription?.unsubscribe();
  this.editCategorySubscription?.unsubscribe();
}

}