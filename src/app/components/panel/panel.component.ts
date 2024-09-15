import { Component, Input } from '@angular/core';
import { ClrCommonFormsModule, ClrInputModule } from '@clr/angular';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [
    ClrCommonFormsModule,
    ClrInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.css'
})
export class PanelComponent {
  @Input() panelLabel = '';
  @Input() panelData = '';

}
