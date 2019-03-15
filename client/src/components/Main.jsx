import React from "react";
import { Switch, Route } from "react-router-dom";
import About from "./About";
import SummaryReport from "./SummaryReport-component/SummaryReport";

import Home from "./Home";
import Login from "./Login";
import Contact from "./Contact";
import Form from "./form";
import Report from "./Reports-components/Report";
import AuditTrail from "./audit-trail-component/audit-trail";
const Main = () => {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/about" component={About} />
      <Route exact path="/Login" component={Login} />
      <Route exact path="/Report" component={Report} />
      <Route exact path="/Audit-trail" component={AuditTrail} />
      <Route exact path="/SummaryReport" component={SummaryReport} />
      <Route
        exact
        path="/contact"
        component={() => {
          return (
            <main>
              <section>
                <h2>Contact Us</h2>
                <Form />
              </section>
            </main>
          );
        }}
      />
    </Switch>
  );
};

export default Main;
