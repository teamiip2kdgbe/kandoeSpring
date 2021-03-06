import {Injectable, Inject} from 'angular2/core'
import {Observable} from "rxjs/Observable";
import {Http, Response, HTTP_PROVIDERS} from 'angular2/http'
import {UploadService} from "./uploadService";
import {SecurityService} from "../security/securityService";
import {Card} from "../DOM/card";


@Injectable()
export class CardService {
    private path:string;
    private securityService:SecurityService;
    private uploadService:UploadService;

    constructor(@Inject('App.BackEndPath') path: string,securityService:SecurityService, uploadService: UploadService) {
        this.path = path;
        this.securityService=securityService;
        this.uploadService = uploadService;
    }

    public getCardById(id: number): Observable<Card> {
        return this.securityService.get(this.path + 'cards/' + id, true)
            .map(res => res.json())
            .map((card: Card) => Card.fromJson(card));
    }

    public createCard(card: Card, file?: File): Observable<Card> {
        var value: Observable<Response>;
        if(file){
            value = this.uploadService.uploadFile(JSON.stringify(card), file, this.path + 'cards/image')
        } else {
            value = this.securityService.post(this.path + 'cards', JSON.stringify(card), true);
        }
        return value.map(res => res.json())
            .map((card: Card) => Card.fromJson(card));
    }

    public createCardForSubTheme(card: Card, file?: File): Observable<Card> {
        var value: Observable<Response>;
        if(file){
            value = this.uploadService.uploadFile(JSON.stringify(card), file, this.path + 'cards/subTheme/image')
        } else {
            value = this.securityService.post(this.path + 'cards/subTheme', JSON.stringify(card), true);
        }
        return value.map(res => res.json())
            .map((card: Card) => Card.fromJson(card));
    }

    public createCardFromCSV(themeId: number, csvFile: File): Observable<Card>{
        return this.uploadService.uploadCSVFile("", csvFile, this.path + "cards/" + themeId + "/csv");
    }

}
