var events = require('events');

exports.list = function(req, res){
	var model = req.app.db.model.Post;
 	
   	model
  		.aggregate([
            {
                $project: { _id: 1, title: 1, content: 1, userId: 1 }
            }
  		])
  		.exec(function(err, posts) {
  			req.app.db.model.Post.populate(posts, {path: 'userId'}, function() {
	 		  	res.send({
	 		  		posts: posts
	 		  	});
	 		  	res.end();
  			});
   		});
};

exports.listByTag = function(req, res){
	var model = req.app.db.model.Post;
	var tag = req.params.tag;

  	model
  		.find({$text: {$search: tag}})
  		.populate('userId')
  		.exec(function(err, posts) {
		  	res.send({
		  		posts: posts
		  	});
		  	res.end();
  		});
};

exports.create = function(req, res){
	var workflow = new events.EventEmitter();
	var model = req.app.db.model.Post;
	var title = req.body.title;
	var content = req.body.content;

	var userId = req.user._id;

	workflow.outcome = {
		success: false,
		errfor: {}
	};

	workflow.on('validation', function() {
		if(title.length === 0)
			workflow.outcome.errfor.subject = '這是必填欄位';
		if(content.length === 0)
			workflow.outcome.errfor.subject = '這是必填欄位';
		if(Object.keys(workflow.outcome.errfor).length !== 0)
			return workflow.emit('response');
		workflow.emit('savePost');
	});

	workflow.on('savePost', function() {
		var post = new model({
			userId: userId,
			title: title,
			content: content
		});
		post.save();

		workflow.outcome.success = true;
		workflow.emit('response');
	});

	workflow.on('response', function() {
		res.send(workflow.outcome);
	});
	
	workflow.emit('validation');
};