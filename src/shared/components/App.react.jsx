import React from "react";
import { Router, Route, Link } from 'react-router';

// Class component - can have state
// Can only return a single node
// - Remember that it is ~ return React.createElement('h1', null, 'Hello'); -- can't return two elements!
const App = React.createClass({

  getInitialState() {
    return {
      txt: 'this is the state text',
      cat: 'something else'
    };
  },

  render() {
    var childrenWithProps = React.Children.map(this.props.children, function(child) {
        return React.cloneElement(child, { selectedDate: Date.now() });
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
          <h1>Health Heroes!</h1>
          {childrenWithProps}
        </div>
      </div>
    );
  }
});

App.propTypes = {
  txt: React.PropTypes.string,
  cat: React.PropTypes.number
};

App.defaultProps = {
  txt: 'this is the default txt'
};

// Stateless function component
//const App = () => <h1>Hello there!</h1>;

export default App;