import {Component, Output, EventEmitter, Input} from '@angular/core'
import {CostCharacter} from "../services/import-list.service";

@Component({
  standalone: false,
  selector: 'cost-character-selector',
  template: `<div>
    <select #sel (change)="select.emit(sel.value)" class="form-control">
      @for (item of costCharacters | keys; track item.key) {
        <option [value]="item.key" [selected]="selectedCostCharacter == item.key">
          {{item.value}}
        </option>
      }
    </select>
  </div>`
})
export class CostCharacterSelector {
  costCharacters = CostCharacter;
  @Input() selectedCostCharacter;
  @Output() select = new EventEmitter();
}
