import {Component, Output, EventEmitter, Input} from '@angular/core'
import {VatType} from "../services/import-list.service";

@Component({
  selector: 'vat-type-selector',
  template: `<div>
    <select #sel (change)="select.emit(sel.value)">
<!--      <option *ngFor="let item of vatTypes | keys" [value]="item.key" [selected]="selectedVatType && vatTypes[selectedVatType] == item.key">{{item.value}}-->
<!--      </option>-->
    </select>
  </div>`
})
export class VatTypeSelector {
  vatTypes = VatType;
  @Input() selectedVatType;
  @Output() select = new EventEmitter();
}
