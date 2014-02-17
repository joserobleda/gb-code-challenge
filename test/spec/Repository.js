describe("Respository Model", function() {

	beforeEach(function() {
		this.server 		= sinon.fakeServer.create();
		this.repository 	= new App.Models.Repository({full_name: 'jquery/jquery'});

		this.fakedResponse 	= '{"id":167174,"name":"jquery","full_name":"jquery/jquery","owner":{"login":"jquery","id":70142,"avatar_url":"https://gravatar.com/avatar/6906f317a4733f4379b06c32229ef02f?d=https%3A%2F%2Fidenticons.github.com%2Ff426f04f2f9813718fb806b30e0093de.png&r=x","gravatar_id":"6906f317a4733f4379b06c32229ef02f","url":"https://api.github.com/users/jquery","html_url":"https://github.com/jquery","followers_url":"https://api.github.com/users/jquery/followers","following_url":"https://api.github.com/users/jquery/following{/other_user}","gists_url":"https://api.github.com/users/jquery/gists{/gist_id}","starred_url":"https://api.github.com/users/jquery/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/jquery/subscriptions","organizations_url":"https://api.github.com/users/jquery/orgs","repos_url":"https://api.github.com/users/jquery/repos","events_url":"https://api.github.com/users/jquery/events{/privacy}","received_events_url":"https://api.github.com/users/jquery/received_events","type":"Organization","site_admin":false},"private":false,"html_url":"https://github.com/jquery/jquery","description":"jQuery JavaScript Library","fork":false,"url":"https://api.github.com/repos/jquery/jquery","forks_url":"https://api.github.com/repos/jquery/jquery/forks","keys_url":"https://api.github.com/repos/jquery/jquery/keys{/key_id}","collaborators_url":"https://api.github.com/repos/jquery/jquery/collaborators{/collaborator}","teams_url":"https://api.github.com/repos/jquery/jquery/teams","hooks_url":"https://api.github.com/repos/jquery/jquery/hooks","issue_events_url":"https://api.github.com/repos/jquery/jquery/issues/events{/number}","events_url":"https://api.github.com/repos/jquery/jquery/events","assignees_url":"https://api.github.com/repos/jquery/jquery/assignees{/user}","branches_url":"https://api.github.com/repos/jquery/jquery/branches{/branch}","tags_url":"https://api.github.com/repos/jquery/jquery/tags","blobs_url":"https://api.github.com/repos/jquery/jquery/git/blobs{/sha}","git_tags_url":"https://api.github.com/repos/jquery/jquery/git/tags{/sha}","git_refs_url":"https://api.github.com/repos/jquery/jquery/git/refs{/sha}","trees_url":"https://api.github.com/repos/jquery/jquery/git/trees{/sha}","statuses_url":"https://api.github.com/repos/jquery/jquery/statuses/{sha}","languages_url":"https://api.github.com/repos/jquery/jquery/languages","stargazers_url":"https://api.github.com/repos/jquery/jquery/stargazers","contributors_url":"https://api.github.com/repos/jquery/jquery/contributors","subscribers_url":"https://api.github.com/repos/jquery/jquery/subscribers","subscription_url":"https://api.github.com/repos/jquery/jquery/subscription","commits_url":"https://api.github.com/repos/jquery/jquery/commits{/sha}","git_commits_url":"https://api.github.com/repos/jquery/jquery/git/commits{/sha}","comments_url":"https://api.github.com/repos/jquery/jquery/comments{/number}","issue_comment_url":"https://api.github.com/repos/jquery/jquery/issues/comments/{number}","contents_url":"https://api.github.com/repos/jquery/jquery/contents/{+path}","compare_url":"https://api.github.com/repos/jquery/jquery/compare/{base}...{head}","merges_url":"https://api.github.com/repos/jquery/jquery/merges","archive_url":"https://api.github.com/repos/jquery/jquery/{archive_format}{/ref}","downloads_url":"https://api.github.com/repos/jquery/jquery/downloads","issues_url":"https://api.github.com/repos/jquery/jquery/issues{/number}","pulls_url":"https://api.github.com/repos/jquery/jquery/pulls{/number}","milestones_url":"https://api.github.com/repos/jquery/jquery/milestones{/number}","notifications_url":"https://api.github.com/repos/jquery/jquery/notifications{?since,all,participating}","labels_url":"https://api.github.com/repos/jquery/jquery/labels{/name}","releases_url":"https://api.github.com/repos/jquery/jquery/releases{/id}","created_at":"2009-04-03T15:20:14Z","updated_at":"2014-02-14T15:06:09Z","pushed_at":"2014-02-14T15:06:08Z","git_url":"git://github.com/jquery/jquery.git","ssh_url":"git@github.com:jquery/jquery.git","clone_url":"https://github.com/jquery/jquery.git","svn_url":"https://github.com/jquery/jquery","homepage":"http://jquery.com/","size":30448,"stargazers_count":29144,"watchers_count":29144,"language":"JavaScript","has_issues":false,"has_downloads":false,"has_wiki":true,"forks_count":6296,"mirror_url":null,"open_issues_count":26,"forks":6296,"open_issues":26,"watchers":29144,"default_branch":"master","master_branch":"master","organization":{"login":"jquery","id":70142,"avatar_url":"https://gravatar.com/avatar/6906f317a4733f4379b06c32229ef02f?d=https%3A%2F%2Fidenticons.github.com%2Ff426f04f2f9813718fb806b30e0093de.png&r=x","gravatar_id":"6906f317a4733f4379b06c32229ef02f","url":"https://api.github.com/users/jquery","html_url":"https://github.com/jquery","followers_url":"https://api.github.com/users/jquery/followers","following_url":"https://api.github.com/users/jquery/following{/other_user}","gists_url":"https://api.github.com/users/jquery/gists{/gist_id}","starred_url":"https://api.github.com/users/jquery/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/jquery/subscriptions","organizations_url":"https://api.github.com/users/jquery/orgs","repos_url":"https://api.github.com/users/jquery/repos","events_url":"https://api.github.com/users/jquery/events{/privacy}","received_events_url":"https://api.github.com/users/jquery/received_events","type":"Organization","site_admin":false},"network_count":6296,"subscribers_count":2696}';
		this.server.respondWith(this.fakedResponse);
	});

	afterEach(function() {
		this.server.restore();
	});

	it("should exist", function() {
		expect(App.Models.Repository).toBeDefined();
	});

	it("should have the idAttribute property as the object id", function () {
		expect(App.Models.Repository.prototype.idAttribute).toBe("full_name");
	});


	it("should has attributes attributes on fetch", function() {
		this.repository.fetch();
		this.server.respond(); 

		expect(Object.keys(this.repository.attributes).length).toBeGreaterThan(1);
	});


	it("should fire the change event on fetch", function() {
		var callback = sinon.spy();

		this.repository.bind('change', callback);
		this.repository.fetch();
		this.server.respond(); 

		expect(callback.called).toBeTruthy();
	});


	it("should has the updated_since attribute", function() {
		this.repository.fetch();

		// undefined on instance
		expect(this.repository.get('updated_since')).toBeUndefined();
		this.server.respond(); 

		// defined after fetch
		expect(this.repository.get('updated_since')).not.toBeUndefined();
	});

});