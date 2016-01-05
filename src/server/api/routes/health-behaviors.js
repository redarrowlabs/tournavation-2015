import HealthBehaviors from '../models/health-behaviors';

export default function (router) {
	router.route('/healthbehaviors').get(function(req, res) {
		HealthBehaviors.find(function(err, healthbehaviors) {
	    if (err) {
	      return res.send(err);
	    }

	    res.json(healthbehaviors);
	  });
	});

	router.route('/healthbehaviors/:id').get(function(req, res) {
		HealthBehaviors.findOne({_id: req.params.id}, function(err, healthbehavior) {
	    if (err) {
	      return res.send(err);
	    }

	    res.json(healthbehavior);
	  });
	});

	router.route('/healthbehaviors/key/:key').get(function(req, res) {
		HealthBehaviors.find({key: req.params.key}, function(err, healthbehaviors) {
	    if (err) {
	      return res.send(err);
	    }

	    res.json(healthbehaviors);
	  });
	});

	router.route('/healthbehaviors/filter/:filter').get(function(req, res) {
		HealthBehaviors.findOne({filter: req.params.filter}, function(err, healthbehavior) {
	    if (err) {
	      return res.send(err);
	    }

	    res.json(healthbehavior);
	  });
	});

	router.route('/healthbehaviors').post(function(req, res) {
	  var key = req.body.key;
	  delete req.body.key;
	  var filter = req.body.filter;
	  delete req.body.filter;
	  var healthBehavior = new HealthBehaviors({
	  	user: 'system',
	  	key: key,
	  	filter: filter,
	  	data: req.body.data});

	  healthBehavior.save(function(err) {
	    if (err) {
	      return res.send(err);
	    }

	    res.send({ message: 'Health Behavior Added' });
	  });
	});

	router.route('/healthbehaviors/:id').put(function(req,res){
		HealthBehaviors.findOne({ _id: req.params.id }, function(err, healthbehavior) {
	    if (err) {
	      return res.send(err);
	    }

	    for (prop in req.body) {
	      healthbehavior[prop] = req.body[prop];
	    }

	    healthbehavior.save(function(err) {
	      if (err) {
	        return res.send(err);
	      }

	      res.send({ message: 'Health Behavior updated!' });
	    });
	  });
	});

	router.route('/healthbehaviors/:id').delete(function(req, res) {
		HealthBehaviors.remove({
	    _id: req.params.id
	  }, function(err, movie) {
	    if (err) {
	      return res.send(err);
	    }

	    res.send({ message: 'Successfully deleted' });
	  });
	});

}