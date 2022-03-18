import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import Decimal from "break_eternity.js";
import {IBaseItem} from "../../../models/items/baseItem.model";

@Component({
  selector: 'cvi-item-progress-bar',
  templateUrl: './item-progress-bar.component.html',
  styleUrls: ['./item-progress-bar.component.scss'],
})
export class ItemProgressBar implements OnInit {
  @Input()
  item:IBaseItem;

  @Input()
  totalHeld:Decimal;

  @Input()
  action:string;

  @Output()
  onClick: EventEmitter<any> = new EventEmitter<any>()

  @Input()
  actionDisplayOverride:string;

  private itemDisplay:string;
  constructor() { }

  ngOnInit() {
    if(this.actionDisplayOverride){
      //this.itemDisplay = this.actionDisplayOverride;
    } else {
      //this.itemDisplay = this.item.displayName;
    }
  }

}
