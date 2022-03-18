import {Component, Input, OnInit} from '@angular/core';
import {IBaseItem} from "../../../models/items/baseItem.model";
import {GamedataService} from "../../../services/gamedata.service";

@Component({
  selector: 'cvi-unlock-new-item',
  templateUrl: './unlock-new-item.component.html',
  styleUrls: ['./unlock-new-item.component.scss'],
})
export class UnlockNewItemComponent implements OnInit {

  @Input()
  item :IBaseItem

  private gds: GamedataService;
  constructor(private data:GamedataService) {
    this.gds = data;
  }

  ngOnInit() {}
}
