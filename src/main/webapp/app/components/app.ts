import {Component, View, Input, Output} from 'angular2/core'
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router'
import {OrganisationsComponent} from "./organisations.component";
import {RegisterComponent} from "./register.component";
import {Home} from "./home";
import {LoggedInHome} from "./loggedInHome.component";


@Component({
    selector: 'my-kandoe'
})
@View({
    directives: [ROUTER_DIRECTIVES],
    template: `
    <router-outlet></router-outlet>
    `,
})
@RouteConfig([
    {path: '/home', as: 'Home', component: Home, useAsDefault: true},
    {path: '/loggedIn', as: 'LoggedInHome', component: LoggedInHome},
    {path: '/organisations', name: 'Organisations', component: OrganisationsComponent},
    {path: '/register', as: 'Register', component: RegisterComponent}

])
export class AppComponent {
}