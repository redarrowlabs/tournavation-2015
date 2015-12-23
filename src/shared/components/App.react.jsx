import React, {PropTypes} from 'react';
import { Router, Route, Link } from 'react-router';

// Class component - can have state
// Can only return a single node
// - Remember that it is ~ return React.createElement('h1', null, 'Hello'); -- can't return two elements!
const App = React.createClass({

  contextTypes: { flux: PropTypes.object.isRequired },

  getInitialState() {
    return {
      selectedDate: Date.now(),
    };
  },

  render() {
    var childrenWithProps = React.Children.map(this.props.children, child => {
        return React.cloneElement(child, { selectedDate: this.state.selectedDate });
    });

    return (
      <div>
        <header id="navigation">
          <nav>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/track">Track</Link></li>
            </ul>
          </nav>
        </header>

        <div>
          <h1>HealthHero!</h1>
          {childrenWithProps}
        </div>
      </div>
    );
  }
});

// Stateless function component
//const App = () => <h1>Hello there!</h1>;
export default App;