class HealthBehaviorActions {

  constructor() {
    // Add dispatch only actions
    this.generateActions(
      'updateAllHealthBehaviors',
      'updateCurrentHealthBehavior'
    );
  }

  fetchAllHealthBehaviors(key) {
    return (dispatch, alt) =>
      alt.resolve(async () => {
        var data = await alt.api.fetch('healthbehaviors/key', key);
        alt.getActions('healthBehaviors').updateAllHealthBehaviors({key, data});
      });
  }

  fetchHealthBehavior(id) {
    return (dispatch, alt) =>
      alt.resolve(async () => {
        var data = await alt.api.fetch('healthbehaviors', id);      
        alt.getActions('healthBehaviors').updateCurrentHealthBehavior({key: data.key, data});
      });
  }

  findHealthBehavior(key, filter) {
    return (dispatch, alt) =>
      alt.resolve(async () => {
        var data = await alt.api.fetch('healthbehaviors/key/' + key + '/filter', filter);      
        alt.getActions('healthBehaviors').updateCurrentHealthBehavior({key, data});
      });
  }

  submitHealthBehavior(healthBehavior) {
    let key = healthBehavior.get('key');
    return (dispatch, alt) =>
      alt.resolve(async () => {
        var data = await alt.api.create('healthbehaviors', healthBehavior);      
        alt.getActions('healthBehaviors').updateCurrentHealthBehavior({key, data});
      });
  }

  updateHealthBehavior(healthBehavior) {
    let key = healthBehavior.get('key');
    return (dispatch, alt) =>
      alt.resolve(async () => {
        var data = await alt.api.update('healthbehaviors', healthBehavior.get('_id'), healthBehavior);      
        alt.getActions('healthBehaviors').updateCurrentHealthBehavior({key, data});
      });
  }
}

/* If your actions are as simple as just dispatching passed values, you can use a slightly different (and more concise) API for such use case:
 * export default alt.generateActions('changeContent', 'clearForm');
 */
export default HealthBehaviorActions;