(function () {
    'use strict';
    /*global Backbone, $, moment*/

    window.App = {
        Models: {},
        Collections: {},
        Views: {},
        Router: null
    };


    App.Views.BasicView = Backbone.View.extend({
        initialize: function (params) {
            params = _.extend({fetch: true}, params);

            this.listenTo(this.model, "change", this.render);

            // prevent re-fetch when instanced from collections
            if (params.fetch === true) {
                this.model.fetch({ error: this.error.bind(this) });
            }
        },

        render: function () {
            this.$el.html(this.template(this.model.attributes));
            return this;
        },

        error: function () {
            return true;
        }
    });


    App.Views.ListView = Backbone.View.extend({
        initialize: function () {
            this.listenTo(this.collection, "reset", this.render);
            this.collection.fetch({ reset: true, error: this.error.bind(this) });

            this.fragment = document.createDocumentFragment();
            return this;
        },

        render: function () {
            this.collection.each(this.addOne, this);
            this.$el.html(this.fragment);

            // ready to append to dom
            this.trigger('ready');

            return this;
        },

        addOne: function (model) {

            var view = new this.subView({ model: model, fetch: false });
            view.render().$el.appendTo(this.fragment);
            return this;
        },

        error: function () {
            return true;
        }
    });







    //  Form classes

    App.Views.FormView = Backbone.View.extend({
        tagName: "form",

        id: "start",

        events: {
            "submit": "submit"
        },

        template: _.template('<input type="text" name="username" placeholder="Type a github username and press enter" autofocus />'),

        initialize: function () {
            this.$el.html(this.template()).attr('action', '#');
        },

        submit: function (e) {
            e.preventDefault();

            var username = this.$el.find('input').val();
            App.Router.navigate(username, {trigger: true});

            return true;
        }
    });








    //  Language classes

    App.Models.Language = Backbone.Model.extend();


    App.Views.LanguageView = App.Views.BasicView.extend({
        tagName: "div",

        className: "lang",

        template: "langview"
    });


    App.Views.LanguageListView = App.Views.ListView.extend({
        tagName: "div",

        subView: App.Views.LanguageView
    });


    App.Collections.Languages = Backbone.Collection.extend({
        model: App.Models.Language,

        initialize: function (url) {
            this.url = url;
        },

        // github send us a key value pair, transform it into a model data
        parse: function (langs) {
            var i, languages = [], total = _.reduce(langs, function (memo, num) { return memo + num; }, 0);

            for (i in langs) {
                if (langs.hasOwnProperty(i)) {
                    languages.push({ name: i, lines_count: langs[i], percent: (langs[i] * 100 / total).toFixed(1) });
                }
            }

            return languages;
        }
    });








    //  Repository classes

    App.Models.Repository = Backbone.Model.extend({
        idAttribute: "full_name",

        // Add a easily readable "updated_since" property to github repo object
        parse: function (attributes) {
            attributes.updated_since = moment(attributes.updated_at).fromNow();
            return attributes;
        },

        // We cannot rely on backbone urlRoot because it makes an encodeURIComponent and breaks the final URL
        url: function () {
            return "https://api.github.com/repos/" + this.id;
        }
    });


    App.Views.RepositoryView = App.Views.BasicView.extend({
        tagName: "div",

        id: "repo",

        template: "repoview",

        render: function () {
            var languages, view;


            languages   = new App.Collections.Languages(this.model.attributes.languages_url);
            view        = new App.Views.LanguageListView({ collection: languages });

            languages.on('reset', function () {
                this.$el.html(this.template(this.model.attributes));
                this.$el.find("p.languages").append(view.$el);

                this.trigger('ready');
            }, this);

            return this;
        },

        error: function () {
            this.$el.html("<span class=\"error\">Whoops, we can't find the repository in github!</span>");

            // notify we found and error
            this.trigger("error");

            return this;
        }
    });


    App.Collections.Repositories = Backbone.Collection.extend({
        model: App.Models.Repository,

        initialize: function (url) {
            this.url = url;
        },

        // sort by star count and fork count from higher to lower values
        comparator: function (a, b) {
            if (a.get("stargazers_count") === b.get("stargazers_count")) {
                return a.get("watchers_count") < b.get("watchers_count") ? 1 : -1;
            }

            return a.get("stargazers_count") < b.get("stargazers_count") ? 1 : -1;
        }
    });


    App.Views.RepositoryLiView = App.Views.BasicView.extend({
        tagName: "li",

        template: "liview"
    });


    App.Views.RepositoryListView = App.Views.ListView.extend({
        tagName: "ul",

        id: "repos",

        subView: App.Views.RepositoryLiView,

        error: function () {
            this.$el.html("<li class=\"error\">Whoops, we can't find the username in github. Do you write the username correctly?</li>");

            // notify we found and error
            this.trigger("error");

            return this;
        }
    });






    //  User classes

    App.Models.User = Backbone.Model.extend({
        idAttribute: "login",

        urlRoot: "https://api.github.com/users",

        getRepositories: function () {
            var url = "https://api.github.com/users/" + this.id + "/repos";

            return new App.Collections.Repositories(url);
        }
    });

    App.Views.UserView = App.Views.BasicView.extend({
        el: $("#user"),

        template: "userview"
    });








    App.Views.MainView = Backbone.View.extend({

        // Base the view on an existing element
        el: $("#content"),


        // Render the form/list/repo views based on the router params
        render: function (username, repository) {
            this.$el.empty().addClass("loading");

            if (username) {
                this.user = new App.Views.UserView({
                    model: new App.Models.User({ login: username })
                });

                // draw a single repo or a list
                if (repository) {
                    this.view = new App.Views.RepositoryView({
                        model: new App.Models.Repository({ full_name: username + "/" + repository })
                    });

                } else {
                    this.view = new App.Views.RepositoryListView({
                        collection: this.user.model.getRepositories()
                    });
                }

                this.view.on("ready", this.show.bind(this));

                // custom error event listener, so we provide some feedback to the user 
                this.view.on("error", this.show.bind(this));
            } else {
                this.view = new App.Views.FormView();
                this.show();

                if (this.user) {
                    this.user.$el.empty();
                }
            }
        },

        // Show after ajax calls to minimize reflow/repaints
        show: function () {
            this.$el.removeClass("loading").html(this.view.$el);
        }

    });


    var mainView = new App.Views.MainView();

    var Router = Backbone.Router.extend({
        routes: {
            "":             mainView.render.bind(mainView),
            ":user":        mainView.render.bind(mainView),
            ":user/:repo":  mainView.render.bind(mainView)
        }
    });


    // Preload al templates
    function loadTemplates (cb) {
        var i, tmpl, ajax, promises = [];
        _.each(App.Views, function (view) {
            var tmpl = view.prototype.template;

            if (typeof tmpl == 'string') {
                var ajax = $.get('/templates/' + tmpl + '.html', function (res) {
                    view.prototype.template = _.template(res);
                });

                promises.push(ajax);
            }
        });

        $.when.apply($, promises).done(cb);
    };

    App.Router = new Router();

    // preload templates and run the app
    loadTemplates(function () {
        Backbone.history.start();
    })

}());