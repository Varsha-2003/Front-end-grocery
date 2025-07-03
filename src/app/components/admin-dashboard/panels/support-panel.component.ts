import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-support-panel',
  standalone: true,
  imports: [CommonModule],
  template: `<div class='panel-content'><h2>Customer Support</h2><p>Manage support tickets here.</p></div>`,
  styleUrls: ['./support-panel.component.css']
})
export class SupportPanelComponent {} 