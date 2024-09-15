import { Injectable } from '@angular/core';
import { IDBPDatabase, openDB } from 'idb';
import { Company } from '../models/company';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private readonly dbPromise: Promise<IDBPDatabase>;

  constructor() {
    this.dbPromise = this.initDb();
  }

  private async initDb(): Promise<IDBPDatabase> {
    return openDB('company-db', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('companies')) {
          db.createObjectStore('companies', { keyPath: 'taxNumber' });
        }
      }
    });
  }

  async addCompany(company: Company): Promise<void> {
    const db = await this.dbPromise;
    await db.put('companies', company);
  }

  async getCompanies(): Promise<Company[]> {
    const db = await this.dbPromise;
    return db.getAll('companies');
  }

  async getCompanyByTaxNumber(taxNumber: string): Promise<Company> {
    const db = await this.dbPromise;
    return db.get('companies', taxNumber);
  }

  async updateCompany(company: Company): Promise<void> {
    const db = await this.dbPromise;
    const existingClient = await this.getCompanyByTaxNumber(company.taxNumber);

    if (existingClient) {
      await db.put('companies', company);
    } else {
      throw new Error('CompanyModel not found');
    }
  }

  async deleteCompany(taxNumber: string): Promise<void> {
    const db = await this.dbPromise;
    await db.delete('companies', taxNumber);
  }
}
