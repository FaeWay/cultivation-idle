import {Component, OnInit, ViewChild} from '@angular/core';
import {GamedataService} from "./services/gamedata.service";
import {ThemeService} from "./services/theme.service";
import {IonSelect} from "@ionic/angular";
import {AudioService} from "./services/audio.service";


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent implements OnInit {

  gds: GamedataService;
  @ViewChild('themeSelect') themSelectRef: IonSelect;

  public themeColor = [
    {name: 'Red', class: 'red'},
    {name: 'Green', class: 'green'},
    {name: 'Purple', class: 'purple'},
    {name: 'Default', class: 'dummyTheme'}
  ];
  public  selectTheme: string;
  hideList =true;
  constructor(private gameData: GamedataService, private theme: ThemeService, public audio:AudioService) {
    this.gds = gameData;
    this.selectTheme = this.gds.currentTheme;
    this.dynamicTheme();
    this.audio.playpause();
  }

  ngOnInit() {
  }

  dynamicTheme() {
    this.gds.currentTheme = this.selectTheme;
    this.theme.activeTheme(this.selectTheme);
  }

  showThemeSelect() {
    this.themSelectRef.open();
  }

}
