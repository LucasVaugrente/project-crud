import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UtilisateurListComponent } from './pages/list-utilisateurs';
import {ReactiveFormsModule} from "@angular/forms";
import {MapComponent} from "./map/map.component";
import {HomeComponent} from "./pages/home";
import {VeloListComponent} from "./pages/list-velos";
import {LoginComponent} from "./components/LoginComponent";
import {AuthGuard} from "./guards/auth.guard";
import { ReservationComponent } from './pages/list-reservation';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  { path: '', component: HomeComponent, pathMatch: 'full'},

  { path: 'velos', component: VeloListComponent, canActivate: [AuthGuard] },
  { path: 'map', component: MapComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UtilisateurListComponent, canActivate: [AuthGuard] },

  { path: 'reservations', component: ReservationComponent, canActivate: [AuthGuard] },

  { path: '**', redirectTo: '' }
];



@NgModule({
  exports: [RouterModule],
})
export class AppRoutingModule { }
