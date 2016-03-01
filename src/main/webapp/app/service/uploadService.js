System.register(['rxjs/add/operator/map', "rxjs/Observable", 'angular2/http', 'angular2/core', "angular2/src/facade/lang", "angular2/http", "angular2/src/http/http_utils"], function(exports_1) {
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
    var __param = (this && this.__param) || function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };
    var Observable_1, http_1, core_1, lang_1, http_2, http_utils_1, http_3, http_4, http_utils_2;
    var UploadService;
    return {
        setters:[
            function (_1) {},
            function (Observable_1_1) {
                Observable_1 = Observable_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (lang_1_1) {
                lang_1 = lang_1_1;
            },
            function (http_2_1) {
                http_2 = http_2_1;
                http_3 = http_2_1;
                http_4 = http_2_1;
            },
            function (http_utils_1_1) {
                http_utils_1 = http_utils_1_1;
                http_utils_2 = http_utils_1_1;
            }],
        execute: function() {
            UploadService = (function () {
                function UploadService(path) {
                    this.path = path;
                }
                UploadService.prototype.createOrganisation = function (body, file) {
                    var _this = this;
                    return new Observable_1.Observable(function (responseObserver) {
                        //http://stackoverflow.com/questions/21329426/spring-mvc-multipart-request-with-json/25183266#25183266
                        if (file.type.split("/")[0] != "image") {
                            var options = new http_3.ResponseOptions({ body: "You have to select an image", type: http_4.ResponseType.Error });
                            responseObserver.error(new http_1.Response(options));
                            responseObserver.complete();
                        }
                        else {
                            var formdata = new FormData();
                            formdata.append("file", file);
                            formdata.append("body", new Blob([body], { type: "application/json" }));
                            var request = new XMLHttpRequest();
                            request.onload = function () {
                                //https://github.com/angular/angular/blob/master/modules/angular2/src/http/backends/xhr_backend.ts
                                var body = lang_1.isPresent(request.response) ? request.response : request.responseText;
                                //https://github.com/angular/angular/blob/master/modules/angular2/src/http/headers.ts
                                var headers = http_2.Headers.fromResponseHeaderString(request.getAllResponseHeaders());
                                //https://github.com/angular/angular/blob/master/modules/angular2/src/http/http_utils.ts
                                var url = http_utils_1.getResponseURL(request);
                                var status = request.status === 1223 ? 204 : request.status;
                                if (status === 0) {
                                    status = body ? 200 : 0;
                                }
                                var responseOptions = new http_3.ResponseOptions({ body: body, status: status, headers: headers, url: url });
                                var response = new http_1.Response(responseOptions);
                                if (http_utils_2.isSuccess(status)) {
                                    responseObserver.next(response);
                                    // TODO(gdi2290): defer complete if array buffer until done
                                    responseObserver.complete();
                                    return;
                                }
                                responseObserver.error(response);
                            };
                            request.onerror = function (err) {
                                var responseOptions = new http_3.ResponseOptions({ body: err, type: http_4.ResponseType.Error });
                                responseObserver.error(new http_1.Response(responseOptions));
                            };
                            request.open("POST", _this.path + "organisations/image", true);
                            request.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("id_token"));
                            request.send(formdata);
                        }
                    });
                };
                UploadService = __decorate([
                    core_1.Injectable(),
                    __param(0, core_1.Inject('App.BackEndPath')), 
                    __metadata('design:paramtypes', [String])
                ], UploadService);
                return UploadService;
            })();
            exports_1("UploadService", UploadService);
        }
    }
});
//# sourceMappingURL=uploadService.js.map