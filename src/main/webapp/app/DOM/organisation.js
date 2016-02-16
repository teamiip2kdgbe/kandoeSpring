System.register(["./link"], function(exports_1) {
    var link_1;
    var Organisation;
    return {
        setters:[
            function (link_1_1) {
                link_1 = link_1_1;
            }],
        execute: function() {
            Organisation = (function () {
                function Organisation(organisationId, organisationName) {
                    this.organisationId = organisationId;
                    this.organisationName = organisationName;
                }
                Organisation.fromJson = function (json) {
                    var organisation = new Organisation(json.organisationId, json.organisationName);
                    organisation.address = json.address;
                    organisation.logoUrl = json.logoUrl;
                    for (var i = 0; i < json.links.length; i++) {
                        organisation.links[i] = link_1.Link.fromJson(json.links[i]);
                    }
                    return organisation;
                };
                return Organisation;
            })();
            exports_1("Organisation", Organisation);
        }
    }
});
//# sourceMappingURL=organisation.js.map