import {Component, OnInit} from '@angular/core';
import {IBaseItem} from "../../../../models/items/baseItem.model";
import Decimal from "break_eternity.js";
import {WeakSpiritHerb} from "../../../../models/items/gathered/herbs/weakspiritherb";
import {Element} from "../../../../models/items/elements";
import {HerbalPoultice} from "../../../../models/items/crafted/poultice/herbal-poultice";

@Component({
  selector: 'cvi-wanderer-crafting',
  templateUrl: './wanderer-crafting.component.html',
  styleUrls: ['./wanderer-crafting.component.scss'],
})
export class WandererCraftingComponent implements OnInit {

  testReqs: Map<IBaseItem, Decimal> = new Map<IBaseItem, Decimal>();
  testOutput:HerbalPoultice =  new HerbalPoultice(Element.wood);
  outputAmount:Decimal = new Decimal(1);

  constructor() {
    this.testReqs.set(new WeakSpiritHerb(Element.metal), new Decimal(10));
  }

  ngOnInit() {
  }

}
