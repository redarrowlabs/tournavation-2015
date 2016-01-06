export default class SubmitActions {

  constructor() {
    // Add dispatch only actions
    this.generateActions(
      'allowSubmit',
      'didSubmit'
    );
  }
}