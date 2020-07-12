import { MaterialService } from './../shared/classes/material.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { AuthService } from '../shared/services/auth.service';
@Component({
	selector: 'app-register-page',
	templateUrl: './register-page.component.html',
	styleUrls: [ './register-page.component.scss' ],
})
export class RegisterPageComponent implements OnInit {
	form: FormGroup;
	aSub: Subscription;

	constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute) {}

	ngOnInit(): void {
		this.form = new FormGroup({
			email: new FormControl(null, [ Validators.required, Validators.email ]),
			password: new FormControl(null, [ Validators.required, Validators.minLength(6) ]),
		});

		this.route.queryParams.subscribe((params: Params) => {
			if (params['registered']) {
				// Теперь вы можете зайти в системы, используя свои данные
				MaterialService.toast('Теперь вы можете зайти в системы, используя свои данные');
			} else if (params['accessDenied']) {
				// Для начало авторизуйтесь в системе
				MaterialService.toast('Для начало авторизуйтесь в системе');
			}
		});
	}
	ngOnDestroy(): void {
		if (this.aSub) {
			this.aSub.unsubscribe();
		}
	}

	onSubmit() {
		this.form.disable();

		this.aSub = this.auth.register(this.form.value).subscribe(
			() =>
				this.router.navigate([ '/login' ], {
					queryParams: {
						registered: true,
					},
				}),
			(error) => {
				MaterialService.toast(error.error.message);
				this.form.enable();
			},
		);
	}
}
