import 'rxjs/add/operator/map'
import {Observable} from "rxjs/Observable";
import {Organisation} from "../DOM/organisation";
import {Http, Response, HTTP_PROVIDERS} from 'angular2/http'
import {Injectable, Inject} from 'angular2/core'
import {Theme} from "../DOM/theme";
import {SubTheme} from "../DOM/subTheme";
import {User} from "../DOM/users/user";
import {SecurityService} from "../security/securityService";
import {UploadService} from "./uploadService";
import {Card} from "../DOM/card";
/**
 * Created by Jordan on 29/02/2016.
 */

@Injectable()
export class ThemeService {
    private path:string;
    private securityService:SecurityService;
    private uploadService:UploadService;

    constructor(@Inject('App.BackEndPath') path:string, securityService:SecurityService, uploadService:UploadService) {
        this.path = path;
        this.securityService = securityService;
        this.uploadService = uploadService;
    }

    public getUserThemes():Observable<Theme[]> {
        return this.securityService.get(this.path + 'themes/currentUser', true)
            .map(res => res.json())
            .map((themes:Array<Theme>) => themes.map((theme:Theme) => Theme.fromJson(theme)));
    }

    public createTheme(theme:Theme,file?:File):Observable<Response> {
        if(file){
            return this.uploadService.uploadFile(JSON.stringify(theme), file, this.path + 'themes/image');
        } else {
            return this.securityService.post(this.path + 'themes', JSON.stringify(theme), true);
        }

    }

    public getTheme(id:number):Observable<Theme>{
        return this.securityService.get(this.path + 'themes/' + id,true)
            .map(res => res.json())
            .map((theme:Theme) => Theme.fromJson(theme))
    }

    public getThemeCards(themeId: number): Observable<Card[]> {
    return this.securityService.get(this.path + 'themes/' + themeId + '/cards', true)
        .map(res => res.json())
        .map((cards: Array<Card>) => cards.map((card: Card) => Card.fromJson(card)));
}

    public getThemeSubThemes(themeId: number): Observable<SubTheme[]> {
        return this.securityService.get(this.path + 'themes/' + themeId + '/subThemes', true)
            .map(res => res.json())
            .map((subthemes: Array<SubTheme>) => subthemes.map((subtheme: SubTheme) => SubTheme.fromJson(subtheme)));
    }
}
