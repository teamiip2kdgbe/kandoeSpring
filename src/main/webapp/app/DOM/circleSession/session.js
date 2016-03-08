System.register(["../card"], function(exports_1) {
    var card_1;
    var Session;
    return {
        setters:[
            function (card_1_1) {
                card_1 = card_1_1;
            }],
        execute: function() {
            Session = (function () {
                function Session() {
                }
                Session.fromJson = function (json) {
                    var session = new Session();
                    session.sessionId = json.sessionId;
                    session.sessionMode = json.sessionMode;
                    session.sessionType = json.sessionType;
                    session.minCards = json.minCards;
                    session.maxCards = json.maxCards;
                    //dates might not work
                    session.startTime = new Date(json.startTime);
                    session.endTime = new Date(json.endTime);
                    session.size = json.size;
                    session.userAddCards = json.userAddCards;
                    if (json.cards) {
                        for (var i = 0; i < json.cards.length; i++) {
                            session.cards[i] = card_1.Card.fromJson(json.cards[i]);
                        }
                    }
                    return session;
                };
                return Session;
            })();
            exports_1("Session", Session);
        }
    }
});
//# sourceMappingURL=session.js.map