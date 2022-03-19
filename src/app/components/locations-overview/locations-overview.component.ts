import {Component, OnInit} from '@angular/core';
import {GamedataService} from "../../services/gamedata.service";
import {Element, ElementMaps} from '../../models/items/elements'

@Component({
  selector: 'cvi-locations-overview',
  templateUrl: './locations-overview.component.html',
  styleUrls: ['./locations-overview.component.scss'],
})
export class LocationsOverviewComponent implements OnInit {

  constructor(public gds: GamedataService) {
  }

  ngOnInit() {
  }

  public ElementMapToArray(elementMap: any): Array<Element> {
    return Array.from(elementMap.keys()) as Array<Element>;
  }

  GetDisplayName(ele: Element): string {
    return ElementMaps.display.get(ele);
  }
}
