import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Login from '../auth/Login';
import Bookings from '../booking/Bookings';
import Events from '../event/Events';

export class Main extends Component {
  render() {
    return (
      <main>
        <Switch>
            <Redirect from='/' to='/login' exact />
            <Route exact path='/login' component={Login} />
            <Route exact path='/bookings' component={Bookings} />
            <Route exact path='/events' component={Events} />
        </Switch>
      </main>
    )
  }
}

export default Main;
