import { Component, OnInit } from '@angular/core';
import { UtilityService } from '../../_services/utility.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  public clientVersion = UtilityService.CLIENT_APP_VERSION;
  public serverVersion = UtilityService.SERVER_APP_VERSION;

  constructor() { }

  ngOnInit() {    
  }

}
