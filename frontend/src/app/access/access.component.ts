import {Component, OnInit, ViewChild} from '@angular/core';
import {SlidePanelComponent} from '../layout/slide-panel/slide-panel.component';

@Component({
  selector: 'app-access',
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.scss']
})
export class AccessComponent implements OnInit {
  @ViewChild('registrationPanel') registrationPanel: SlidePanelComponent;
  constructor() { }

  ngOnInit() {
  }

}
