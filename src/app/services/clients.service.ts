import { Injectable } from '@angular/core';
import { Client } from '../models/client';
import { IDBPDatabase, openDB } from 'idb';
import { Service } from '../models/service.model';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  private readonly dbPromise: Promise<IDBPDatabase>;

  constructor() {
    this.dbPromise = this.initDb();
  }

  private async initDb(): Promise<IDBPDatabase> {
    return openDB('clients-db', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('clients')) {
          db.createObjectStore('clients', { keyPath: 'taxNumber' });
        }
      }
    });
  }

  async addClient(client: Client): Promise<void> {
    const db = await this.dbPromise;
    await db.put('clients', client);
  }

  async getClients(): Promise<Client[]> {
    const db = await this.dbPromise;
    return db.getAll('clients');
  }

  async getClientByTaxNumber(taxNumber: string): Promise<Client> {
    const db = await this.dbPromise;
    return db.get('clients', taxNumber);
  }

  async updateClient(client: Client): Promise<void> {
    const db = await this.dbPromise;
    const existingClient = await this.getClientByTaxNumber(client.taxNumber);

    if (existingClient) {
      await db.put('clients', client);
    } else {
      throw new Error('ClientModel not found');
    }
  }

  async deleteClient(taxNumber: string): Promise<void> {
    const db = await this.dbPromise;
    await db.delete('clients', taxNumber);
  }

  async addServiceToClient(taxNumber: string, service: Service): Promise<void> {
    const db = await this.dbPromise;
    const client = await this.getClientByTaxNumber(taxNumber);

    if (client) {
      const services = client.services || [];
      const existingServiceIndex = services.findIndex(s => s.id === service.id);

      if (existingServiceIndex > -1) {
        services[existingServiceIndex] = service;
      } else {
        services.push(service);
      }

      client.services = services;
      await this.updateClient(client);
    } else {
      throw new Error('Client not found');
    }
  }

  async removeServiceFromClient(taxNumber: string, serviceId: string): Promise<void> {
    const db = await this.dbPromise;
    const client = await this.getClientByTaxNumber(taxNumber);

    if (client) {
      client.services = client.services.filter(service => service.id !== serviceId);
      await this.updateClient(client);
    } else {
      throw new Error('Client not found');
    }
  }
}
