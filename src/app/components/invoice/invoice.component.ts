import { Component, Input } from '@angular/core';
import { NgForOf, NgIf, NgStyle } from '@angular/common';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [
    NgIf,
    NgStyle,
    NgForOf
  ],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css'
})
export class InvoiceComponent {
  @Input() panelLabel = 'Panel Label';
  @Input() panelData?: any;
  @Input() panelLabelSize: number = 24;
  @Input() panelDataSize: number = 16;
  @Input() panelLabelFontBold: number = 600;
  @Input() panelSubDataItems: any = [];
  @Input() marginValue?: any;

}
