{
    var db = connect('localhost/booklog');

    db.posts.find().forEach(function(post) {
	    print("Fixing..." + post._id);

        post.orders = [];
        db.posts.save(post);
    });

    print("Info: 001-add-field-orders finished.");
}
