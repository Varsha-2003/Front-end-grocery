import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payments-panel',
  standalone: true,
  imports: [CommonModule],
  template: `<div class='panel-content'><h2>Payments</h2><p>Manage payments here.</p></div>`,
  styleUrls: ['./payments-panel.component.css']
})
export class PaymentsPanelComponent {} 