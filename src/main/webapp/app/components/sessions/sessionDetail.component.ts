import {Component, OnInit} from 'angular2/core'
import {tokenNotExpired} from "../../security/TokenHelper";
import {RouteParams, Router, RouterLink, ROUTER_DIRECTIVES, CanActivate} from "angular2/router";
import {SessionService} from "../../service/sessionService";
import {Card} from "../../DOM/card";
import {Session} from "../../DOM/circleSession/session";
import {UserService} from "../../service/userService";
import {User} from "../../DOM/users/user";
import {Person} from "../../DOM/users/person";
import {CardService} from "../../service/cardService";
import {ChatComponent} from "../chat/chatComponent";
import {Message} from "../../DOM/circleSession/message";
import {Json} from "angular2/src/facade/lang";

@CanActivate(() => tokenNotExpired())

@Component({
    selector: 'session-detail',
    directives: [ROUTER_DIRECTIVES, RouterLink, ChatComponent],
    templateUrl: 'app/components/sessions/sessionDetail.html',
})

export class SessionDetailComponent implements OnInit{
    private sessionService: SessionService;
    private router: Router;
    private session: Session = Session.createEmpty();
    private sessionId: number;
    private size: Array<number> = [];
    private cards: Card[] = [Card.createEmpty()];
    private users: User[] = [];
    private user: User = User.createEmpty();
    private userService: UserService;
    private cardService: CardService;
    private card:Card = Card.createEmpty();
    private file:File = null;
    private canPlay:Boolean = false;

    stompClient;
    messages: Message[] = [];


    constructor(sesService: SessionService, userService:UserService, cardService:CardService, router: Router, routeParams: RouteParams){
        this.sessionService = sesService;
        this.router = router;
        this.sessionId = +routeParams.params["id"];
        this.userService = userService;
        this.cardService = cardService;
        this.connect();
    }

    ngOnInit(){
        this.sessionService.getSessionById(this.sessionId).subscribe(s => {
            this.session = s;
            var j = s.size;
            for(var i = 0; i < s.size; i++){
                this.size[i] = --j;
            }

            this.cards = s.cards;
            this.users = s.users;
        }, e => {
            this.router.navigate(["/LoggedInHome"])
        });

        this.userService.getCurrentUser().subscribe(u => {
            this.user = u;
            this.sessionService.checkCanPlay(this.sessionId).subscribe(r => {
                console.log(r.json());
                this.canPlay = r.json();
            })
        });

        this.sessionService.getChatHistory(this.sessionId).subscribe((messages: Message[]) => {
            console.log(JSON.stringify(messages));
            this.messages = messages;
        }, e => {
            console.log(e.text());
        })
    }

    /*
    ------------------------------------ USER PLAYING ---------------------------
     */
    getVisibility(userId){
        var currUser = null;
        for(var j = 0; j < this.users.length; j++){
            var u = this.users[j];
            if(u.userId == userId){
                currUser = u;
            }
        }
        if(currUser.position == 0) {
            return("visibility: visible");
        }else {
            return("visibility: hidden");
        }
    }

    /*
    ------------------------------------ CIRCLE CARDS POSITIONING ---------------------------
     */

    getPosition(i, cardId ?: number){
        var c = this.cards[i];
        var position = this.session.size - 1 - c.position;

        var id = "#" + i;
        var el = $(document).find($(id));
        var elWidthPx = $(el).css("width");
        var elWidth = parseInt(elWidthPx, 10);
        var elHeightPx = $(el).css("height");
        var elHeight = parseInt(elHeightPx, 10);

        var circle = document.getElementById("circle-"+position);
        var radius = Number($(circle).attr("r"));

        var rotationDegree = 360/(this.cards.length);
        var step = (2*Math.PI)/this.cards.length;
        var middleWidth = this.calculateWidthCentre();
        var middleHeight = this.calculateHeightCentre();

        var x = Math.round(middleWidth + radius * Math.cos(step*i) - (elWidth+10) / 2);
        var y = Math.round(middleHeight + radius * Math.sin(step*i) - (elWidth+20)/2);

        return "top:" + y + "px; left: " + x + "px; transform: rotate(" + (90+(rotationDegree*i)) + "deg)";
    }

    changePosition(i){
        if(this.session.state == "IN_PROGRESS"){
            var card = this.cards[i];
            var id = "#" + i;
            var el = $(document).find($(id));
            var stopId = "#play-" + this.user.userId;
            var stopped = $(document).find($(stopId));
            var next = null;
            for(var j = 0; j < this.users.length; j++){
                var u = this.users[j];
                if(u.position == 1){
                    next = u;
                }
            }

            var playId = "#play-" + (u.userId);
            var playing = $(document).find($(playId));
            $(playing).css({opacity: 0.0, visibility: "visible"}).animate({opacity: 1.0}, 2000);
            $(stopped).css({opacity: 1.0, visibility: "hidden"}).animate({opacity: 0.0}, 2000);
            if(card.position < (this.session.size-1) && this.canPlay) {
                this.stompClient.send("/move", {}, JSON.stringify({'token': localStorage.getItem("id_token"),
                    'sessionId': this.sessionId, 'cardId': card.cardId}));
                $(el).load("sessionDetail.html");
            } else if(card.position == (this.session.size-1)){
                $(document).find("#card-element-winner").text(card.description);
                var img = $(document).find("#card-img-winner");
                img.attr("src", this.getImageSrc(card.imageURL));
                var popup = $(document).find("#winner-popup");
                $(popup).css({opacity: 0.0, visibility: "visible"}).animate({opacity: 1.0}, 2500);
            }
        }
    }

    calculateWidthCentre(){
        var width = document.getElementById("circlesvg").getBoundingClientRect().width;
        return width/2;
    }

    calculateHeightCentre(){
        var height= document.getElementById("circlesvg").getBoundingClientRect().height;
        return height/2;
    }

    /*
    -------------------------------- GENERAL --------------------------------
     */


    private getImageSrc(url:string): string {
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

    logout() {
        localStorage.removeItem("id_token");
        this.router.navigate(['/Home']);
    }

    /*
    ----------------------------------- ADD CARD ----------------------------------------
     */

    onAddCard(){
        this.card.themeId = +this.session.theme.themeId;
        this.cardService.createCard(this.card, this.file).subscribe(res => {
            this.file = null;
            this.session.theme.cards.push(res);
        })
    }

    onFileChange($event){
        this.file = $event.target.files[0];
    }

    /*
    ----------------------------------- CARD SELECTION ----------------------------------
     */

    onSelectCard($event){
        this.countChecked();
    }

    countChecked() {
        var count = $("input:checked").length;
        if(count >= this.session.maxCards){
            $("input:checkbox:not(:checked)").prop('disabled', true);
        } else {
            $("input:checkbox:not(:checked)").prop('disabled', false);
        }
    }

    onChooseCards() {
        var count = $("input:checked").length;
        if(count >= this.session.minCards) {
            var cardIds = Array<number>();
            var i = 0;
            $("input:checked").each(function() {
                cardIds[i++] = $(this).val();
                console.log($(this).val());
            });

            this.session.chosenCards = true;
            this.stompClient.send("/addCards", {}, JSON.stringify({'token': localStorage.getItem("id_token"),
                'sessionId': this.sessionId, 'cardIds': cardIds}));
        }
    }

    /*
     ------------------------- CARD DESCRIPTION SLIDE-OVER -------------------------
     */

    showFullDescription(i){
        var id= "#" + i;
        var descid = "#desc-"+i;
        var cardIngame = $(document).find($(id));
        var carddescription = $(document).find($(descid));
        cardIngame.css("background","rgb(255, 156, 68)");
        cardIngame.css("color","white");
        carddescription.css("display", "inherit");

    }

    hideFullDescription(i){
        var id= "#" + i;
        var descid = "#desc-"+i;
        var cardIngame = $(document).find($(id));
        var carddescription = $(document).find($(descid));
        cardIngame.css("background", "rgba(255, 255, 255, 0.6)");
        cardIngame.css("color","rgb(0,0,0)");
        carddescription.css("display", "none");
    }

    endSession(){
        var cardId = $("input:checked").val();
        console.log(cardId);
        this.stompClient.send("/endSession", {}, JSON.stringify({'sessionId': this.sessionId,'cardId': cardId,
            'token': localStorage.getItem("id_token")}));

    }

    /*
    -------------------------------WebSockets-------------------------------------
    */

    connect() {
        this.disconnect();
        //var socket = new SockJS('/Kandoe/circleSession'); //local
        var socket = new SockJS('/circleSession'); // wildfly
        this.stompClient = Stomp.over(socket);
        this.stompClient.connect({}, frame => {

            this.stompClient.subscribe('/topic/chat', greeting => {
                this.showMessage(JSON.parse(greeting.body));
            });

            this.stompClient.subscribe('/topic/move', result => {
                var resultii=JSON.parse(result.body);
                var ii;
                var card;
                for (var i = 0; i < this.cards.length; i++){
                    if(this.cards[i].cardId == resultii.cardId){
                        ii = i;
                        card = this.cards[i];
                    }
                }

                var playId = "#play-" + resultii.nextUserId;
                var stopId = "#play-" + this.user.userId;
                var playing = $(document).find($(playId));
                var stopped = $(document).find($(stopId));
                $(playing).css({opacity: 0.0, visibility: "visible"}).animate({opacity: 1.0}, 2000);
                $(stopped).css({opacity: 1.0, visibility: "hidden"}).animate({opacity: 0.0}, 2000);

                this.canPlay = resultii.nextUserId == this.user.userId;

                var id = "#"+ ii;
                var el = $(document).find($(id));
                card.position = card.position + 1;
                if(card.position < (this.session.size-1)) {
                    $(el).load("sessionDetail.html");
                } else if(card.position == (this.session.size-1)){
                    $(document).find("#card-element-winner").text(card.description);
                    var img = $(document).find("#card-img-winner");
                    img.attr("src", this.getImageSrc(card.imageURL));
                    var popup = $(document).find("#winner-popup");
                    $(popup).css({opacity: 0.0, visibility: "visible"}).animate({opacity: 1.0}, 2500);
                }
            });

            this.stompClient.subscribe('/topic/addCards', result => {
                var json = JSON.parse(result.body);
                var session = Session.fromJson(json);

                var chosen = this.session.chosenCards;
                this.session = session;
                this.cards = session.cards;
                this.users = session.users;
                this.session.chosenCards = chosen;
            });

            this.stompClient.subscribe('/topic/endSession', result => {
                var json = JSON.parse(result.body);

                if(json.sessionId == this.sessionId){
                    this.cardService.getCardById(json.cardId).subscribe(card => {
                        $(document).find("#card-element-session-ended").text(card.description);
                        var img = $(document).find("#card-img-session-ended");
                        img.attr("src", this.getImageSrc(card.imageURL));
                        $(document).find("#card-element-session-finished").text(card.description);
                        var img = $(document).find("#card-img-session-finished");
                        img.attr("src", this.getImageSrc(card.imageURL));

                    });
                    var popup = $(document).find("#session-ended-popup");
                    $(popup).css({opacity: 0.0, visibility: "visible"}).animate({opacity: 1.0}, 2500);
                }
            });
        });
    }

    disconnect() {
        if (this.stompClient != null) {
            this.stompClient.disconnect();
        }
    }

    sendMessage(message) {
        var token = localStorage.getItem("id_token");

        this.stompClient.send("/chat", {}, JSON.stringify({'content': message, 'token': token, 'sessionId': this.sessionId}));
    }

    showMessage(json: string) {
        this.messages.push(Message.fromJson(json));
    }

    reloadGame(){
        location.reload();
    }
}
