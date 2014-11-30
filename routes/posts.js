var post = 
[{
	"title": "您好",
	"content": "今天星期日"
},
{
	"title": "Hello",
	"content": "Today is Sunday"
}];

exports.list = function (req, res) {
	res.send(post);
};

exports.create = function (req, res) {

};