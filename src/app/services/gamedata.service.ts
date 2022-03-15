import {Injectable, OnInit} from '@angular/core';
import {IBaseItem} from "../models/items/baseItem.model";
import Decimal from "break_eternity.js";
import {WeakSpiritHerb} from "../models/items/herbs/weakspiritherb";
import {Element} from "../models/items/elements";
import {UtilityFunctions} from "../Utils/utlity-functions";


const fmt = require('swarm-numberformat')

@Injectable({
  providedIn: 'root'
})
export class GamedataService implements OnInit {
  // Resource Map
  private resourceAmounts: Map<string, Map<Element, Decimal>>;
  private knownResources: Map<string, IBaseItem>;
  private timers: Map<string, any>;
  // Last time the Game-loop iterated
  private lastGameTick: number;
  private autosaveInterval: number = 15000;
  private timeTillAutosave: number = 15;
  private ticksPerSecond: Decimal = new Decimal(1);
  private progressBarUpdateInterval: number = 100;

  constructor() {
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
    this.resourceAmounts.forEach((a,m) => {
      console.log(m);
      fixed.set(m, new Map<Element, Decimal>());
      a.forEach((b,n) => {
        fixed.get(m).set(n,new Decimal(b));
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
      ticksPerSecond: this.ticksPerSecond
    }
    localStorage.setItem('cultivation-idle-savegame', JSON.stringify(data))
    this.timeTillAutosave = this.autosaveInterval / 1000; //in MS so divide
  }

  private LoadGame(): boolean {
    try {
      let ls = localStorage.getItem('cultivation-idle-savegame');
      let res = JSON.parse(ls, GamedataService.MapEncoder);
      this.resourceAmounts = JSON.parse(res["resourceAmounts"], GamedataService.MapDecoder);
      this.knownResources = JSON.parse(res["knownResources"], GamedataService.MapDecoder);
      this.lastGameTick = res["lastGameTick"];
      this.autosaveInterval = res["autosaveInterval"];
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
}
