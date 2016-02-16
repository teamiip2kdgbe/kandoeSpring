System.register(['angular2/platform/browser', 'angular2/core', 'angular2/router', 'angular2/http', "./service/service", "./service/userService", "./components/app"], function(exports_1) {
    var browser_1, core_1, router_1, http_1, service_1, userService_1, app_1;
    return {
        setters:[
            function (browser_1_1) {
                browser_1 = browser_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (service_1_1) {
                service_1 = service_1_1;
            },
            function (userService_1_1) {
                userService_1 = userService_1_1;
            },
            function (app_1_1) {
                app_1 = app_1_1;
            }],
        execute: function() {
            browser_1.bootstrap(app_1.AppComponent, [
                // dependency injection
                service_1.Service,
                userService_1.UserService,
                // http
                http_1.HTTP_PROVIDERS,
                // routing
                router_1.ROUTER_PROVIDERS,
                core_1.provide(router_1.ROUTER_PRIMARY_COMPONENT, { useValue: app_1.AppComponent }),
                core_1.provide(router_1.APP_BASE_HREF, { useValue: "/" }),
                core_1.provide(router_1.LocationStrategy, { useClass: router_1.HashLocationStrategy }),
                core_1.provide('App.BackEndPath', { useValue: "http://wildfly-teamiip2kdgbe.rhcloud.com/api/" }),
                core_1.provide('App.DevPath', { useValue: "http://localhost:9966/Kandoe/api/" })
            ]);
        }
    }
});
//# sourceMappingURL=boot.js.map