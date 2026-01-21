import { Component, input } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-form-card',
  imports: [CardModule],
  templateUrl: './form-card.html',
  styleUrl: './form-card.css',
})
export class FormCard {
  title = input<string>('');
  highlightedText = input<string>('');
}
