import './style/app.css';
import './style/upload.css';
import './style/color_blocks.css';
import './style/sliders.css';
import './style/details.css';

import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Upload from './pages/Upload';
import Loading1Page from './pages/Loading1';
import Loading2Page from './pages/Loading2';
import ResultsPage from './pages/Results';
import ViewDetails from './pages/ViewDetails';
import ModifyScheme from './pages/ModifyScheme';
import EditColor from './pages/EditColor';
import SelectedPage from './pages/Selected';


function App() {
  return (
    <div className="App">
      <Router>
        <header className="App-header">
          <Route path="/" exact>
            <Upload />
          </Route>
          <Route path="/loading1">
            <Loading1Page />
          </Route>
          <Route path="/loading2">
            <Loading2Page />
          </Route>
          <Route path="/results">
            <ResultsPage />
          </Route>
          <Route path="/selected">
            <SelectedPage />
          </Route>
          <Route path="/details">
            <ViewDetails />
          </Route>
          <Route path="/modify">
            <ModifyScheme />
          </Route>
          <Route path="/edit">
            <EditColor />
          </Route>
        </header>
      </Router>
    </div>
  );
}

export default App;
