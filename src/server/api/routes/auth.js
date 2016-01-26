import request from 'superagent';
import appConfig from '../../config';

export default function (router) {
    router.route('/auth').get(function(req, res) {
      const isAuthenticated = typeof req.session.user_id != "undefined";
      const userName = isAuthenticated ? req.session.user_name : null;
      res.send({ isAuthenticated, userName });
	});
    
	router.route('/auth').post(function(req, res) {
        const id_token = req.body.id_token;
        // To verify that the token is valid, ensure that the following criteria are satisfied.
        request
          .get(appConfig.get('googleApiTokenInfoUrl'))
          .query({id_token})
          .end((err, resp) => {
              // The ID token is a JWT that is properly signed with an appropriate Google public key (available in JWK or PEM format).
              if(err || (resp && resp.status != 200)) {
                  res.status(401).send("Unable to validate Google sign in.");
                  return;
              }
              /* The value of aud in the ID token is equal to one of your app's client IDs.  This check is necessary to prevent 
               * ID tokens issued to a malicious app being used to access data about the same user on your app's backend server. */
              const aud = resp.body.aud;
              if(aud != appConfig.get('googleApiClientId')) {
                  res.status(401).send("Unable to validate Google sign in.");
                  return;
              }
              // The value of iss in the ID token is equal to accounts.google.com or https://accounts.google.com.
              const iss = resp.body.iss;
              if(iss != "accounts.google.com" && iss != "https://accounts.google.com") {
                  res.status(401).send("Unable to validate Google sign in.");
                  return;
              }
              // The expiry time (exp) of the ID token has not passed.
              const exp = resp.body.exp;
              if(exp > (new Date()).getTime()) {
                  res.status(401).send("Unable to validate Google sign in.");
                  return;
              }
              const googleId = resp.body.sub;
              req.session.user_id = googleId;
              req.session.user_name = resp.body.given_name;
	            res.send({ isAuthenticated: true, userName: req.session.user_name });
          });
	});

	router.route('/auth').delete(function(req, res) {
      req.session.destroy(function() {
        res.send('Session deleted');
      });
	});
}