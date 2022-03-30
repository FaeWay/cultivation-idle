import {Component, OnInit} from '@angular/core';
import {GamedataService} from "../../services/gamedata.service";
import {ElementMaps} from "../../models/items/elements";
import {IBaseItem} from "../../models/items/baseItem.model";

@Component({
  selector: 'cvi-resource-overview',
  templateUrl: './resource-overview.component.html',
  styleUrls: ['./resource-overview.component.scss'],
})
export class ResourceOverviewComponent implements OnInit {


  constructor(public gds: GamedataService) {
    //gds.GetAllKnownBaseItems();
  }

  ngOnInit() {
  }

  GetElement(item: IBaseItem) {
    return ElementMaps.display.get(item.element);
  }
}
