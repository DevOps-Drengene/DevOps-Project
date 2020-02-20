import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import PublicTimeline from './pages/Timeline/PublicTimeline';
import MyTimeline from './pages/Timeline/MyTimeline';
import UserTimeline from './pages/Timeline/UserTimeline';
import { UserProvider } from './helpers/UserContext';
import Nav from './components/Nav';

export default function App() {
  return (
    <Router>
      <UserProvider>
        <div className="page">
          <h1>MiniTwit</h1>
          <Nav />
          <div className="body">
            <Switch>
              <Route exact path="/public">
                <PublicTimeline />
              </Route>
              <Route exact path="/login">
                <Login />
              </Route>
              <Route exact path="/register">
                <Register />
              </Route>
              <Route exact path="/:username">
                <UserTimeline />
              </Route>
              <Route exact path="/">
                <MyTimeline />
              </Route>
            </Switch>
          </div>
          <div className="footer">
            MiniTwit &mdash; A React Application
          </div>
        </div>
      </UserProvider>
    </Router>
  );
}
