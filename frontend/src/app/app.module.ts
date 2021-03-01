import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { InitModule } from './_init/init.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LayoutComponent } from './layout/layout.component';
import { AccessComponent } from './access/access.component';
import { LogInComponent } from './access/log-in/log-in.component';
import { RegisterComponent } from './access/register/register.component';
import { RemindUserNameComponent } from './access/remind-user-name/remind-user-name.component';
import { ResetPasswordComponent } from './access/reset-password/reset-password.component';
import { SlidePanelComponent } from './layout/slide-panel/slide-panel.component';
import { NavigationComponent } from './layout/navigation/navigation.component';
import { SearchComponent } from './layout/search/search.component';
import { SearchbarComponent } from './layout/search/searchbar/searchbar.component';
import { GroupsComponent } from './mediacollections/groups/groups.component';
import { CategoriesComponent } from './mediacollections/categories/categories.component';
import { ItemlistComponent } from './mediacollections/itemlist/itemlist.component';
import { UsercollectionsComponent } from './layout/usercollections/usercollections.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminFeaturesComponent } from './admin-features/admin-features.component';
import { ManageMediaCategoriesComponent } from './admin-features/manage-media-categories/manage-media-categories.component';
import { ManageMediaItemsComponent } from './admin-features/manage-media-items/manage-media-items.component';
import { CategoryListComponent } from './admin-features/manage-media-categories/category-list/category-list.component';
import { MediaItemsListComponent } from './admin-features/manage-media-items/media-items-list/media-items-list.component';
import { ManageMediaTypesComponent } from './admin-features/manage-media-types/manage-media-types.component';
import { MediaTypesListComponent } from './admin-features/manage-media-types/media-types-list/media-types-list.component';
import { ManageUsersComponent } from './admin-features/manage-users/manage-users.component';
import { UsersListComponent } from './admin-features/manage-users/users-list/users-list.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { ManageRequestsComponent } from './admin-features/manage-requests/manage-requests.component';
import { RequestsListComponent } from './admin-features/manage-requests/requests-list/requests-list.component';
import { UserFeaturesComponent } from './user-features/user-features.component';
import { UserAccountComponent } from './user-features/user-account/user-account.component';
import { DownloadLogsComponent } from './admin-features/logs/download-logs/download-logs.component';
import { AccessesLogsComponent } from './admin-features/logs/accesses-logs/accesses-logs.component';
import { SearchResultsComponent } from './layout/search/search-results/search-results.component';
import { ChangePasswordComponent } from './access/change-password/change-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { AuthGuard } from './_guards';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { TreeviewModule } from 'ngx-treeview';
import { ToastrModule, ToastContainerModule } from 'ngx-toastr';
import { AuthenticationService, MediaService, Anonymous, 
  UserService, DownloadService, AccessesService, StatesService,
  CategoryService, ContentService, UtilityService, HttpService } from './_services';
import { NgxSpinnerModule } from 'ngx-spinner';
import { UpdatePasswordComponent } from './access/update-password/update-password.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FooterComponent } from './layout/footer/footer.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    AccessComponent,
    LogInComponent,
    RegisterComponent,
    RemindUserNameComponent,
    ResetPasswordComponent,
    SlidePanelComponent,
    NavigationComponent,
    SearchComponent,
    SearchbarComponent,    
    GroupsComponent,
    CategoriesComponent,
    ItemlistComponent,
    UsercollectionsComponent,
    AdminFeaturesComponent,
    ManageMediaCategoriesComponent,
    ManageMediaItemsComponent,
    CategoryListComponent,
    MediaItemsListComponent,    
    ManageMediaTypesComponent,
    MediaTypesListComponent,
    ManageUsersComponent,
    UsersListComponent,
    ManageRequestsComponent,
    RequestsListComponent,
    UserFeaturesComponent,
    UserAccountComponent,    
    DownloadLogsComponent,
    AccessesLogsComponent,
    SearchResultsComponent,
    ChangePasswordComponent,    
    UpdatePasswordComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    InitModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    TreeviewModule.forRoot(),
    NgxSpinnerModule,
    NgMultiSelectDropDownModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    ToastContainerModule,
    BrowserAnimationsModule,
    AngularFontAwesomeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgProgressModule,
    NgSelectModule,
    NgProgressModule.forRoot(),
    NgProgressHttpModule.forRoot(),
    NgxDatatableModule
  ],
  providers: [
    AuthGuard,    
    AuthenticationService,
    StatesService,
    CategoryService,
    MediaService,
    Anonymous,
    ContentService,
    UserService,
    DownloadService,
    AccessesService,
    UtilityService,
    HttpService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }

    // provider used to create fake backend
    //fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
