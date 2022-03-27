import {Injectable} from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class AudioService {
  private audioObj = new Audio();
  private bgPath = "assets/sounds/bg/bg_soft.mp3"
  public isPaused = true;
  public = [
    "ended",
    "error",
    "play",
    "playing",
    "pause",
    "timeupdate",
    "canplay",
    "loadedmetadata",
    "loadstart"
  ];


  constructor() {
    this.audioObj.src = this.bgPath;
    this.audioObj.load();
    this.audioObj.play();
    this.isPaused = false;
  }

  playpause() {
    if (!this.isPaused){
      this.audioObj.pause();
      this.isPaused = true;
    }
    else {
      this.audioObj.play();
      this.isPaused = false;
    }
  }
}
