import {Component, OnInit} from 'angular2/core'
import {Session} from "../../DOM/circleSession/session";
import {SessionService} from "../../service/sessionService";
import {RouteConfig, Router, RouterLink, ROUTER_DIRECTIVES, CanActivate} from "angular2/router";
import {tokenNotExpired} from "../../security/TokenHelper";
import {UserService} from "../../service/userService";
import {User} from "../../DOM/users/user";
import {ThemeService} from "../../service/themeService";
import {Theme} from "../../DOM/theme";
import {Card} from "../../DOM/card";
import {OrganisationService} from "../../service/organisationService";

@CanActivate(() => tokenNotExpired())

@Component({
    selector: 'add-session',
    directives: [ROUTER_DIRECTIVES, RouterLink],
    templateUrl: 'app/components/sessions/addSession.html',
})

export class AddSession implements OnInit{
    private session:Session = Session.createEmpty();
    private sessionService:SessionService;

    //DATE FIX?
    private startTime:Date;
    private endTime:Date;

    private organisationService:OrganisationService;
    private themes:Theme[];
    private currentTheme:Theme;
    private themeService:ThemeService;
    private router:Router;
    private user: User = User.createEmpty();
    private cards:Card[];
    private users: User[];
    private types:string[] = ['PROBLEM', 'IDEA'];
    private modes:string[] = ['ASYNC', 'SYNC'];


    constructor(sessionService:SessionService, private _userService:UserService, router:Router, themeService: ThemeService, organisationService : OrganisationService) {
        this.sessionService = sessionService;
        this.router = router;
        this._userService=_userService;
        this.themeService=themeService;
        this.organisationService=organisationService;
        this.users=[];

    }


    ngOnInit() {
        this.themeService.getUserThemes().subscribe((themes:Theme[])=> {
            this.themes= themes;
            this.session.themeId = themes[0].themeId;
            this.currentTheme = themes[0];
            this.cards = this.currentTheme.cards;
            this.users = this.session.users;
            this.session.theme = this.currentTheme;
            this.showUsersOrganisation()
        });
        this._userService.getCurrentUser().subscribe(u => {
            this.user = u;
        });
        this.types = ['PROBLEM', 'IDEA'];
        this.modes = ['ASYNC', 'SYNC'];
    }

    selectTheme($event){
        this.currentTheme = this.themes.find(theme => theme.themeName === $event.target.value);
        console.log("theme: " + this.currentTheme.themeId);
        this.session.theme = this.currentTheme;
        this.showUsersOrganisation();
    }

    showUsersOrganisation(){
        this.users = [];
        console.log("showOrganisationUsers") ;
        this.organisationService.getOrganisationOrganisers(this.currentTheme.organisation.organisationId).subscribe(users => {
            users.forEach(u =>{
                console.log(JSON.stringify(u));
                this.users.push(u);
            })
        });
        this.organisationService.getOrganisationMembers(this.currentTheme.organisation.organisationId).subscribe(users => {
            users.forEach(u => {
                console.log(JSON.stringify(u));
                this.users.push(u);
            })
        });
        this.cards = this.currentTheme.cards;
    }

    selectMode($event){
        this.session.type = $event.target.value;
    }

    selectType($event){
        this.session.mode = $event.target.value;
    }

    onSubmit() {


        this.session.startTime = this.startTime.toString(); //stringify date
        this.session.endTime = this.endTime.toString(); //stringify date

        console.log(JSON.stringify(this.session)) ;
        this.sessionService.createSession(this.session).subscribe(res => {
            alert(res);
            this.router.navigate(['/LoggedIn']);
        }, error => {
            alert("Something went wrong");
        });
    }


    private getImageSrc(url:string): string {
        if (url) {
            if (url.indexOf("http://") > -1) {
                return url;
            } else {
                return url.replace(/"/g, "");
            }
        }
    }

    showFullDescription(i){
        var id= "#" + i;
        var cardid = "#desc-"+i;
        var arrowid = "#arrow-" + i;
        var description = $(document).find($(id));
        var carddescription = $(document).find($(cardid));
        var arrow = $(document). find($(arrowid));
        description.css("display", "inherit");
        arrow.css("display", "inherit");
        carddescription.css("display", "none");

    }

    hideFullDescription(i){
        var id= "#" + i;
        var cardid = "#desc-"+i;
        var arrowid = "#arrow-" + i;
        var description = $(document).find($(id));
        var carddescription = $(document).find($(cardid));
        var arrow = $(document). find($(arrowid));
        description.css("display", "none");
        arrow.css("display", "none");
        carddescription.css("display", "");
    }

    logout() {
        localStorage.removeItem("id_token");
        this.router.navigate(['/Home']);
    }
}