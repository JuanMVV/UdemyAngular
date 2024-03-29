import { Injectable } from '@angular/core';
import { AddCategoryRequest } from '../models/add-category-request.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/category.model';
import { UpdateCategoryRequest } from '../models/update-category-request.model';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient,
    private cookieService: CookieService) { }

  addCategory(model: AddCategoryRequest): Observable<void> {
    //2da forma con los intepceptores para indicarle al servicio que necesita pasarle el token, solo se agrega
    //al final de la ruta ?addAuth=true, tal como esta declarado en el auth.interceptor.ts
    return this.http.post<void>('https://localhost:7296/api/categories?addAuth=true', model);
  }


  getAllCategories(): Observable<Category[]> {
    //return this.http.get<Category[]>(`${environment.apiBaseUrl}/api/categories`);
    //https://localhost:7296
    return this.http.get<Category[]>('https://localhost:7296/api/categories');
  }


  getCategoryById(id: string): Observable<Category>{
    return this.http.get<Category>(`https://localhost:7296/api/categories/${id}`);
  }
  //   getCategoryById(id: string): Observable<Category>{
  //   return this.http.get<Category>(`${environment.apiBaseUrl}/api/categories/${id}`);
  // }

  //estos metodos ahora necesitan el jwt token para poder aceptarlos el back  
  updateCategory(id: string, updateCategoryRequest: UpdateCategoryRequest): Observable<Category> {
    //1er forma de hacerlo agregar el headers a la ruta (no es lo mejor por que hay q repetir en todos los servicios que lo necesiten)
    // return this.http.put<Category>(`https://localhost:7296/api/categories/${id}`, updateCategoryRequest,    
    //   {headers: {
    //     'Authorization': this.cookieService.get('Authorization')
    //   }});


    //2da forma con los intepceptores
    return this.http.put<Category>(`https://localhost:7296/api/categories/${id}?addAuth=true`, updateCategoryRequest);



  }

  deleteCategory(id: string) : Observable<Category>{
    return this.http.delete<Category>(`https://localhost:7296/api/categories/${id}?addAuth=true`)
  }


}
