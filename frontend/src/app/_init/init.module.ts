import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { InitService } from '../_services/init.service';

export function init_app(
  initService: InitService) {
  return () => initService.initializeApp();
}

@NgModule({
  imports: [HttpClientModule],
  providers: [
    InitService,
    { provide: APP_INITIALIZER, useFactory: init_app, 
        deps: [InitService], multi: true }
  ]
})
export class InitModule { }
