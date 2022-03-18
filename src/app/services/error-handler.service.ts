import {Injectable} from '@angular/core';
import {ErrorHandler} from "protractor/built/exitCodes";
import {GamedataService} from "./gamedata.service";

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService implements  ErrorHandler {

  constructor(private gds: GamedataService) { }

  handleError(error:any) {
    this.gds.Toast(error?.message || 'Unknown Error Occurred', 3500, "danger");
    console.error(error?.message);
  }
}
