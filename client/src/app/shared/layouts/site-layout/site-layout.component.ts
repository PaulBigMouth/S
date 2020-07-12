import { AuthService } from '../../services/auth.service';
import { MaterialService } from './../../classes/material.service';

import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-site-layout',
	templateUrl: './site-layout.component.html',
	styleUrls: [ './site-layout.component.scss' ],
})
export class SiteLayoutComponent implements AfterViewInit {
	@ViewChild('floaiting') floatingref: ElementRef;

	links = [
		{ url: '/overview', name: 'Обзор' },
		{ url: '/analytics', name: 'Аналитика' },
		{ url: '/history', name: 'История' },
		{ url: '/order', name: 'Добавление заказа' },
		{ url: '/categories', name: 'Ассортимент' },
	];

	constructor(private authService: AuthService, private router: Router) {}

	ngAfterViewInit() {
		MaterialService.inializeFloatingButtons(this.floatingref);
	}

	logout(event: Event) {
		event.preventDefault();
		this.authService.logout();
		this.router.navigate([ '/login' ]);
	}
}
