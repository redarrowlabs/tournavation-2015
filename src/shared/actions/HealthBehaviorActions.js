import alt from '../instance-alt';
import request from 'superagent';
import Immutable from 'immutable';
import UUID from 'node-uuid';
import config from '../../config'

class HealthBehaviorActions {

  constructor() {
    // Add dispatch only actions
    this.generateActions(
      'updateAllHealthBehaviors',
      'updateHealthBehavior'
    );
  }

    fetchAllHealthBehaviors() {
      var self = this;
      return dispatch => {
        dispatch();
        request
          .get(config.apiBaseUrl + '/healthbehaviors')
          .end((err, resp) => {
            self.updateAllHealthBehaviors(resp.body);
          });
      }
    }

    fetchHealthBehavior(id) {
      var self = this;
      return dispatch => {
        dispatch();
        request
          .get(config.apiBaseUrl + '/healthbehaviors/' + id)
          .end((err, resp) => {
            self.updateHealthBehavior(resp.body);
          });
      }
    }

    submitHealthBehavior(healthBehavior) {
      var self = this;
      return dispatch => {
        dispatch();
        request
          .post(config.apiBaseUrl + '/healthbehaviors')
          .send(healthBehavior)
          .end((err, resp) => {
            self.updateHealthBehavior(resp.body);
          });
      }
    }

    updateHealthBehavior(healthBehavior) {
      var self = this;
      return dispatch => {
        dispatch();
        request
          .put(config.apiBaseUrl + '/healthbehaviors/' + healthBehavior.id)
          .send(healthBehavior)
          .end((err, resp) => {
            self.updateHealthBehavior(resp.body);
          });
      }
    }
}

/* If your actions are as simple as just dispatching passed values, you can use a slightly different (and more concise) API for such use case:
 * export default alt.generateActions('changeContent', 'clearForm');
 */
export default alt.createActions(HealthBehaviorActions);