import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import user
import { ArtistListComponent } from './components/artist-list.components';
//IMport artist
import { UserEditComponent } from './components/user-edit.component';

const appRoutes: Routes = [
	{path:'', component: ArtistListComponent},
	{path:'artist/:page', component: ArtistListComponent},
	{path:'mis-datos', component: UserEditComponent},
	{path:'**', component: UserEditComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
