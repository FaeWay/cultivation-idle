import {Component, Input, OnInit} from '@angular/core';
import {IBaseItem} from "../../../../models/items/baseItem.model";
import {IAdventureLocation} from "../../../../models/locations/location.model";
import {GamedataService} from "../../../../services/gamedata.service";

@Component({
  selector: 'cvi-wanderer-wandering',
  templateUrl: './wanderer-wandering.component.html',
  styleUrls: ['./wanderer-wandering.component.scss'],
})
export class WandererWanderingComponent implements OnInit {

  @Input()
  spirtHerb: IBaseItem;

  @Input()
  locations: Array<IAdventureLocation>;

  private selectedLocationName: string;
  private selectedLocation:IAdventureLocation;
  private hideLocationSelect: false;

  gds:GamedataService;

  constructor(private data: GamedataService) {
    this.gds = data;

  }

  updateSelectionLocation(){
    for(let i = 0; i < this.locations.length; i++){
      let loc = this.locations[i];
      if (loc.name.localeCompare(this.selectedLocationName)===0){
        this.selectedLocation = loc;
      }
    }
  }

  ngOnInit() {}

}
