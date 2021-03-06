System.register(['rxjs/add/operator/map', 'angular2/core', "../DOM/theme", "../DOM/subTheme", "../security/securityService", "./uploadService", "../DOM/card"], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var __param = (this && this.__param) || function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };
    var core_1, theme_1, subTheme_1, securityService_1, uploadService_1, card_1;
    var ThemeService;
    return {
        setters:[
            function (_1) {},
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (theme_1_1) {
                theme_1 = theme_1_1;
            },
            function (subTheme_1_1) {
                subTheme_1 = subTheme_1_1;
            },
            function (securityService_1_1) {
                securityService_1 = securityService_1_1;
            },
            function (uploadService_1_1) {
                uploadService_1 = uploadService_1_1;
            },
            function (card_1_1) {
                card_1 = card_1_1;
            }],
        execute: function() {
            /**
             * Created by Jordan on 29/02/2016.
             */
            ThemeService = (function () {
                function ThemeService(path, securityService, uploadService) {
                    this.path = path;
                    this.securityService = securityService;
                    this.uploadService = uploadService;
                }
                ThemeService.prototype.getUserThemes = function () {
                    return this.securityService.get(this.path + 'themes/currentUser', true)
                        .map(function (res) { return res.json(); })
                        .map(function (themes) { return themes.map(function (theme) { return theme_1.Theme.fromJson(theme); }); });
                };
                ThemeService.prototype.createTheme = function (theme, file) {
                    if (file) {
                        return this.uploadService.uploadFile(JSON.stringify(theme), file, this.path + 'themes/image');
                    }
                    else {
                        return this.securityService.post(this.path + 'themes', JSON.stringify(theme), true);
                    }
                };
                ThemeService.prototype.getTheme = function (id) {
                    return this.securityService.get(this.path + 'themes/' + id, true)
                        .map(function (res) { return res.json(); })
                        .map(function (theme) { return theme_1.Theme.fromJson(theme); });
                };
                ThemeService.prototype.getThemeCards = function (themeId) {
                    return this.securityService.get(this.path + 'themes/' + themeId + '/cards', true)
                        .map(function (res) { return res.json(); })
                        .map(function (cards) { return cards.map(function (card) { return card_1.Card.fromJson(card); }); });
                };
                ThemeService.prototype.getThemeSubThemes = function (themeId) {
                    return this.securityService.get(this.path + 'themes/' + themeId + '/subThemes', true)
                        .map(function (res) { return res.json(); })
                        .map(function (subthemes) { return subthemes.map(function (subtheme) { return subTheme_1.SubTheme.fromJson(subtheme); }); });
                };
                ThemeService = __decorate([
                    core_1.Injectable(),
                    __param(0, core_1.Inject('App.BackEndPath')), 
                    __metadata('design:paramtypes', [String, securityService_1.SecurityService, uploadService_1.UploadService])
                ], ThemeService);
                return ThemeService;
            })();
            exports_1("ThemeService", ThemeService);
        }
    }
});
//# sourceMappingURL=themeService.js.map