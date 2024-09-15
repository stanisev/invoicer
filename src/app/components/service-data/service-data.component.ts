import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ClarityModule, ClrCommonFormsModule, ClrInputModule} from "@clr/angular";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Service} from "../../models/service.model";
import {NgForOf, NgIf} from "@angular/common";
import {v4 as uuidv4} from "uuid";
import {Client} from "../../models/client";

@Component({
  selector: 'app-service-data',
  standalone: true,
  imports: [
    ClrCommonFormsModule,
    ClrInputModule,
    FormsModule,
    ClarityModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './service-data.component.html',
  styleUrl: './service-data.component.css'
})
export class ServiceDataComponent {
  @Output() servicesChanged: EventEmitter<any[]> = new EventEmitter<any[]>();
  serviceModal = false;
  services: any[] = [];

  serviceFormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    quantity: new FormControl('', Validators.required),
    unitPrice: new FormControl('', Validators.required)
  })
  isSubmitting = false;

  openServiceModal(value: boolean): void {
    this.serviceModal = value;
  }

  async submit(): Promise<void> {
    if (this.serviceFormGroup.valid) {
      // this.addClientForm.reset();
    }
    this.isSubmitting = true;

    const formData = this.serviceFormGroup.value;
    const date = new Date().toLocaleDateString();
    const service = {...formData, date: date}
    this.servicesChanged.emit([service]);
    this.services.push(formData);

    this.isSubmitting = false;
    this.serviceFormGroup.reset();
    this.openServiceModal(false);
  }
}
