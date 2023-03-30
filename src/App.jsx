import { Route, Switch, useLocation } from "wouter";
import React from "react";

import style from "./App.Style";
import SessionSettings from "./containers/SessionSettings";
import ConferenceSettings from "./containers/ConferenceSettings";
import Conference from "./containers/Conference";
import ProtectedRoute from "./containers/ProtectedRoute.js";

function App({ className }) {
  const [location] = useLocation();

  return (
    <div className={className}>
      <Switch location={location}>
        <Route path="/" component={SessionSettings} />
        <Route path="/session" component={SessionSettings} />
        <ProtectedRoute path={"/conference"} component={ConferenceSettings} />
        <ProtectedRoute
          path="/conference/:conferenceName"
          component={Conference}
        />
        <Route path="/:rest*">
          {(params) => `404, Sorry the page ${params.rest} does not exist!`}
        </Route>
      </Switch>
    </div>
  );
}

export default style(App);
