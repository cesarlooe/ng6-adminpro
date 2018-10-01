import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { LoginGuardGuard } from '../services/service.index';
import { ProfileComponent } from './profile/profile.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { HospitalesComponent } from './hospitales/hospitales.component';
import { MedicosComponent } from './medicos/medicos.component';
import { MedicoComponent } from './medicos/medico.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    canActivate: [LoginGuardGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent, data: { title: 'Dashboard' } },
      { path: 'account-settings', component: AccountSettingsComponent, data: { title: 'Account Settings'} },
      { path: 'perfil', component: ProfileComponent, data: { title: 'Perfil de usuario'} },
      { path: 'progress', component: ProgressComponent, data: { title: 'Progress'} },
      { path: 'graficas1', component: Graficas1Component, data: { title: 'Gráficas'} },
      // Mantenimientos
      { path: 'usuarios', component: UsuariosComponent, data: { title: 'Mantenimiento de Usuarios'} },
      { path: 'hospitales', component: HospitalesComponent, data: { title: 'Mantenimiento de Hospitales'} },
      { path: 'medicos', component: MedicosComponent, data: { title: 'Mantenimiento de Médicos'} },
      { path: 'medico/:id', component: MedicoComponent, data: { title: 'Actualizar Médico'} },
      { path: '', pathMatch: 'full', redirectTo: '/dashboard' },
    ]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
