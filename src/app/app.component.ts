import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import '@cds/core/icon/register.js';
import { ClarityIcons, contractIcon, cogIcon, usersIcon, fileGroupIcon } from '@cds/core/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ClarityModule, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  companyName = 'A CompanyModel Name';

  ngOnInit(): void {
    this.loadIcons();
    this.assignCompanyName();
  }

  private loadIcons(): void {
    ClarityIcons.addIcons(contractIcon, cogIcon, usersIcon, fileGroupIcon);
  }

  private assignCompanyName(): void {
    const storedCompany = localStorage.getItem('primaryCompany');

    if (storedCompany) {
      const parsedCompany = JSON.parse(storedCompany);
      this.companyName = parsedCompany.companyName;
    } else {
      console.log('No primary company found in localStorage.');
    }
  }
}
