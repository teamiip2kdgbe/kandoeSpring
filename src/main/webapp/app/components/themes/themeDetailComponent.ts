import {Component} from "angular2/core";
import {OnInit} from "angular2/core";
import {RouteConfig, Router, RouterLink, ROUTER_DIRECTIVES, CanActivate} from "angular2/router";
import {ThemeService} from "../../service/themeService";
import {tokenNotExpired} from "../../security/TokenHelper";
import {Theme} from "../../DOM/theme";
import {Organisation} from "../../DOM/organisation";
import {RouteParams} from "angular2/router";
import {User} from "../../DOM/users/user";
import {UserService} from "../../service/userService";
import {Card} from "../../DOM/card";
import {CardService} from "../../service/cardService";
import {SubTheme} from "../../DOM/subTheme";
import {SubThemeService} from "../../service/subThemeService";

@CanActivate(() => tokenNotExpired())

@Component({
    selector: 'theme-detail',
    directives: [ROUTER_DIRECTIVES, RouterLink],
    templateUrl: 'app/components/themes/themeDetailComponent.html',
    inputs: ['theme']
})

export class ThemeDetailComponent implements OnInit {
    public theme:Theme = Theme.createEmpty();
    private themeId:number;
    public org:Organisation = Organisation.createEmpty();
    private cards:Card[] = [];
    private subTheme:SubTheme = SubTheme.createEmpty();
    private themes:Theme[] = [];
    private router:Router;
    private card:Card = Card.createEmpty();
    private file:File = null;
    private fileSubtheme:File = null;
    private csvFile:File = null;
    private cardService:CardService;
    private subThemeService:SubThemeService;
    private user:User = User.createEmpty();
    private userService:UserService;

    constructor(private _themeService:ThemeService, router:Router, userService:UserService,
                routeParams:RouteParams, cardService:CardService, subThemeService:SubThemeService) {
        this.userService = userService;
        this.router = router;
        this.themeId = +routeParams.params["id"];
        this.cardService = cardService;
        this.subThemeService = subThemeService;
    }

    ngOnInit() {
        this._themeService.getTheme(this.themeId).subscribe(theme => {
            this.theme = theme;
            this.org = this.theme.organisation;
        });
        this._themeService.getUserThemes(this.themeId).subscribe((themes:Theme[]) => {
            this.themes = themes;
        });
        this._themeService.getThemeCards(this.themeId).subscribe(cards => {
            this.cards = cards;
        });

        this.userService.getCurrentUser().subscribe(u => {
            this.user = u;
        });

        this._themeService.getThemeSubThemes(this.themeId).subscribe(subThemes => {
            this.theme.subThemes = subThemes;
        });
    }

    onSelectCardsSubTheme($event) {
        this.countChecked();
    }

    countChecked() {
        var count = $("input:checked").length;
        $("input:checkbox:not(:checked)").prop('disabled', false);
    }


    onSubmit() {
        if (this.card.description) {
            this.card.themeId = +this.themeId;
            this.cardService.createCard(this.card, this.file).subscribe(c => {
                this.card.description = null;
                this.file = null;
                this.cards.push(c);
            }, error => {
                //todo change error display
                this.file = null;
                alert(error.text());
            });
        }
    }

    onSubmitSubTheme() {
        if (this.subTheme.description) {
            this.subThemeService.createSubTheme(this.subTheme, this.fileSubtheme).subscribe(st => {

                this.themes.find(th => th.themeId == st.themeId).subThemes.push(st);
                this.subTheme.description = null;
                this.fileSubtheme = null;
            }, error => {
                //todo change error display
                this.fileSubtheme = null;
                alert(error.text());
            });
        }

        var count = $("input:checked").length;

        var cardIds = Array<number>();
        var i = 0;
        $("input:checked").each(function () {
            cardIds[i++] = $(this).val();
            console.log($(this).val());
        });
        this.subThemeService.addCards(cardIds, this.subTheme.subThemeId).subscribe(subTheme => {
            this.subTheme = subTheme;
            this.cards = subTheme.cards;
            this.subTheme.chosenCards = true;

        }, e => {
            console.log(e.text());
        });
    }


    onAddSubTheme(themeId:number) {
        this.subTheme.subThemeId = themeId;
    }

    onFileChange($event) {
        this.file = $event.target.files[0];
        var output = document.getElementById("cardimg");
        output.src = URL.createObjectURL($event.target.files[0]);
    }

    onFileChangeSubTheme($event) {
        this.fileSubtheme = $event.target.files[0];

        var output = document.getElementById("subthemeImg");
        output.src = URL.createObjectURL($event.target.files[0]);
    }

    logout() {
        localStorage.removeItem("id_token");
        this.router.navigate(['/Home']);
    }

    onCSVFileChange($event) {
        this.csvFile = $event.target.files[0];
    }

    onSubmitCSV() {
        if (!this.csvFile) return;
        console.log("File type: " + this.csvFile.type);
        this.cardService.createCardFromCSV(this.themeId, this.csvFile).subscribe(
            (data) => {
                for (var c in data.json()) {
                    console.log(c);
                    this.cards.push(c);
                }
            },
            (error) => {
                console.log("Error uploading csv: " + error);
            },
            () => {
                console.log("gefefeffv")
            }
        );
    }

    private getImageSrc(url:string):string {
        if (url) {
            if (url.indexOf("http://") > -1) {
                return url;
            } else {
                return url.replace(/"/g, "");
            }
        } else {
            return "./app/resources/noimgplaceholder.png";
        }
    }


}