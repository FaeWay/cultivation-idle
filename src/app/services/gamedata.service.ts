import {Injectable, OnInit} from '@angular/core';
import {IBaseItem} from "../models/items/baseItem.model";
import Decimal from "break_eternity.js";
import {WeakSpiritHerb} from "../models/items/herbs/weakspiritherb";
import {Element} from "../models/items/elements";
import {UtilityFunctions} from "../Utils/utlity-functions";
import {AlertController, ToastController} from "@ionic/angular";
import {Router} from "@angular/router";
import {IAdventureLocation} from "../models/locations/location.model";


const fmt = require('swarm-numberformat')
const CULTIVATION_SUB_LEVELS_PER_STAGE = 9;
const LOCAL_STORAGE_NAME = 'cultivation-idle-savegame';

@Injectable({
  providedIn: 'root'
})
export class GamedataService implements OnInit {
  //Game Data Maps
  private resourceAmounts: Map<string, Map<Element, Decimal>>;
  private knownResources: Map<string, IBaseItem>;
  private timers: Map<string, any>;
  private knowLocations: Map<string, IAdventureLocation>

  private lastGameTick: number;
  private autosaveInterval: number = 15000;
  private timeTillAutosave: number = 15;
  private ticksPerSecond: Decimal = new Decimal(1);
  private progressBarUpdateInterval: number = 100;

  //UI Flags
  public canWander: boolean = true;
  public canAdventure: boolean = false;
  public canCultivate: boolean = false;
  public canRanch: boolean = false;
  public canFarm: boolean = false;
  public canTend: boolean = false;
  public canSmith: boolean = false;
  public canRefine: boolean = false;
  public showAcks: boolean = false;

  //Wander Specific flags
  public wandererCanWander: boolean = true;
  public wandererCanCraft: boolean = false;
  public wandererCanTrain: boolean = false;

  //Single-Person Mode (no sec disciples/companions)
  private isLoneWolf: boolean = true;
  private loneAction: NodeJS.Timeout;

  //Toast!
  private toaster: ToastController;
  //Alert
  private alerter: AlertController;
  //Router
  private router:Router;
  // Current Theme
  public currentTheme:string;

  constructor(private toastControl: ToastController, alertCtrl: AlertController, private rtr: Router) {
    this.toaster = toastControl;
    this.alerter = alertCtrl;
    this.router = rtr;
    this.resourceAmounts = new Map<string, Map<Element, Decimal>>();
    this.knownResources = new Map<string, IBaseItem>();
    this.timers = new Map<string, any>();
    if (!this.LoadGame()) {
      this.InitNewGame();
    }
  }

  ngOnInit() {

  }

  public TimeTilAutosave(): number {
    return this.timeTillAutosave;
  }

  private InitNewGame(): void {
    this.resourceAmounts = new Map<string, Map<Element, Decimal>>();
    this.knownResources = new Map<string, IBaseItem>();
    this.timers = new Map<string, any>();
    const saveGameLoop = setInterval(() => {
      this.SaveGame()
    }, this.autosaveInterval);
    const autosaveTimer = setInterval(() => {
      this.SaveCountDown()
    }, 1000)
    this.UpSertResourceValue(new WeakSpiritHerb(Element.earth), new Decimal(1));
  }

  private ResumeLoadedGameTimers() {
    const saveGameLoop = setInterval(() => {
      this.SaveGame()
    }, this.autosaveInterval);
    const autosaveTimer = setInterval(() => {
      this.SaveCountDown()
    }, 1000)
    this.knownResources.forEach((res) => {
      this.StartRestartTimer(res);
    })
  }

  private FixJSONMapsToDecimals() {
    let fixed: Map<string, Map<Element, Decimal>> = new Map<string, Map<Element, Decimal>>();
    this.resourceAmounts.forEach((a, m) => {
      fixed.set(m, new Map<Element, Decimal>());
      a.forEach((b, n) => {
        fixed.get(m).set(n, new Decimal(b));
      })
    })
    this.resourceAmounts = fixed;
  }

  private SaveGame(): void {
    let data = {
      // Resource Map
      resourceAmounts: JSON.stringify(this.resourceAmounts, GamedataService.MapEncoder),
      knownResources: JSON.stringify(this.knownResources, GamedataService.MapEncoder),
      // Last time the Game-loop iterated
      lastGameTick: JSON.stringify(this.lastGameTick),
      autosaveInterval: this.autosaveInterval,
      timeTillAutosave: this.timeTillAutosave,
      ticksPerSecond: this.ticksPerSecond,
      currentTheme: this.currentTheme
    }
    localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(data))
    this.timeTillAutosave = this.autosaveInterval / 1000; //in MS so divide
  }

  private LoadGame(): boolean {
    try {
      let ls = localStorage.getItem(LOCAL_STORAGE_NAME);
      let res = JSON.parse(ls, GamedataService.MapEncoder);
      this.resourceAmounts = JSON.parse(res["resourceAmounts"], GamedataService.MapDecoder);
      this.knownResources = JSON.parse(res["knownResources"], GamedataService.MapDecoder);
      this.lastGameTick = res["lastGameTick"];
      this.autosaveInterval = res["autosaveInterval"];
      this.currentTheme = res['currentTheme'];
      this.FixJSONMapsToDecimals();
      this.ResumeLoadedGameTimers();
      return true;
    } catch (e) {
      console.error("Failed to load Game: " + e);
      return false;
    }
  }

  private static MapEncoder(key, value) {
    if (value instanceof Map) {
      return {
        dataType: 'Map',
        value: Array.from(value.entries()), // or with spread: value: [...value]
      };
    } else {
      return value;
    }
  }

  private static MapDecoder(key, value) {
    if (typeof value === 'object' && value !== null) {
      if (value.dataType === 'Map') {
        return new Map(value.value);
      }
    }
    return value;
  }

  private SaveCountDown(): void {
    this.timeTillAutosave = this.timeTillAutosave - 1;
  }

  public GetResourceValue(item: IBaseItem): Decimal {
    if (this.ItemIsKnown(item)) {
      const dec = this.resourceAmounts.get(item.name).get(item.element);
      return dec;
    } else {
      return new Decimal(NaN);
    }
  }

  private ItemIsKnown(item: IBaseItem): boolean {
    if (this.resourceAmounts.has(item.name)) {
      if (this.resourceAmounts.get(item.name).has(item.element)) {
        return true;
      }
    }
    return false;
  }

  public UpSertResourceValue(item: IBaseItem, value: Decimal): void {
    //Add value
    if (this.ItemIsKnown(item)) {
      let it = this.resourceAmounts.get(item.name).get(item.element)
      it = it.add(value);
      this.resourceAmounts.get(item.name).set(item.element, it);
    } else {
      this.MakeResourceKnown(item);
      //new item, new element
      this.resourceAmounts.set(item.name, new Map<Element, Decimal>().set(item.element, value));
      //Every time we add a new item / element, add it to the known items map
      this.knownResources.set(item.name, item);
      // Start the timer
      this.StartRestartTimer(item);
    }
    //Tag 'tick' time
    item.lastTick = Date.now();
  }

  public GetAllKnownResources(): Array<IBaseItem> {
    let res = Array.from(this.knownResources.values());
    return res;
  }

  public MakeResourceKnown(item: IBaseItem) {
    // add to know resources
    this.knownResources.set(item.name, item);    // start times with default, base settings
    //Calculate required tick-values
    UtilityFunctions.CalcBarPercValues(item);
    //Start Timer & add to 'list of timers'
  }

  private StartRestartTimer(item: IBaseItem) {
    if (this.isLoneWolf) {
      clearInterval(this.loneAction);
      this.loneAction = setInterval(() => {
        this.UpdateProgressAndAddItems(item)
      }, this.progressBarUpdateInterval)
    } else {
      //TODO: Limit to X People Per Y Thing
      if (!this.timers.has(item.name)) {
        let nTimer = setInterval(() => {
          this.UpdateProgressAndAddItems(item)
        }, this.progressBarUpdateInterval);
        this.timers.set(item.name, nTimer);
      } else {
        // Grab timer ID & stop timer
        clearInterval(this.timers.get(item.name));
        let id = setInterval(() => {
          this.UpdateProgressAndAddItems(item)
        }, this.progressBarUpdateInterval);
        this.timers.set(item.name, id);
      }
    }
  }

  private UpdateProgressAndAddItems(item: IBaseItem) {
    if (item.barValue < 1) {
      item.barValue += item.percentPerTick;
    } else {
      //STOP Timer
      clearInterval(this.timers.get(item.name));
      item.barValue = 0;
      this.UpSertResourceValue(item, item.baseResourceAmount);
      this.StartRestartTimer(item);
    }
  }

  public async Toast(message: string, duration: number) {
    const t = await this.toaster.create({
      message: message,
      duration: duration
    })
    await t.present();
  }

  public async DeleteGame() {
    const alert = await this.alerter.create({
      header: 'Wipe Local Storage: Still Unfinished',
      message: 'Wipe All Game Data from Local Storage? This is irreversible!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'primary',
          id: 'cancel-button',
          handler: (blah) => {

          }
        }, {
          text: 'Okay',
          id: 'confirm-button',
          cssClass: "danger",
          handler: () => {
            localStorage.removeItem(LOCAL_STORAGE_NAME);
            this.router.navigate(['/']);
          }
        }
      ]
    });
    await alert.present();
  }

  public GenerateItemFromLocation(location:IAdventureLocation){

  }
}
