import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccessComponent } from './access/access.component';
import { LayoutComponent } from './layout/layout.component';
import { GroupsComponent } from './mediacollections/groups/groups.component';
import { CategoriesComponent } from './mediacollections/categories/categories.component';
import { ItemlistComponent } from './mediacollections/itemlist/itemlist.component';
import { AdminFeaturesComponent } from './admin-features/admin-features.component';
import { CategoryListComponent } from './admin-features/manage-media-categories/category-list/category-list.component';
import { ManageMediaCategoriesComponent } from './admin-features/manage-media-categories/manage-media-categories.component';
import { MediaItemsListComponent } from './admin-features/manage-media-items/media-items-list/media-items-list.component';
import { ManageMediaItemsComponent } from './admin-features/manage-media-items/manage-media-items.component';
import { MediaTypesListComponent } from './admin-features/manage-media-types/media-types-list/media-types-list.component';
import { UsersListComponent } from './admin-features/manage-users/users-list/users-list.component';
import { RequestsListComponent } from './admin-features/manage-requests/requests-list/requests-list.component';
import { DownloadLogsComponent } from "./admin-features/logs/download-logs/download-logs.component";
import { AccessesLogsComponent } from "./admin-features/logs/accesses-logs/accesses-logs.component";
import { AuthGuard } from './_guards';
import { SearchResultsComponent } from './layout/search/search-results/search-results.component';
import { UpdatePasswordComponent } from './access/update-password/update-password.component'


const routes: Routes = [
  {
    path: 'sign-in',
    component: AccessComponent,
  },
  {
    path: 'sign-in/:key',
    component: AccessComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'groups',
        component: GroupsComponent, canActivate: [AuthGuard]
      },
      {
        path: 'update-password',
        component: UpdatePasswordComponent
      },
      {
        path: '',
        component: GroupsComponent, canActivate: [AuthGuard]
      },
      {
        path: 'categories',
        component: CategoriesComponent, canActivate: [AuthGuard]
      },
      {
        path: 'categories/:brand',
        component: CategoriesComponent, canActivate: [AuthGuard]
      },
      {
        path: 'category',
        component: ItemlistComponent, canActivate: [AuthGuard]
      },
      {
        path: 'category/:category',
        component: ItemlistComponent, canActivate: [AuthGuard]
      },
      {
        path: 'searchresults',
        component: SearchResultsComponent,
      },
    ]
  },
  {
    path: '',
    component: AdminFeaturesComponent,
    children: [
      {
        path: 'mng-categories-list',
        component: CategoryListComponent, canActivate: [AuthGuard]
      },
      {
        path: 'mng-category',
        component: ManageMediaCategoriesComponent, canActivate: [AuthGuard]
      },
      {
        path: 'mng-item-list',
        component: MediaItemsListComponent, canActivate: [AuthGuard]
      },
      {
        path: 'mng-item/:paramKey',
        component: ManageMediaItemsComponent, canActivate: [AuthGuard]
      },
      {
        path: 'mng-item',
        component: ManageMediaItemsComponent, canActivate: [AuthGuard]
      },
      {
        path: 'mng-media-types',
        component: MediaTypesListComponent, canActivate: [AuthGuard]
      },
      {
        path: 'mng-users',
        component: UsersListComponent, canActivate: [AuthGuard]
      },
      {
        path: 'mng-requests',
        component: RequestsListComponent, canActivate: [AuthGuard]
      },
      {
        path: 'download-logs',
        component: DownloadLogsComponent, canActivate: [AuthGuard]
      },
      {
        path: 'accesses-logs',
        component: AccessesLogsComponent, canActivate: [AuthGuard]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
