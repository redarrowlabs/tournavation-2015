class HealthBehaviorActions {
  //displayName = 'HealthBehaviorActions'

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
        var data = await alt.api.fetchAll('healthbehaviors');      
        alt.getActions('healthBehaviors').updateAllHealthBehaviors(data);
      });
  }

  fetchHealthBehavior(id) {
    return (dispatch, alt) =>
      alt.resolve(async () => {
        var data = await alt.api.fetch('healthbehaviors', id);      
        alt.getActions('healthBehaviors').updateHealthBehavior(data);
      });
  }

  submitHealthBehavior(healthBehavior) {
    return (dispatch, alt) =>
      alt.resolve(async () => {
        var data = await alt.api.create('healthbehaviors', healthBehavior);      
        alt.getActions('healthBehaviors').updateHealthBehavior(data);
      });
  }

  updateHealthBehavior(healthBehavior) {
    return (dispatch, alt) =>
      alt.resolve(async () => {
        var data = await alt.api.update('healthbehaviors', id, healthBehavior);      
        alt.getActions('healthBehaviors').updateHealthBehavior(data);
      });
  }
}

/* If your actions are as simple as just dispatching passed values, you can use a slightly different (and more concise) API for such use case:
 * export default alt.generateActions('changeContent', 'clearForm');
 */
export default HealthBehaviorActions;