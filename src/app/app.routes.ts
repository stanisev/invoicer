import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ClientComponent } from './components/clients/client.component';
import { CompanySettingsComponent } from './components/company-settings/company-settings.component';

export const routes: Routes = [
  { path: '', redirectTo: '/invoices', pathMatch: 'full' },
  { path: 'invoices', component: HomeComponent },
  { path: 'clients', component: ClientComponent },
  { path: 'company-settings', component: CompanySettingsComponent}
];
