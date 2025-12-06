import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ride-filter',
  templateUrl: './ride-filter.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class RideFilterComponent {
  @Output() filter = new EventEmitter<string|undefined>();

  onChange(v: string) {
    this.filter.emit(v || undefined);
  }
}
