import { Subscription } from 'rxjs';
import { AnalyticsPage } from './../shared/interfaces';
import { AnalyticsService } from './../shared/services/analytics.service';
import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
	selector: 'app-analytics-page',
	templateUrl: './analytics-page.component.html',
	styleUrls: [ './analytics-page.component.scss' ],
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {
	@ViewChild('gain') gainRef: ElementRef;
	@ViewChild('order') orderRef: ElementRef;

	oSub: Subscription;

	average: number;
	pending = true;

	constructor(private analyticsService: AnalyticsService) {}

	ngAfterViewInit() {
		const gainConfig: any = {
			label: 'Выручка',
			color: 'rgb(255,99,132)',
		};
		const orderConfig: any = {
			label: 'Заказы',
			color: 'rgb(54,162,235)',
		};

		this.oSub = this.analyticsService.getAnalytics().subscribe((data: AnalyticsPage) => {
			this.average = data.average;
			console.log(data);

			gainConfig.labels = data.chart.map((item) => item.label);
			gainConfig.data = data.chart.map((item) => item.gain);

			orderConfig.labels = data.chart.map((item) => item.label);
			orderConfig.data = data.chart.map((item) => item.order);

			// TEMPLATE
			// gainConfig.labels.push('13.05.2020');
			// gainConfig.labels.push('14.05.2020');
			// gainConfig.data.push(500);
			// gainConfig.data.push(800);

			// orderConfig.labels.push('13.05.2020');
			// orderConfig.labels.push('14.05.2020');
			// orderConfig.data.push(5);
			// orderConfig.data.push(8);

			const gainCtx = this.gainRef.nativeElement.getContext('2d');
			gainCtx.canvas.height = '300px';

			const orderCtx = this.orderRef.nativeElement.getContext('2d');
			orderCtx.canvas.height = '300px';
			new Chart(gainCtx, createChartConfig(gainConfig));
			new Chart(orderCtx, createChartConfig(orderConfig));

			this.pending = false;
		});
	}
	ngOnDestroy() {
		if (this.oSub) {
			this.oSub.unsubscribe();
		}
	}
}

function createChartConfig({ labels, data, label, color }) {
	return {
		type: 'line',
		options: {
			responsive: true,
		},
		data: {
			labels,
			datasets: [
				{
					label,
					data,
					borderColor: color,
					steppedLine: false,
					fill: false,
				},
			],
		},
	};
}
