
export default function (router) {
	router.route('/tests').get(function(req, res) {
	    res.send({ message: 'Test get' });
	});

	router.route('/tests/:id').get(function(req, res) {
	    res.send({ message: 'Test get: {_id}' });
	});

	router.route('/tests').post(function(req, res) {
	    res.send({ message: 'Test post' });
	});

	router.route('/tests/:id').put(function(req,res){
	    res.send({ message: 'Test put: {_id}' });
	});

	router.route('/tests/:id').delete(function(req, res) {
	    res.send({ message: 'Test delete: {_id}' });
	});

}