import HealthBehaviors from '../models/health-behaviors';

export default function (router) {
	router.route('/healthbehaviors').get(function(req, res) {
		HealthBehaviors.find({ user: req.session.user_id }, function(err, healthbehaviors) {
	    if (err) {
	      return res.send(err);
	    }

	    res.json(healthbehaviors);
	  });
	});

	router.route('/healthbehaviors/:id').get(function(req, res) {
		HealthBehaviors.findOne({user: req.session.user_id, _id: req.params.id}, function(err, healthbehavior) {
	    if (err) {
	      return res.send(err);
	    }

	    res.json(healthbehavior);
	  });
	});

	router.route('/healthbehaviors/key/:key').get(function(req, res) {
		HealthBehaviors.find({user: req.session.user_id, key: req.params.key}, function(err, healthbehaviors) {
	    if (err) {
	      return res.send(err);
	    }

	    res.json(healthbehaviors);
	  });
	});

	router.route('/healthbehaviors/key/:key/filter/:filter').get(function(req, res) {        
		HealthBehaviors.findOne({user: req.session.user_id, key: req.params.key, filter: req.params.filter}, function(err, healthbehavior) {
	    if (err) {
	      return res.send(err);
	    }

	    res.json(healthbehavior);
	  });
	});

	router.route('/healthbehaviors').post(function(req, res) {
	  var key = req.body.key;
	  var filter = req.body.filter;
	  var healthbehavior = new HealthBehaviors({
	  	user: req.session.user_id,
	  	key: key,
	  	filter: filter,
	  	data: req.body.data});

	  healthbehavior.save(function(err) {
	    if (err) {
	      return res.send(err);
	    }

	    res.json(healthbehavior);
	  });
	});

	router.route('/healthbehaviors/:id').put(function(req,res){
		HealthBehaviors.findOne({user: req.session.user_id, _id: req.params.id }, function(err, healthbehavior) {
	    if (err) {
	      return res.send(err);
	    }

	    for (let prop in req.body) {
	      healthbehavior[prop] = req.body[prop];
	    }

	    healthbehavior.save(function(err) {
	      if (err) {
	        return res.send(err);
	      }

	      res.json(healthbehavior);
	    });
	  });
	});

	router.route('/healthbehaviors/:id').delete(function(req, res) {
		HealthBehaviors.remove({
          user: req.session.user_id,
	      _id: req.params.id
	  }, function(err, movie) {
	    if (err) {
	      return res.send(err);
	    }

	    res.send({ message: 'Successfully deleted' });
	  });
	});

}