import {Component, OnInit} from '@angular/core';
import {GamedataService} from "../../services/gamedata.service";
import {WeakSpiritHerb} from "../../models/items/herbs/weakspiritherb";
import Decimal from "break_eternity.js";
import {Element} from "../../models/items/elements";

const updateInterval:number = 100;

@Component({
  selector: 'cvi-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {

  gds: GamedataService
  testItem: WeakSpiritHerb;
  testAmount: Decimal;
  updateInt: number;
  constructor(private gameData: GamedataService) {
    this.gds = gameData;
    this.updateInt = updateInterval;
  }

  ngOnInit() {
    this.testItem = new WeakSpiritHerb(Element.earth);
    this.testAmount = new Decimal(1);
  }

  addResource($event){

  }

}
