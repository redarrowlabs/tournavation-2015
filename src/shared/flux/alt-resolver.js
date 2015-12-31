const { NODE_ENV } = process.env;

class AltResolver {
  constructor() {
    this.firstRender = true;
    this.pendingActions = [];
  }

  resolve(action, setImmediate = (NODE_ENV === 'test')) {
    if ((__CLIENT__ && !this.firstRender) || setImmediate) return action();

    this.pendingActions = [ ...this.pendingActions, action ];
  }

  async dispatchPendingActions() {
    for (const action of this.pendingActions) {
    	await action();
    }
    this.pendingActions = [];
  }

}

export default AltResolver;