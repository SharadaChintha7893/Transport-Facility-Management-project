import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { AddRideComponent } from './components/add-ride/add-ride.component';
import { RideListComponent } from './components/ride-list/ride-list.component';
import { RideBookComponent } from './components/ride-book/ride-book.component';
import { RideFilterComponent } from './components/ride-filter/ride-filter.component';

const routes: Routes = [
  { path: 'riderList', component: RideListComponent },
  { path: 'add', component: AddRideComponent },
  { path: 'book/:id', component: RideBookComponent },
  { path: '**', redirectTo: '' },
  { path: '', component: RideListComponent }
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HeaderComponent,
    AddRideComponent,
    RideListComponent,
    RideBookComponent,
    RideFilterComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
