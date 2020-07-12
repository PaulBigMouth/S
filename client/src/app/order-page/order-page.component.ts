import { Subscription } from 'rxjs';
import { OrdersService } from './../shared/services/orders.service';
import { OrderPosition, Order } from './../shared/interfaces';
import { MaterialService, MaterialInstance } from './../shared/classes/material.service';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { OrderService } from './order.service';

@Component({
	selector: 'app-order-page',
	templateUrl: './order-page.component.html',
	styleUrls: [ './order-page.component.scss' ],
})
export class OrderPageComponent implements OnInit, OnDestroy, AfterViewInit {
	@ViewChild('modal') modalRef: ElementRef;
	isRoot: boolean;
	oSub: Subscription;
	modal: MaterialInstance;
	pending: boolean = false;

	constructor(private router: Router, public orderService: OrderService, private ordersService: OrdersService) {}

	ngOnInit(): void {
		this.isRoot = this.router.url === '/order';
		this.router.events.subscribe((event) => {
			if (event instanceof NavigationEnd) {
				this.isRoot = this.router.url === '/order';
			}
		});
	}
	ngOnDestroy() {
		this.modal.destroy();
		if (this.oSub) {
			this.oSub.unsubscribe();
		}
	}
	ngAfterViewInit() {
		this.modal = MaterialService.initModal(this.modalRef);
	}
	open() {
		this.modal.open();
	}
	cancel() {
		this.modal.close();
	}
	submit() {
		this.pending = true;
		const order: Order = {
			list: this.orderService.list.map((item) => {
				delete item._id;
				return item;
			}),
		};

		this.oSub = this.ordersService.create(order).subscribe(
			(newOrder) => {
				MaterialService.toast(`Заказ №${newOrder.order} был добавлен`);
				this.orderService.clear();
			},
			(error) => MaterialService.toast(error.error.message),
			() => {
				this.modal.close();
				this.pending = false;
			},
		);
	}
	removePosition(orderPosition: OrderPosition) {
		this.orderService.remove(orderPosition);
	}
}
