import { Component, OnInit, ViewChild } from '@angular/core';
import { SlidePanelComponent } from '../slide-panel/slide-panel.component';
import { User } from '../../_models/index';
import {
  Anonymous, AuthenticationService,
  CategoryService, UtilityService, ContentService
} from './../../_services/index';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  @ViewChild('registrationPanel') registrationPanel: SlidePanelComponent;
  @ViewChild('collectionsPanel') collectionsPanel: SlidePanelComponent;
  @ViewChild('mngcategoyPanel') mngcategoyPanel: SlidePanelComponent;
  @ViewChild('mngitemsPanel') mngitemsPanel: SlidePanelComponent;
  @ViewChild('searchPanel') searchPanel: SlidePanelComponent;
  @ViewChild('viewdownlogsPanel') viewdownlogsPanel: SlidePanelComponent;

  brands = [];
  categories = {};

  role: number;
  currentUser: User;
  currentBrand: string;  
  medialist: any;
  holdcount: any;
  subscription: Subscription;
  categoryurl = '/category';
  isActive = false;

  constructor(
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private contentService: ContentService,
    private anonymous: Anonymous,
    private utilityService: UtilityService) {

    this.subscription = anonymous.paneltoggle$.subscribe(val => {
      this.isActive = (val) ? true : false;
      if (this.isActive) {
      } else {
        this.rrcount();
      }
    })

    if (this.route.snapshot.queryParams.brand) {
      this.currentBrand = this.route.snapshot.queryParams.brand
    }

    this.subscription = contentService.myCollectionSubject$.subscribe(val => {
      this.medialist = val;
    })

    this.route.params.subscribe(params => {
      if (params.brand) {
        this.currentBrand = params.brand;
      }
    });

    this.currentUser = this.utilityService.getCurrentUser();
  }

  ngOnInit() {
    this.rrcount();

    this.categories = {};

    this.brands = this.categoryService.getBrands(this.currentUser, true);

    let brandsLoaded = 0;
    let brandToLoad = this.brands.length;
    this.brands.forEach((brand, index) => {
      this.categoryService.getBybrand(brand.id).subscribe(
        (data) => {
          this.categories[brand.id] = data.category;

          brandsLoaded++;
          if (brandToLoad === brandsLoaded) {
            this.utilityService.delay(200).then(any => {
              this.brands.forEach((brand, index) => {
                $('.dl-trigger' + index).click({ brands: this.brands },
                  function (event) {
                    event.data.brands.forEach((otherBrand, otherIndex) => {
                      if (otherIndex !== index) {
                        $('.dl-trigger' + otherIndex).next()
                          .removeClass('dl-menuopen');
                      }
                    });
                  });

                $('#dl-menu' + index).dlmenu();
              });
            });
          }
        }
      );
    });    

    this.role = this.currentUser.role;
  }

  opensearch() {
    this.searchPanel.open()
  }

  openCollection() {
    this.collectionsPanel.open()
  }

  registration() {
    this.registrationPanel.open()
  }

  viewdownlogs() {
    this.viewdownlogsPanel.open()
  }

  goto(cat) {
    if (cat.childs.length == 0) {
      this.router.navigate([this.categoryurl, cat.category_id]);
      $('.dl-menuopen').removeClass('dl-menuopen');
    }
  }

  rrcount() {
    this.anonymous.count().subscribe(
      (data) => {
        this.holdcount = data;
      }
    );
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/sign-in']);
  }
}

$(document).ready(function () {
  $('#corporate').click(function () {
    var checked = $(this).prop('checked');
    if (checked) $('#checkboxes').find('input:checkbox').trigger('click');
  });
});

