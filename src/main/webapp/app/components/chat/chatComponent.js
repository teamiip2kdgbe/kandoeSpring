System.register(["angular2/core", "../../DOM/circleSession/message"], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
        switch (arguments.length) {
            case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
            case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
            case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
        }
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, message_1;
    var ChatComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (message_1_1) {
                message_1 = message_1_1;
            }],
        execute: function() {
            ChatComponent = (function () {
                function ChatComponent() {
                    this.messages = [];
                    this.message = "";
                }
                ChatComponent.prototype.connect = function () {
                    var _this = this;
                    //var socket = new SockJS('/Kandoe/chat'); //local
                    var socket = new SockJS('/chat'); // wildfly
                    this.stompClient = Stomp.over(socket);
                    this.stompClient.connect({}, function (frame) {
                        _this.setConnected(true);
                        _this.stompClient.subscribe('/topic/chat', function (greeting) {
                            _this.showMessage(JSON.parse(greeting.body));
                        });
                    });
                };
                ChatComponent.prototype.setConnected = function (conn) {
                    document.getElementById('connect').disabled = conn;
                    document.getElementById('disconnect').disabled = !conn;
                };
                ChatComponent.prototype.disconnect = function () {
                    if (this.stompClient != null) {
                        this.stompClient.disconnect();
                    }
                    this.setConnected(false);
                };
                ChatComponent.prototype.sendMessage = function (chatElement) {
                    var token = localStorage.getItem("id_token");
                    //todo change sessionId to variable
                    this.stompClient.send("/chat", {}, JSON.stringify({ 'content': this.message, 'token': token, 'sessionId': 1 }));
                    this.message = "";
                    chatElement.focus();
                };
                ChatComponent.prototype.showMessage = function (json) {
                    this.messages.push(message_1.Message.fromJson(json));
                };
                ChatComponent.prototype.getImageSrc = function (url) {
                    if (url) {
                        if (url.indexOf("http://") > -1) {
                            return url;
                        }
                        else {
                            return url.replace(/"/g, "");
                        }
                    }
                };
                ChatComponent = __decorate([
                    core_1.Component({
                        selector: 'chat',
                        templateUrl: 'app/components/chat/chat.html',
                        styleUrls: ['app/css/chat.css'],
                        inputs: ['messages']
                    }), 
                    __metadata('design:paramtypes', [])
                ], ChatComponent);
                return ChatComponent;
            })();
            exports_1("ChatComponent", ChatComponent);
        }
    }
});
//# sourceMappingURL=chatComponent.js.map