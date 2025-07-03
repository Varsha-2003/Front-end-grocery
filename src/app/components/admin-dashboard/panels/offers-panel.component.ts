import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Offer {
  id: number;
  code: string;
  desc: string;
  type: string;
  active: boolean;
}

@Component({
  selector: 'app-offers-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './offers-panel.component.html',
  styleUrls: ['./offers-panel.component.css']
})
export class OffersPanelComponent {
  offers: Offer[] = [
    { id: 1, code: 'SAVE10', desc: '10% off on all items', type: 'Discount', active: true },
    { id: 2, code: 'FREESHIP', desc: 'Free shipping on orders over ₹500', type: 'Shipping', active: false }
  ];
  showAddForm = false;
  newOffer: Partial<Offer> = { code: '', desc: '', type: 'Discount', active: true };
  editOfferId: number | null = null;
  editOffer: Partial<Offer> = {};

  addOffer() {
    if (!this.newOffer.code || !this.newOffer.desc || !this.newOffer.type) return;
    const id = this.offers.length ? Math.max(...this.offers.map(o => o.id)) + 1 : 1;
    this.offers.push({
      id,
      code: this.newOffer.code!,
      desc: this.newOffer.desc!,
      type: this.newOffer.type!,
      active: this.newOffer.active ?? true
    });
    this.newOffer = { code: '', desc: '', type: 'Discount', active: true };
    this.showAddForm = false;
  }

  startEdit(offer: Offer) {
    this.editOfferId = offer.id;
    this.editOffer = { ...offer };
  }

  saveEdit() {
    if (this.editOfferId !== null) {
      const idx = this.offers.findIndex(o => o.id === this.editOfferId);
      if (idx > -1 && this.editOffer.code && this.editOffer.desc && this.editOffer.type) {
        this.offers[idx] = {
          id: this.editOfferId,
          code: this.editOffer.code,
          desc: this.editOffer.desc,
          type: this.editOffer.type,
          active: this.editOffer.active ?? true
        };
      }
      this.editOfferId = null;
      this.editOffer = {};
    }
  }

  cancelEdit() {
    this.editOfferId = null;
    this.editOffer = {};
  }

  deleteOffer(id: number) {
    this.offers = this.offers.filter(o => o.id !== id);
  }

  toggleOffer(id: number) {
    const offer = this.offers.find(o => o.id === id);
    if (offer) offer.active = !offer.active;
  }
} 