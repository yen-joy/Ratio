import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { UtilityService } from './utility.service';
import { OverrideService } from './override.service';

@Injectable()
export class InitService {

  constructor(private httpService: HttpService) { }

  initializeApp(): Promise<any> {
    OverrideService.init();

    return new Promise((resolve, reject) => {
      this.httpService.get('/version').subscribe(versionData => {
        UtilityService.SERVER_APP_VERSION = versionData.version;

        resolve();
      })
    });
  }
}

