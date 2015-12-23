import request from 'superagent';
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
      return (dispatch, alt) =>
        alt.resolve(async () => {
          dispatch();
          request
            .get(config.apiBaseUrl + '/healthbehaviors')
            .end((err, resp) => {
              alt.getActions('healthBehaviors').updateAllHealthBehaviors(resp.body);
            });
        });
    }

    fetchHealthBehavior(id) {
      return (dispatch, alt) =>
        alt.resolve(async () => {
          dispatch();
          request
            .get(config.apiBaseUrl + '/healthbehaviors/' + id)
            .end((err, resp) => {
              alt.getActions('healthBehaviors').updateHealthBehavior(resp.body);
            });
        });
    }

    submitHealthBehavior(healthBehavior) {
      return (dispatch, alt) =>
        alt.resolve(async () => {
          dispatch();
          request
            .post(config.apiBaseUrl + '/healthbehaviors')
            .send(healthBehavior)
            .end((err, resp) => {
              alt.getActions('healthBehaviors').updateHealthBehavior(resp.body);
            });
        });
    }

    updateHealthBehavior(healthBehavior) {
      return (dispatch, alt) =>
        alt.resolve(async () => {
          dispatch();
          request
            .put(config.apiBaseUrl + '/healthbehaviors/' + healthBehavior.id)
            .send(healthBehavior)
            .end((err, resp) => {
              alt.getActions('healthBehaviors').updateHealthBehavior(resp.body);
            });
        });
    }
}

/* If your actions are as simple as just dispatching passed values, you can use a slightly different (and more concise) API for such use case:
 * export default alt.generateActions('changeContent', 'clearForm');
 */
export default HealthBehaviorActions;