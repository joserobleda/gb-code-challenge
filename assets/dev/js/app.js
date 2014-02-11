(function () {
	'use strict';


	var api = 'https://api.github.com';

	var User = Backbone.Model.extend({
		urlRoot: api + '/users',

        getRepositories: function () {
            var id, url;

            id      = this.get('id');
            url     = api + '/users/' + id + '/repos';

            return new Repositories(url);
        }
    });


    var UserView = Backbone.View.extend({
 		el: $('#user'),

 		initialize: function () {
 			this.listenTo(this.model, "change", this.render);

 			this.model.fetch();
 		},

        template: _.template($("#userview").html()),

 		render: function () {
 			this.$el.html(this.template(this.model.toJSON()));
 		}
    });


    var ListView = Backbone.View.extend({
        el: $('#repos'),

        initialize: function () {
            this.listenTo(this.collection, "reset", this.render);
            this.collection.fetch({reset: true});
        },

        render: function () {
            console.log(this.collection);
            this.$el.html('Found ' + this.collection.length + " repos");
        }
    });


    var Repository = Backbone.Model.extend({

    });


	// Create a collection of services
	var Repositories = Backbone.Collection.extend({
		model: Repository,


        url: function () {
            return this.url;
        },

        initialize: function (url) {
            this.url = url;
        }
	});



    var App = Backbone.View.extend({

        // Base the view on an existing element
        el: $('#main'),


        initialize: function () {
            
        },

        setUser: function (username) {
            var user, repositories;

            user            = new User({id: username});
            repositories    = user.getRepositories();

            this.user = new UserView({
                model: user
            });

            this.repositories = new ListView({
                collection: repositories
            });
        },

        hideUser: function () {
            if (this.user) this.user.$el.empty();
        }

    });


    var app = new App();

    
    var Router = Backbone.Router.extend ({
        routes: {
            '':             'home',
            ':user':        'user',
            ':user/:repo':  'repo'
        },

        home: function () {
            app.hideUser();
        },

        user: function (username) {
            app.setUser(username);
        },

        repo: function (username, repo) {
            app.setUser(username);
        }
    });


    //define our new instance of router
    var router = new Router();
     
    // use html5 History API
    Backbone.history.start();

    router.navigate('/joserobleda'); 



}());