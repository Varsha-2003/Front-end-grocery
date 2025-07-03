import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports-panel',
  standalone: true,
  imports: [CommonModule],
  template: `<div class='panel-content'><h2>Reports & Analytics</h2><p>View reports and analytics here.</p></div>`,
  styleUrls: ['./reports-panel.component.css']
})
export class ReportsPanelComponent {} 