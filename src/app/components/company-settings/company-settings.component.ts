import { Component } from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Client} from "../../models/client";
import {ClientsService} from "../../services/clients.service";
import {v4 as uuidv4} from "uuid";
import {ClarityModule, ClrCommonFormsModule, ClrDatagridModule, ClrInputModule, ClrModalModule} from "@clr/angular";
import {NgForOf, NgIf} from "@angular/common";
import {CompanyService} from "../../services/company.service";
import {Company} from "../../models/company";

@Component({
  selector: 'app-company-settings',
  standalone: true,
  imports: [
    ClrCommonFormsModule,
    ClrDatagridModule,
    ClrInputModule,
    ClrModalModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    ClarityModule,
    FormsModule
  ],
  templateUrl: './company-settings.component.html',
  styleUrl: './company-settings.component.css'
})
export class CompanySettingsComponent {
  // Modal variables
  modalOpen = false;
  isTaxNumberInputDisabled = true;
  modalButtonLabel = 'Add';

  addCompanyForm = new FormGroup({
    companyName: new FormControl('', Validators.required),
    taxNumber: new FormControl({value: '', disabled: false}, Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    name: new FormControl('', Validators.required),
    mol: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required)
  })

  primaryCompanyTaxNumber: any;
  isSubmitting = false;
  companies: Company[] = [];

  constructor(private companyService: CompanyService) {
  }

  async ngOnInit(): Promise<void> {
    await this.getCompanies();
    const storedCompany = localStorage.getItem('primaryCompany');

    if (storedCompany) {
      const parsedCompany = JSON.parse(storedCompany);
      this.primaryCompanyTaxNumber = parsedCompany.companyName;
    } else {
      console.log('No primary company found in localStorage.');
    }
  }

  get email() {
    return this.addCompanyForm.get('email');
  }


  openModal(value: boolean, isTaxNumberInputDisabled?: boolean, company?: Company): void {
    this.modalOpen = value;

    if (!isTaxNumberInputDisabled) {
      return;
    }

    this.isTaxNumberInputDisabled = isTaxNumberInputDisabled;

    if (isTaxNumberInputDisabled) {
      this.modalButtonLabel = 'Edit';

      this.addCompanyForm.get('taxNumber')?.setValue(company?.taxNumber || '');
      this.addCompanyForm.get('taxNumber')?.disable();
      this.addCompanyForm.get('companyName')?.setValue(company?.companyName || '');
      this.addCompanyForm.get('name')?.setValue(company?.name || '');
      this.addCompanyForm.get('mol')?.setValue(company?.mol || '');
      this.addCompanyForm.get('email')?.setValue(company?.email || '');
      this.addCompanyForm.get('address')?.setValue(company?.address || '');
      return;
    }

    this.addCompanyForm.get('taxNumber')?.reset();
    this.addCompanyForm.get('taxNumber')?.enable()
    this.modalButtonLabel = 'Add';
  }

  async submit(): Promise<void> {
    if (this.addCompanyForm.valid) {
      // this.addClientForm.reset();
    }
    this.isSubmitting = true;

    const formData = this.addCompanyForm.value;
    const companyId =  uuidv4();
    let company = { id: companyId, ...formData } as Company;

    let currentTaxNumber;

    if (!formData.taxNumber) {
      currentTaxNumber =  this.addCompanyForm.get('taxNumber')?.value;
    }

    if (currentTaxNumber) {
      company = {...company, taxNumber: currentTaxNumber};
    }

    try {
      if (this.companies.find(client => client.taxNumber === formData.taxNumber)) {
        await this.companyService.updateCompany(company);
      } else {
        await this.companyService.addCompany(company);
      }
      await this.getCompanies();
      this.onCompanyChange(company.taxNumber);
    } catch (error) {
      console.error('Error saving company', error);
    }

    this.modalOpen = false;
  }

  async getCompanies(): Promise<void> {
    try {
      this.companies = await this.companyService.getCompanies();
    } catch (error) {
      console.error('Error retrieving companies', error);
    }
  }

  async deleteCompany(company: Company): Promise<void> {
    await this.companyService.deleteCompany(company.taxNumber);
    await this.getCompanies();
  }

  onCompanyChange($event: any): void {
    const company = this.companies.find(company => company.taxNumber === $event);

    if (company) {
      const companyJson = JSON.stringify(company);
      localStorage.setItem('primaryCompany', companyJson);
      window.location.reload();
    }
  }

}
