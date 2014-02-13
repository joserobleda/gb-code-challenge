(function () {
    'use strict';
    /*global Backbone, $, moment*/

    var app, router, api;

    // github api root
    api = "https://api.github.com";
    var auth   = "?access_token=cd0484bc7dc743010a75fed6ca80dd046211e20d";


    // Common classes

    var BasicView = Backbone.View.extend({
        initialize: function (params) {
            params = _.extend({fetch: true}, params);

            this.listenTo(this.model, "change", this.render);

            // prevent re-fetch when instanced from collections
            if (params.fetch === true) {
                this.model.fetch({ error: this.error.bind(this) });
            }

            // easy template creation
            if (typeof this.template === "string") {
                this.template = _.template($("#" + this.template).html());
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

    var ListView = Backbone.View.extend({

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

    var FormView = Backbone.View.extend({
        tagName: "form",

        id: "start",

        events: {
            "submit": "submit"
        },

        template: _.template($("#formview").html()),

        initialize: function () {
            this.$el.html(this.template()).attr('action', '#');
        },

        submit: function (e) {
            e.preventDefault();

            var username = this.$el.find('input').val();
            router.navigate(username, {trigger: true});

            return true;
        }
    });








    //  Language classes

    var Language = Backbone.Model.extend();


    var LanguageView = BasicView.extend({
        tagName: "div",

        className: "lang",

        template: "langview"
    });


    var LanguageListView = ListView.extend({
        tagName: "div",

        subView: LanguageView
    });


    var Languages = Backbone.Collection.extend({
        model: Language,

        initialize: function (url) {
            this.url = url + auth;
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

    var Repository = Backbone.Model.extend({
        idAttribute: "full_name",

        // Add a easily readable "updated_since" property to github repo object
        parse: function (attributes) {
            attributes.updated_since = moment(attributes.updated_at).fromNow();
            return attributes;
        },

        // We cannot rely on backbone urlRoot because it makes an encodeURIComponent and breaks the final URL
        url: function () {
            return api + "/repos/" + this.id + auth;
        }
    });


    var RepositoryView = BasicView.extend({
        tagName: "div",

        id: "repo",

        template: "repoview",

        render: function () {
            var languages, view;


            languages   = new Languages(this.model.attributes.languages_url);
            view        = new LanguageListView({ collection: languages });

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


    var Repositories = Backbone.Collection.extend({
        model: Repository,

        initialize: function (url) {
            this.url = url + auth;
        },

        // sort by star count and fork count from higher to lower values
        comparator: function (a, b) {
            if (a.get("stargazers_count") === b.get("stargazers_count")) {
                return a.get("watchers_count") < b.get("watchers_count") ? 1 : -1;
            }

            return a.get("stargazers_count") < b.get("stargazers_count") ? 1 : -1;
        }
    });


    var RepositoryLiView = BasicView.extend({
        tagName: "li",

        template: "liview"
    });


    var RepositoryListView = ListView.extend({
        tagName: "ul",

        id: "repos",

        subView: RepositoryLiView,

        error: function () {
            this.$el.html("<li class=\"error\">Whoops, we can't find the username in github. Do you write the username correctly?</li>");

            // notify we found and error
            this.trigger("error");

            return this;
        }
    });






    //  User classes

    var User = Backbone.Model.extend({
        idAttribute: "login",

        urlRoot: api + "/users",

        getRepositories: function () {
            var url = api + "/users/" + this.id + "/repos";

            return new Repositories(url);
        }
    });

    var UserView = BasicView.extend({
        el: $("#user"),

        template: "userview"
    });







    // Main handlers

    var App = Backbone.View.extend({

        // Base the view on an existing element
        el: $("#content"),


        // Render the form/list/repo views based on the router params
        render: function (username, repository) {
            this.$el.empty().addClass("loading");

            if (username) {
                this.user = new UserView({
                    model: new User({ login: username })
                });

                // draw a single repo or a list
                if (repository) {
                    this.view = new RepositoryView({
                        model: new Repository({ full_name: username + "/" + repository })
                    });

                } else {
                    this.view = new RepositoryListView({
                        collection: this.user.model.getRepositories()
                    });
                }

                this.view.on("ready", this.show.bind(this));

                // custom error event listener, so we provide some feedback to the user 
                this.view.on("error", this.show.bind(this));
            } else {
                this.view = new FormView();
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


    app = new App();

    var Router = Backbone.Router.extend({
        routes: {
            "":             app.render.bind(app),
            ":user":        app.render.bind(app),
            ":user/:repo":  app.render.bind(app)
        }
    });


    router = new Router();
    Backbone.history.start();

}());