import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Position, Message } from './../../../shared/interfaces';
import { MaterialService, MaterialInstance } from './../../../shared/classes/material.service';
import { PositionsService } from './../../../shared/services/positions.service';
import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
	selector: 'app-positions-form',
	templateUrl: './positions-form.component.html',
	styleUrls: [ './positions-form.component.scss' ],
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {
	@Input('categoryId') categoryId: string;
	@ViewChild('modal') modalRef: ElementRef;
	positions: Position[] = [];
	loading = false;
	positionId = null;
	modal: MaterialInstance;
	form: FormGroup;

	constructor(private positionsService: PositionsService) {}

	ngOnInit(): void {
		this.form = new FormGroup({
			name: new FormControl(null, Validators.required),
			cost: new FormControl(1, [ Validators.required, Validators.min(1) ]),
		});

		this.loading = true;
		this.positionsService.fetch(this.categoryId).subscribe((positions) => {
			this.positions = positions;
			this.loading = false;
		});
	}

	ngAfterViewInit() {
		this.modal = MaterialService.initModal(this.modalRef);
	}
	ngOnDestroy() {
		this.modal.destroy();
	}

	onSelectPosition(position: Position) {
		this.positionId = position._id;
		this.form.patchValue({
			name: position.name,
			cost: position.cost,
		});
		this.modal.open();
		MaterialService.updateTextInputs();
	}
	onAddPosition() {
		this.positionId = null;
		this.form.reset({
			name: null,
			cost: 1,
		});
		this.modal.open();
		MaterialService.updateTextInputs();
	}
	onCancel() {
		this.modal.close();
	}
	onSubmit() {
		this.form.disable();

		const newPosition: Position = {
			name: this.form.value.name,
			cost: this.form.value.cost,
			category: this.categoryId,
		};

		const completed = () => {
			this.modal.close();
			this.form.reset({ name: null, cost: 1 });
			this.form.enable();
		};

		if (this.positionId) {
			newPosition._id = this.positionId;
			this.positionsService.update(newPosition).subscribe(
				(position) => {
					const idx = this.positions.findIndex((p) => p._id === position._id);
					this.positions[idx] = position;
					MaterialService.toast('Изменения сохранены');
				},
				(error) => {
					this.form.enable();
					MaterialService.toast(error.error.message);
				},
				completed,
			);
		} else {
			this.positionsService.create(newPosition).subscribe(
				(position) => {
					MaterialService.toast('Позиция была создана');
					this.positions.push(position);
				},
				(err) => {
					this.form.enable();
					MaterialService.toast(err.error.message);
				},
				completed,
			);
		}
	}
	onDeletePosition(event, position: Position) {
		event.stopPropagation();
		const decision = window.confirm(`Вы действительно хотите удалить позицию ${position.name}`);

		if (decision) {
			this.positionsService.delete(position).subscribe(
				(response) => {
					const idx = this.positions.findIndex((p) => p._id === position._id);
					this.positions.splice(idx, 1);
					MaterialService.toast(response.message);
				},
				(error) => MaterialService.toast(error.error.message),
			);
		}
	}
}
