import { Component, OnInit } from '@angular/core';
import { ClarityModule, ClrIconModule, ClrInputModule, ClrSelectModule } from '@clr/angular';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe, NgForOf, NgIf, TitleCasePipe } from '@angular/common';
import { CurrenciesService } from '../../services/currencies.service';
import { PanelComponent } from '../panel/panel.component';
import { ClientsService } from '../../services/clients.service';
import { Client} from '../../models/client';
import { TitlecaseWithSpacesPipe } from '../../pipes/titlecase-with-spaces.pipe';
import { InvoiceComponent } from '../invoice/invoice.component';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { CompanyService } from '../../services/company.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {CurrencySymbolPipe} from "../../pipes/currency-symbol.pipe";
import {Currency} from "../../models/currency";
import {ServiceDataComponent} from "../service-data/service-data.component";
import {Service} from "../../models/service.model";
import {v4 as uuidv4} from "uuid";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ClrInputModule,
    FormsModule,
    ReactiveFormsModule,
    ClrSelectModule,
    NgForOf,
    ClrIconModule,
    PanelComponent,
    TitleCasePipe,
    TitlecaseWithSpacesPipe,
    InvoiceComponent,
    NgIf,
    DatePipe,
    ClarityModule,
    RouterLink,
    RouterLinkActive,
    CurrencySymbolPipe,
    ServiceDataComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  invoiceForm = new FormGroup({
    numberControl: new FormControl('', Validators.required),
    currencyControl: new FormControl('', Validators.required),
    clientsControl: new FormControl('', Validators.required),
  });

  currencies: any;
  currency: any;

  clients: Client[] = [];
  client!: Client;
  fieldEntries: { key: string, value: string }[] = [];

  // CompanyModel owner data
  companyData: { key: string, value: string }[] = [];

  // Form Values
  invoiceNumber: any = 0;
  currentDate: string = new Date().toLocaleDateString();

  // Provided services
  providedServices: Service[] = [];
  totalPrice = 0;

  constructor(
    private currenciesService: CurrenciesService,
    private clientsService: ClientsService,
    private companyService: CompanyService) {
  }

  async ngOnInit(): Promise<void> {
    this.currentDate = new Date().toLocaleDateString();
    this.buildCurrencies();

    await this.getClients();

    await this.getCompanyOwnerData();

    this.invoiceForm.get('clientsControl')?.valueChanges.subscribe(taxNumber => {
      if (taxNumber) {
        this.getClientByTaxNumber(taxNumber);
      }
    });

    this.invoiceForm.get('numberControl')?.valueChanges.subscribe(value => {
      if (value) {
        this.invoiceNumber = value;
      }
    });

    this.invoiceForm.get('currencyControl')?.valueChanges.subscribe(value => {
      if (value) {
        this.currency = value;
      }
    });
  }

  buildCurrencies(): void {
    this.currenciesService.buildCurrencies().subscribe(
      currencies => {
       this.currencies = currencies;
      }
    );
  }

  async getClients(): Promise<void> {
    this.clients = await this.clientsService.getClients();
  }

  async getClientByTaxNumber(taxNumber: string): Promise<void> {
    (this.client as any) = this.clients.find(client => client.taxNumber === taxNumber);
    this.fieldEntries = Object.entries(this.client)
      .filter(([key, value]) => key !== 'services' && value !== null && value !== undefined)
      .filter(([key, value]) => key !== 'id' && value !== null && value !== undefined)
      .map(([key, value]) => ({
        key,
        value: value ? String(value) : 'N/A'
      }));
    console.log(this.client);
  }

  async getCompanyOwnerData(): Promise<void> {
    let companies = await this.companyService.getCompanies();
    let company: any;

    if (companies.length >= 1) {
      company = companies[0];
    }

    let primaryCompany = this.getPrimaryCompany();
    if (primaryCompany) {
      company = primaryCompany;
    }

    this.companyData = Object.entries(company)
      .filter(([key, value]) => key !== 'id' && value !== null && value !== undefined)
      .map(([key, value]) => ({
        key,
        value: value ? String(value) : 'N/A'  // Ensure that value is a string, and provide default for missing data
      }));
    console.log(company)
  }

  private getPrimaryCompany(): any {
    const storedCompany = localStorage.getItem('primaryCompany');

    if (storedCompany) {
      const parsedCompany = JSON.parse(storedCompany);
      return parsedCompany;
    } else {
      console.log('No primary company found in localStorage.');
    }
  }

  handleServicesChanged(newServices: any[]): void {
    (this.providedServices as any) = [...this.providedServices, ...newServices];
    this.totalPrice = 0;
    this.providedServices.forEach(service =>
      {
        this.totalPrice += (service.unitPrice * service.quantity);
        const serviceId = uuidv4();
        service = {...service, id: serviceId, invoiceNumber: this.invoiceNumber}
        this.clientsService.addServiceToClient(this.client.taxNumber, service);
      }
    )
  }

  generatePDF() {
    const data = document.getElementById('pdf-content');

    if (data) {
      data.classList.add('pdf-layout');
      const fileName = prompt('Enter a name for the PDF file:', 'invoice');

      html2canvas(data).then(canvas => {
        const pdf = new jsPDF({
          orientation: 'p',
          unit: 'mm',
          format: 'a4'
        });

        const imgWidth = 210;
        const pageHeight = 297;

        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const scalingFactor = imgHeight > pageHeight ? pageHeight / imgHeight : 1;

        const scaledWidth = imgWidth * scalingFactor;
        const scaledHeight = imgHeight * scalingFactor;


        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, scaledWidth, scaledHeight);


        pdf.save(`${fileName}.pdf`);

        data.classList.remove('pdf-layout');
      });
    }
  }

  protected readonly InvoiceComponent = InvoiceComponent;
}
