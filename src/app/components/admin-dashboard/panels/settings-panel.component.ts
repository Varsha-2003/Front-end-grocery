import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings-panel',
  standalone: true,
  imports: [CommonModule],
  template: `<div class='panel-content'><h2>Store Settings</h2><p>Manage store settings here.</p></div>`,
  styleUrls: ['./settings-panel.component.css']
})
export class SettingsPanelComponent {} 