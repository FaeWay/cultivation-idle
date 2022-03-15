import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IBaseItem} from "../../../models/items/baseItem.model";
import Decimal from "break_eternity.js";
import {GamedataService} from "../../../services/gamedata.service";
import {TimeInterval} from "rxjs";

@Component({
  selector: 'cvi-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
})
export class ProgressBarComponent implements OnInit {
  @Input()
  barValue: number;

  constructor() { }

  ngOnInit() {
  }
}
