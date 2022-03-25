import {Injectable, OnInit} from '@angular/core';
import {IBaseItem} from "../models/items/baseItem.model";
import Decimal from "break_eternity.js";
import {Element} from "../models/items/elements";
import {UtilityFunctions} from "../Utils/utlity-functions";
import {AlertController, ToastController} from "@ionic/angular";
import {Router} from "@angular/router";
import {IAdventureLocation, LocationMaps} from "../models/locations/location.model";
import * as _ from 'lodash';
import {
  BambooForest,
  BambooForestDepths,
  BambooForestFringe,
  BambooForestGrove
} from "../models/locations/bamboo-forest/bamboo-forest.location.model";
import {WeakSpiritHerb} from "../models/items/gathered/herbs/weakspiritherb";


const fmt = require('swarm-numberformat')
const CULTIVATION_SUB_LEVELS_PER_STAGE = 9;
const LOCAL_STORAGE_NAME = 'cultivation-idle-savegame';
const UNLOCK_FEATURE_TOAST_DELAY = 7500;

@Injectable({
  providedIn: 'root'
})
export class GamedataService implements OnInit {

  //region Vars
  //Game Data Maps
  /// BaseName
  private resourceAmounts: Map<string, Map<Element, Decimal>>;
  /// Display-Name
  private knownResources: Map<string, object>;
  private timers: Map<string, any>;
  private knowLocations: Map<string, IAdventureLocation>;
  private masterLocationList: Map<string, IAdventureLocation>;

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
  public wandererCanTrain: boolean = true;

  //Single-Person Mode (no sec disciples/companions)
  private isLoneWolf: boolean = true;
  private loneAction: NodeJS.Timeout;

  //Toast!
  private toaster: ToastController;
  //Alert
  private alerter: AlertController;
  //Router
  private router: Router;
  // Current Theme
  public currentTheme: string;
  // Current Item Id;
  public currentItemId: number;

  constructor(private toastControl: ToastController, alertCtrl: AlertController, private rtr: Router) {
    this.toaster = toastControl;
    this.alerter = alertCtrl;
    this.router = rtr;
    this.resourceAmounts = new Map<string, Map<Element, Decimal>>();
    this.knownResources = new Map<string, IBaseItem>();
    this.knowLocations = new Map<string, IAdventureLocation>();
    this.masterLocationList = new Map<string, IAdventureLocation>();
    this.timers = new Map<string, any>();
    this.SetupMasterListOfLocations();
    if (!this.LoadGame()) {
      this.InitNewGame();
    }
  }

  ngOnInit() {

  }

  //endregion

  //region saveload
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
    //We can always wander the Bamboo Forest!
    const bbf = new BambooForest();
    this.knowLocations.set(bbf.name, bbf);
  }

  private ResumeLoadedGameTimers() {
    const saveGameLoop = setInterval(() => {
      this.SaveGame()
    }, this.autosaveInterval);
    const autosaveTimer = setInterval(() => {
      this.SaveCountDown()
    }, 1000)
    //TODO: Un-Break this
    /**
     this.knownResources.forEach((res) => {
      this.StartRestartTimer(res);
    })*/
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
      knowLocations: JSON.stringify(this.knowLocations, GamedataService.MapEncoder),
      masterLocationList: JSON.stringify(this.masterLocationList, GamedataService.MapEncoder),
      lastGameTick: JSON.stringify(this.lastGameTick),
      autosaveInterval: this.autosaveInterval,
      timeTillAutosave: this.timeTillAutosave,
      ticksPerSecond: this.ticksPerSecond,
      progressBarUpdateInterval: this.progressBarUpdateInterval,
      currentTheme: this.currentTheme,
      //UI Flags
      canWander: this.canWander,
      canAdventure: this.canAdventure,
      canCultivate: this.canCultivate,
      canRanch: this.canRanch,
      canFarm: this.canFarm,
      canTend: this.canTend,
      canSmith: this.canSmith,
      canRefine: this.canRefine,
      showAcks: this.showAcks,
      //Wander Specific flags
      wandererCanWander: this.wandererCanWander,
      wandererCanCraft: this.wandererCanCraft,
      wandererCanTrain: this.wandererCanTrain,
      //Single-Person Mode (no sec disciples/companions)
      isLoneWolf: this.isLoneWolf
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
      this.knowLocations = JSON.parse(res['knowLocations'], GamedataService.MapDecoder);
      this.masterLocationList = JSON.parse(res['masterLocationList'], GamedataService.MapDecoder);
      this.lastGameTick = res["lastGameTick"];
      this.autosaveInterval = res["autosaveInterval"];
      this.currentTheme = res['currentTheme'];
      this.timeTillAutosave = res['timeTillAutosave'];
      this.ticksPerSecond = res['ticksPerSecond'];
      this.progressBarUpdateInterval = res['progressBarUpdateInterval'];
      this.currentTheme = res['currentTheme'];
      this.canWander = res['canWander'];
      this.canAdventure = res['canAdventure'];
      this.canCultivate = res['canCultivate'];
      this.canRanch = res['canRanch'];
      this.canFarm = res['canFarm'];
      this.canTend = res['canTend'];
      this.canSmith = res['canSmith'];
      this.canRefine = res['canRefine'];
      this.showAcks = res['showAcks'];
      this.wandererCanWander = res['wandererCanWander'];
      this.wandererCanCraft = res['wandererCanCraft'];
      this.wandererCanTrain = res['wandererCanTrain'];
      this.isLoneWolf = res['isLoneWolf'];
      this.FixJSONMapsToDecimals();
      this.ResumeLoadedGameTimers();
      return true;
    } catch (e) {
      console.error("Failed to load Game: " + e);
      return false;
    }
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
          id: 'cancel-button'
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

  //endregion

  //region resourcemanagement
  public GetResourceValue(item: IBaseItem): Decimal {
    if (this.ItemElementIsKnown(item)) {
      const dec = this.resourceAmounts.get(item.baseName).get(item.element);
      return dec;
    } else {
      return new Decimal(NaN);
    }
  }

  private ItemElementIsKnown(item: IBaseItem): boolean {
    if (this.resourceAmounts.has(item.baseName)) {
      if (this.resourceAmounts.get(item.baseName).has(item.element)) {
        return true;
      }
    }
    return false;
  }

  public IsBaseItemKnown(item: IBaseItem): boolean {
    return this.resourceAmounts.has(item.baseName)
  }

  public UpSertResourceValue(item: IBaseItem, value: Decimal): void {
    if (this.IsBaseItemKnown(item)) {
      if (this.ItemElementIsKnown(item)) {
        let it = this.resourceAmounts.get(item.baseName).get(item.element);
        it = it.add(value);
        this.resourceAmounts.get(item.baseName).set(item.element, it);
      } else {
        //we know the _Base_ item, but not the element
        this.MakeResourceKnown(item);
        //new item, new element
        let m = this.resourceAmounts.get(item.baseName);
        m.set(item.element, item.baseResourceAmount);
      }
    } else {
      // Resource values
      this.resourceAmounts.set(item.baseName, new Map<Element, Decimal>().set(item.element, item.baseResourceAmount));
      //Brand new item & element
      this.MakeResourceKnown(item);
    }
    //Tag 'tick' time
    item.lastTick = Date.now();
  }

  public GetAllKnownResources(): IBaseItem[] {
    return Array.from(this.knownResources.values()) as Array<IBaseItem>;
  }

  public MakeResourceKnown(item: IBaseItem) {
    item.id = this.currentItemId;
    this.currentItemId += 1;
    // add to know resources
    this.knownResources.set(item.displayName, item);
    //Calculate required tick-values
    UtilityFunctions.CalcBarPercValues(item);
    //Toast that we unlocked a new item!
    const msg = 'Unlocked New Item: ' + item.displayName
    this.Toast(msg, 2500, 'success');
    //Update unlocks, as we unlocked something!
    this.UpdateGameDataFlags();
  }


  public GenerateRandomElementFromLocationItem(location: IAdventureLocation, item: IBaseItem) {
    let haveElement = false;
    //Irritating JS & ShallowCopies. This one line cost me like 4 hours
    let newItem: IBaseItem = _.cloneDeep(item);
    //Loop until we get an element.
    const maxLoops = 1000;
    let currentLoop = 0;
    while (!haveElement || currentLoop > maxLoops) {
      for (let [key, value] of location.elementalPresence) {
        let x = Math.random();
        if (x > value) {
          newItem.element = key;
          haveElement = true;
          break; //redundant?
        }
      }
      currentLoop += 1;
    }
    newItem.RegenerateDisplayName();
    this.UpSertResourceValue(newItem, newItem.baseResourceAmount);
  }

  public HaveDiscoveredAllElementVariants(item: IBaseItem) {
    let fire, earth, metal, wood, water = false;
    //Could loop, but its only 5 calls.
    if (this.IsBaseItemKnown(item)) {
      fire = this.resourceAmounts.get(item.baseName).has(Element.fire);
      earth = this.resourceAmounts.get(item.baseName).has(Element.earth);
      metal = this.resourceAmounts.get(item.baseName).has(Element.metal);
      wood = this.resourceAmounts.get(item.baseName).has(Element.wood);
      water = this.resourceAmounts.get(item.baseName).has(Element.water);
    }
    return fire && earth && metal && wood && water;
  }

  public HaveDiscoveredAllElementVariantsInArea(location: IAdventureLocation, item: IBaseItem) {
    let haveAll = false;
    if (this.IsBaseItemKnown(item)) {
      for (let [key, value] of location.elementalPresence) {
        haveAll = this.resourceAmounts.get(item.baseName).has(key);
        if (!haveAll)
          return false;
      }
    } else {
      return false
    }
    return true;
  }

  //TODO: make this less terrible
  public GetAllKnownResourcesOfType(item: IBaseItem): Array<IBaseItem> {
    let knownItems: Array<IBaseItem> = new Array<IBaseItem>()
    // for base item, poke value
    let bvals = this.resourceAmounts.get(item.baseName);
    let elems = bvals.keys();
    // for every element we have a value for
    for (let e of elems) {
      if (e == Element.NULL)
        continue;
      /**
       *   try and grab the object from 'Known Resources
       *   via a dirty deep-clone-apply-element-regen-name hack
       */
      let i = _.cloneDeep(item);
      i.element = e;
      i.RegenerateDisplayName();
      if (this.knownResources.has(i.displayName)) {
        knownItems.push(i);
      }
    }
    return knownItems;
  }

  //endregion

  //region locationManagement

  //TODO: Possibly move to Save/Load?
  // Containts the master list of all locations in the game, for runtime lookups and diffs.
  // Does not replace the sub-loc static mapping.
  private SetupMasterListOfLocations() {
    //Bamboo Forest
    const bbfd = new BambooForestDepths();
    const bbf = new BambooForest();
    const bbfg = new BambooForestGrove();
    const bbff = new BambooForestFringe();
    this.masterLocationList.set(bbfd.name, bbfd);
    this.masterLocationList.set(bbf.name, bbf);
    this.masterLocationList.set(bbfg.name, bbfg);
    this.masterLocationList.set(bbff.name, bbff);
    //Next Location....
  }

  public DiscoverLocation(location: IAdventureLocation) {
    if (!this.knownResources.has(location.name)) {
      this.knowLocations.set(location.name, location);
      let msg = "Unlocked new location: " + location.name;
      this.Toast(msg, 2500, 'primary');
    }
  }


  public FoundAllSubLocations(location: IAdventureLocation): boolean {
    if (!location.hasSubLocations)
      return true; //no sub locs, therefound them all
    let have: boolean = true; // assume we have found them all
    if (LocationMaps.subLocations.has(location.name)) {
      for (let slval of LocationMaps.subLocations.get(location.name)) {
        have = this.knowLocations.has(slval);
        if (!have)
          return false;
      }
    }
    return true;
  }

  public FindRandomSubLocation(baseLocation: IAdventureLocation): IAdventureLocation {
    if (baseLocation.hasSubLocations) {
      //TODO: Make this a player-stats based chance-roll, instead of instant-gratification of 'Found one!'
      for (let [key, val] of LocationMaps.subLocations) {
        for (let sl of val) {
          //If we dont know this sub-location..
          if (!this.knowLocations.has(sl)) {
            return this.masterLocationList.get(sl);
          }
        }
      }
    }
  }

  public GetKnowLocationsFromBase(baseLocation: IAdventureLocation): Array<IAdventureLocation> {
    let kl = new Array<IAdventureLocation>();
    if (baseLocation.hasSubLocations) {
      const sl = LocationMaps.subLocations.get(baseLocation.name);
      //Sub-locations
      for (let sln of sl) {
        if (this.knowLocations.has(sln)) {
          kl.push(this.knowLocations.get(sln))
        }
      }
    }
    //Check for the base locations, and make sure we return that as well
    //THis should never fail.
    if (!this.knowLocations.has(baseLocation.name))
      throw new Error("Attempting to serach for sub-locations without discogering the Top-Level Location!");
    kl.push(baseLocation);
    return kl;
  }


  public GetAllKnownLocations(): Array<IAdventureLocation> {
    return Array.from(this.knowLocations.values()) as Array<IAdventureLocation>;
  }

  //endregion

  //region timers
  public StartRestartTimer(item: IBaseItem) {
    if (this.isLoneWolf) {
      clearInterval(this.loneAction);
      this.loneAction = setInterval(() => {
        this.UpdateProgressAndAddItems(item)
      }, this.progressBarUpdateInterval)
    } else {
      //TODO: Limit to X People Per Y Thing
      if (!this.timers.has(item.baseName)) {
        let nTimer = setInterval(() => {
          this.UpdateProgressAndAddItems(item)
        }, this.progressBarUpdateInterval);
        this.timers.set(item.baseName, nTimer);
      } else {
        // Grab timer ID & stop timer
        clearInterval(this.timers.get(item.baseName));
        let id = setInterval(() => {
          this.UpdateProgressAndAddItems(item)
        }, this.progressBarUpdateInterval);
        this.timers.set(item.baseName, id);
      }
    }
  }

  public StopTimerForItem(item: IBaseItem) {
    if (this.isLoneWolf) {
      clearInterval(this.loneAction);
    } else {
      if (this.timers.has(item.baseName)) {
        clearInterval(this.timers.get(item.baseName).value);
      }
    }
  }

  private UpdateProgressAndAddItems(item: IBaseItem) {
    if (item.barValue < 1) {
      item.barValue += item.percentPerTick;
    } else {
      //STOP Timer
      clearInterval(this.timers.get(item.baseName));
      item.barValue = 0;
      this.UpSertResourceValue(item, item.baseResourceAmount);
      this.StartRestartTimer(item);
    }
  }

  //endregion

  //region userInteractions
  public Toast(message: string, duration: number, color: string = "warning", position: any = 'bottom') {
    this.toaster.create({
      message: message,
      duration: duration,
      color: color,
      position: position
    }).then(t => t.present())
  }

  //endregion


  //region UnlocksAndEnhancements

  public async UpdateGameDataFlags() {
    let message: string = "New Feature Unlocked";
    //wait a while, as unlock messages are not immediate.
    await new Promise(f => setTimeout(f, UNLOCK_FEATURE_TOAST_DELAY));
    if (!this.wandererCanCraft) {
      let sh = new WeakSpiritHerb(Element.metal); //doesnt matter, base type.
      if (this.IsBaseItemKnown(sh)) {
        this.wandererCanCraft = true;
        this.Toast(message + ': Wanderer Crafting', 2500, "Secondary", 'top')
      }
    }
  }

  public CanActionBePerformed(requirements: Map<IBaseItem, Decimal>) {
    let allItem = true; //assume we have everything to start with
    for(let [key,value] of requirements){
      let val = this.GetResourceValue(key);
      allItem = val.cmp(value) != -1; //-1 is 'less than'
      if(!allItem)
        return false;
    }
    return true;
  }

  //endregion
}
