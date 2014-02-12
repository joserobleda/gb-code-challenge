(function () {
	'use strict';


	var api = 'https://api.github.com';


    var BasicView = Backbone.View.extend({
        render: function () {
            this.$el.html(this.template(this.model.attributes));
            return this;
        }
    });

	var User = Backbone.Model.extend({
		urlRoot: api + '/users',

        getRepositories: function () {
            var id, url;

            id      = this.get('id');
            url     = api + '/users/' + id + '/repos';

            return new Repositories(url);
        }
    });


    var UserView = BasicView.extend({
 		el: $('#user'),

 		initialize: function () {
 			this.listenTo(this.model, "change", this.render);
 			this.model.fetch();
 		},

        template: _.template($("#userview").html())
    });



    var Repository = Backbone.Model.extend({

        initialize: function () {
           
        },

        url: function () {
            return api + '/repos/' + this.id;
        }
    });


    var RepositoryView = BasicView.extend({
        tagName: 'div',

        id: 'repo',

        template: _.template($("#repoview").html()),

        initialize: function () {
            this.listenTo(this.model, "change", this.render);
            this.model.fetch();
        }
    });


	
	var Repositories = Backbone.Collection.extend({
		model: Repository,

        initialize: function (url) {
            this.url = url;
        },

        // sort by star count and fork count from higher to lower values
        comparator: function (a, b) {
            if (a.get('stargazers_count') == b.get('stargazers_count')) {
                return a.get('watchers_count') < b.get('watchers_count') ? 1 : -1;
            }

            return a.get('stargazers_count') < b.get('stargazers_count') ? 1 : -1;
        },

        url: function () {
            return this.url;
        }
	});


    var LiView = BasicView.extend({
        tagName: 'li',

        template: _.template($("#liview").html())
    });


    var ListView = Backbone.View.extend({
        tagName: 'ul',

        id: 'repos',

        initialize: function () {
            this.listenTo(this.collection, "reset", this.render);
            this.collection.fetch({reset: true, error: this.error.bind(this)});

            return this;
        },


        render: function () {
            var view = this;

            this.$el.empty();

            this.collection.each(this.add.bind(this));
            return this;
        },


        add: function (repository) {
            var li = new LiView({
                model: repository
            });

            li.render().$el.appendTo(this.$el);
            return this;
        },

        error: function () {
            this.$el.html("Whoops, we can't find the username in github. Do you write the username correctly?");
        }
    });


    var App = Backbone.View.extend({

        // Base the view on an existing element
        el: $('#content'),


        // Render the main/list/repo views based on the router params
        render: function (username, repository) {
            this.$el.empty().addClass('loading');

            if (username) {
                this.user = new UserView({
                    model: new User({ id: username })
                });

                // draw a single repo or a list
                if (repository) {
                    this.view = new RepositoryView({
                        model: new Repository({ id: username + '/' + repository })
                    });

                    this.view.model.on('change', this.show.bind(this));
                } else {
                    this.view = new ListView({
                        collection: this.user.model.getRepositories()
                    });

                    this.view.collection.on('reset', this.show.bind(this));
                }
            } else {

                if (this.user) this.user.$el.empty();
            }
        },

        // Show after ajax calls to minimize reflow/repaints
        show: function () {
            this.$el.removeClass('loading').html(this.view.$el);
        }

    });


    var app = new App();

    
    var Router = Backbone.Router.extend ({
        routes: {
            '':             app.render.bind(app),
            ':user':        app.render.bind(app),
            ':user/:repo':  app.render.bind(app)
        }
    });

    
    new Router();
    Backbone.history.start();

}());