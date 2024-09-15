import { Component } from '@angular/core';
import { ClarityModule, ClrFormsModule } from '@clr/angular';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import { ClientsService } from '../../services/clients.service';
import { v4 as uuidv4 } from 'uuid';
import { Client } from '../../models/client';
import {Service} from "../../models/service.model";

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [
    ClrFormsModule,
    ClarityModule,
    ReactiveFormsModule,
    NgIf,
    NgForOf
  ],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css',
})
export class ClientComponent {
  modalOpen = false;
  addClientForm = new FormGroup({
    companyName: new FormControl('', Validators.required),
    taxNumber: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    name: new FormControl('', Validators.required),
    mol: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required)
  })
  isSubmitting = false;
  clients: Client[] = [];

  constructor(private clientService: ClientsService) {
  }

  ngOnInit(): void {
    this.getClients();
  }

  get email() {
    return this.addClientForm.get('email');
  }


  openModal(value: boolean): void {
    this.modalOpen = value;
  }

  async submit(): Promise<void> {
    if (this.addClientForm.valid) {
      // this.addClientForm.reset();
    }
    this.isSubmitting = true;

    const formData = this.addClientForm.value;
    const clientId =  uuidv4();
    const client = { id: clientId, ...formData } as Client;
    console.log(client);

    try {
      if (this.clients.find(client => client.taxNumber === formData.taxNumber)) {
        await this.clientService.updateClient(client);
      } else {
        await this.clientService.addClient(client);
        const newService: Service = {
          id: 'service123',
          name: 'Consulting',
          quantity: 10,
          unitPrice: 150,
          date: '2024-09-15'
        };
        await this.clientService.addServiceToClient(client.taxNumber, newService);
      }
      await this.getClients();
    } catch (error) {
      console.error('Error saving client', error);
    }

    this.modalOpen = false;
    this.addClientForm.reset();
  }

  async getClients(): Promise<void> {
    try {
      this.clients = await this.clientService.getClients();
    } catch (error) {
      console.error('Error retrieving clients', error);
    }
  }

  async deleteClient(client: Client): Promise<void> {
    await this.clientService.deleteClient(client.taxNumber);
    await this.getClients();
  }
}


