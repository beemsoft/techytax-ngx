import {Component, Output, EventEmitter, Pipe, PipeTransform, Input} from "@angular/core";
import {CostType} from "../services/import-list.service";
import {LabelService} from "../services/label.service";

@Pipe({
  name: 'keys'
})
export class KeysPipe implements PipeTransform {

  constructor(private labelService: LabelService) {}

  transform(value: any, args: string[]): any {
    let keys = [];
    for (let enumMember in value) {
      let isValueProperty = parseInt(enumMember, 10) >= 0;
      if (isValueProperty) {
        keys.push({key: enumMember, value: this.labelService.get(value[enumMember])});
      }
    }
    return keys;
  }
}

@Component({
  selector: 'cost-type-selector',
  providers: [LabelService],
  template: `<div>
    <select #sel (change)="select.emit(sel.value)">
<!--      <option *ngFor="let item of costTypes | keys" [value]="item.key" [selected]="selectedCostTypeId == item.key">{{item.value}}-->
<!--      </option>-->
    </select>
  </div>`
})
export class CostTypeSelector {
  costTypes = CostType;
  @Input() selectedCostTypeId: number;
  @Output() select = new EventEmitter();
}
