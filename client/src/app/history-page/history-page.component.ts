import { Subscription } from 'rxjs';
import { OrdersService } from './../shared/services/orders.service';
import { MaterialService } from './../shared/classes/material.service';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { MaterialInstance } from '../shared/classes/material.service';
import { Order, Filter } from '../shared/interfaces';

const STEP = 2;

@Component({
	selector: 'app-history-page',
	templateUrl: './history-page.component.html',
	styleUrls: [ './history-page.component.scss' ],
})
export class HistoryPageComponent implements OnInit, OnDestroy, AfterViewInit {
	isFilterVisible: boolean = false;
	@ViewChild('tooltip') tooltipRef: ElementRef;
	tooltip: MaterialInstance;
	oSub: Subscription;
	orders: Order[] = [];
	filter: Filter = {};

	offset = 0;
	limit = STEP;

	loading: boolean = false;
	reloading: boolean = false;

	noMoreOrders: boolean = false;

	constructor(private ordersService: OrdersService) {}

	ngOnInit(): void {
		this.reloading = true;
		this.fetch();
	}

	private fetch() {
		// const params = {
		// 	offset: this.offset,
		// 	limit: this.limit,
		// };
		// console.log(params);

		const params = Object.assign({}, this.filter, {
			offset: this.offset,
			limit: this.limit,
		});
		this.oSub = this.ordersService.fetch(params).subscribe((orders) => {
			this.orders = this.orders.concat(orders);
			this.noMoreOrders = orders.length < STEP;
			this.loading = false;
			this.reloading = false;
		});
	}

	isFiltered(): boolean {
		return Object.keys(this.filter).length !== 0;
	}

	ngAfterViewInit() {
		this.tooltip = MaterialService.initTooltip(this.tooltipRef);
	}
	ngOnDestroy() {
		this.tooltip.destroy();
		if (this.oSub) {
			this.oSub.unsubscribe();
		}
	}

	loadMore() {
		this.offset += STEP;
		this.loading = true;
		this.fetch();
	}

	applyFilter(filter: Filter) {
		this.orders = [];
		this.offset = 0;
		this.filter = filter;
		this.reloading = true;
		this.fetch();
	}
}
