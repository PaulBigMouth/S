import { Observable } from 'rxjs';
import { Category } from './../shared/interfaces';
import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../shared/services/categories.service';

@Component({
	selector: 'app-categories-page',
	templateUrl: './categories-page.component.html',
	styleUrls: [ './categories-page.component.scss' ],
})
export class CategoriesPageComponent implements OnInit {
	categories$: Observable<Category[]>;

	constructor(private categoriesService: CategoriesService) {}

	ngOnInit(): void {
		this.categories$ = this.categoriesService.fetch();
	}
}
