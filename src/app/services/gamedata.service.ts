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
  /// BaseName is the key
  private resourceAmounts: Map<string, Map<Element, Decimal>>;
  /// Display-Name is th ekey
  private knownResources: Map<string, object>;

  //TODO: Check that we dont need to shift this one to 'display name' as the key
  private resourceTimers: Map<string, any>;
  private adventureTimers: Map<string, any>;
  private randomGeneratorTimers: Map<string, any>;
  private knowLocations: Map<string, IAdventureLocation>;
  private masterLocationList: Map<string, IAdventureLocation>;

  // Game Engine Vars
  private lastGameTick: number;
  private autosaveInterval: number = 15000;
  private timeTillAutosave: number = 15;
  private ticksPerSecond: Decimal = new Decimal(1);
  private progressBarUpdateInterval: number = 100;
  public unlockToastDelay: number = 7500;
  public toastTime: number = 2500;
  public playMusic: boolean = false;

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

  // If we are Exploring somewhere to unlock a sub-location, what is it?
  // Null if not set, or we have found all locations
  private randomUnlockMap: Map<string, Map<string, IAdventureLocation>> = new Map<string, Map<string, IAdventureLocation>>();
  //For random generating items: the base name -> Generated Item Name
  private randomItemGeneratorMap: Map<string, Map<string, IBaseItem>> = new Map<string, Map<string, IBaseItem>>();
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
    this.randomUnlockMap = new Map<string, Map<string, IAdventureLocation>>()
    this.randomGeneratorTimers = new Map<string, any>();
    this.resourceTimers = new Map<string, any>();
    this.adventureTimers = new Map<string, any>();
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
    this.resourceTimers = new Map<string, any>();
    this.adventureTimers = new Map<string, any>();
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
    //TODO: Stop this going into the negeative for the first time when loading a save
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
      //General Settings
      unlockToastDelay: this.unlockToastDelay,
      toastTime: this.toastTime,
      playMusic: this.playMusic,
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
      this.unlockToastDelay = res['unlockToastDelay'];
      this.toastTime = res['toastTime'];
      this.playMusic = res['playMusic'];
      this.FixJSONMapsToDecimals();
      this.ResumeLoadedGameTimers();
      return true;
    } catch (e) {
      console.warn("Failed to load Game: " + e.message);
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
            this.router.navigate(['/']).then(() => {
              window.location.reload();
            });
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
    this.Toast(msg, this.toastTime, 'success');
    //Update unlocks, as we unlocked something!
    this.UpdateGameDataFlags();
  }


  private GenerateRandomElementFromLocationItem(location: IAdventureLocation, item: IBaseItem): IBaseItem {
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
    return newItem;
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
      this.Toast(msg, this.toastTime, 'primary');
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
      throw new Error("Attempting to search for sub-locations without discovering the Top-Level Location!");
    kl.push(baseLocation);
    return kl;
  }


  public GetAllKnownLocations(): Array<IAdventureLocation> {
    return Array.from(this.knowLocations.values()) as Array<IAdventureLocation>;
  }

  //Adventuring is a little different to resources. I could generic it all, but that's annoying to do in JS
  public StartRestartAdventureTimer(location: IAdventureLocation) {
    if (this.isLoneWolf) {
      clearInterval(this.loneAction);
      this.loneAction = setInterval(() => {
        this.UpdateAndDiscoverLocation(location)
      }, this.progressBarUpdateInterval)

    } else {
      let aTimer = setInterval(() => {
        this.UpdateAndDiscoverLocation(location)
      }, this.progressBarUpdateInterval)
      this.adventureTimers.set(location.name, aTimer);
    }
  }

  public UpdateAndDiscoverLocation(location: IAdventureLocation) {
    if (location.barValue < 1) {
      location.barValue += location.percentPerTick;
    } else {
      if (this.isLoneWolf) {
        clearInterval(this.loneAction);
      } else {
        //STOP Timer
        clearInterval(this.adventureTimers.get(location.name))
      }
      location.barValue = 0;
      this.DiscoverLocation(location);
    }
  }

  public SetNewRandomSubLocationToFind(location: IAdventureLocation) {
    if (!this.FoundAllSubLocations(location)) {
      if (!this.randomUnlockMap.has(location.name)) {
        let newLoc = this.FindRandomSubLocation(location);
        if (newLoc) {
          //this wipes any old entries one purpose
          this.randomUnlockMap.set(location.name, new Map<string, IAdventureLocation>());
          this.randomUnlockMap.get(location.name).set(newLoc.name, newLoc);
        }
      }
    }
  }

  public SetNewTopLevelLocationToFind() {
    throw new Error("SetNewTopLevelLocationToFind() is not implemented yet");
  }

  public GetCurrentRandomSubLocationUnlock(baseLocation: IAdventureLocation): IAdventureLocation {
    if (this.randomUnlockMap.has(baseLocation.name)) {
      let map = this.randomUnlockMap.get(baseLocation.name);
      //RIP any code conventions here. It works just fine. Fragile, but works.
      return Array.from(map.values())[0] as IAdventureLocation;
    }
    return null;
  }

  public GetCurrentRandomItemUnlockByLocation(baseLocation: IAdventureLocation): IBaseItem {
    if (this.randomItemGeneratorMap.has(baseLocation.name)) {
      let mpa = this.randomItemGeneratorMap.get(baseLocation.name);
      return Array.from(mpa.values())[0] as IBaseItem;
    }
  }

  //endregion

  //region timers
  public StartRestartResourceTimer(item: IBaseItem) {
    if (this.isLoneWolf) {
      clearInterval(this.loneAction);
      this.loneAction = setInterval(() => {
        this.UpdateProgressAndAddItems(item)
      }, this.progressBarUpdateInterval)
    } else {
      //TODO: Limit to X People Per Y Thing
      if (!this.resourceTimers.has(item.baseName)) {
        let nTimer = setInterval(() => {
          this.UpdateProgressAndAddItems(item)
        }, this.progressBarUpdateInterval);
        this.resourceTimers.set(item.baseName, nTimer);
      } else {
        // Grab timer ID & stop timer
        clearInterval(this.resourceTimers.get(item.baseName));
        let id = setInterval(() => {
          this.UpdateProgressAndAddItems(item)
        }, this.progressBarUpdateInterval);
        this.resourceTimers.set(item.baseName, id);
      }
    }
  }

  public StartRestartRandomResourceTimer(item: IBaseItem, location: IAdventureLocation) {
    let newItem = this.GenerateRandomElementFromLocationItem(location, item);
    let entry = new Map<string, IBaseItem>();
    entry.set(newItem.displayName, newItem);
    this.randomItemGeneratorMap.set(location.name, new Map<string, IBaseItem>());
    this.randomItemGeneratorMap.set(location.name, entry);
    //Every time we hit this, yeet the current random item for that location into the ether... after stopping any old timers
    if (this.randomItemGeneratorMap.has(location.name)) {
      clearInterval(this.randomGeneratorTimers.get(location.name));
    }
    if (this.isLoneWolf) {
      clearInterval(this.loneAction);
      this.loneAction = setInterval(() => {
        this.UpdateProgressAndAddRandomizedItem(location);
      }, this.progressBarUpdateInterval)
    } else {
      //Kick off the timer
      let t = setInterval(() => {
        this.UpdateProgressAndAddRandomizedItem(location);
      }, this.progressBarUpdateInterval)
      this.randomGeneratorTimers.set(location.name, t);
    }
  }

  public StopTimerForItem(item: IBaseItem) {
    if (this.isLoneWolf) {
      clearInterval(this.loneAction);
    } else {
      if (this.resourceTimers.has(item.baseName)) {
        clearInterval(this.resourceTimers.get(item.baseName).value);
      }
    }
  }

  private UpdateProgressAndAddItems(item: IBaseItem) {
    if (item.barValue < 1) {
      item.barValue += item.percentPerTick;
    } else {
      //STOP Timer
      clearInterval(this.resourceTimers.get(item.baseName));
      item.barValue = 0;
      this.UpSertResourceValue(item, item.baseResourceAmount);
      this.StartRestartResourceTimer(item);
    }
  }

  private UpdateProgressAndAddRandomizedItem(loc: IAdventureLocation) {
    let item = this.GetCurrentRandomItemUnlockByLocation(loc);
    if (item.barValue < 1) {
      item.barValue += item.percentPerTick;
    } else {
      if (this.isLoneWolf) {
        clearInterval(this.loneAction);
      } else {
        clearInterval(this.randomGeneratorTimers.get(loc.name))
      }
      this.UpSertResourceValue(item, new Decimal(1));
      //Clear the item we just unlocked
      this.randomItemGeneratorMap.delete(loc.name);
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
    await new Promise(f => setTimeout(f, this.unlockToastDelay));
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
    for (let [key, value] of requirements) {
      let val = this.GetResourceValue(key);
      allItem = val.cmp(value) != -1; //-1 is 'less than'
      if (!allItem)
        return false;
    }
    return true;
  }

  //endregion
}
