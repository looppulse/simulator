Router.configure({
	layoutTemplate: 'baseLayout'
});

Router.map(function() {
  this.route('normal', {path: '/'})
  this.route('live');
});