import { MaterialService } from './../../shared/classes/material.service';
import { Order } from './../../shared/interfaces';
import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { MaterialInstance } from 'src/app/shared/classes/material.service';

@Component({
	selector: 'app-history-list',
	templateUrl: './history-list.component.html',
	styleUrls: [ './history-list.component.scss' ],
})
export class HistoryListComponent implements OnDestroy, AfterViewInit {
	@Input() orders: Order[];
	@ViewChild('modal') modalRef: ElementRef;

	selectedOrder: Order;
	modal: MaterialInstance;

	ngAfterViewInit() {
		this.modal = MaterialService.initModal(this.modalRef);
	}
	ngOnDestroy() {
		this.modal.destroy();
	}

	computePrice(order: Order): number {
		return order.list.reduce((total, item) => {
			return (total += item.quantity * item.cost);
		}, 0);
	}
	selectOrder(order: Order) {
		this.selectedOrder = order;
		this.modal.open();
	}
	closeModal() {
		this.modal.close();
	}
}
