import React, { lazy, Suspense } from 'react';
import {
  Switch,
  Route,
  BrowserRouter
} from 'react-router-dom';
import { Grid, CircularProgress } from '@material-ui/core';
import AppBar from './components/AppBar';
import NotFound from './components/NotFound';

export default function Router () {
  return (
    <BrowserRouter>
      <AppBar />
      <Grid justify='center' container>
        <Switch>
          <Route path='/send-email' component={LazyComponent('/SendEmail')} />
          <Route path='/drafts' component={LazyComponent('/Drafts')} />
          <Route path='/inbox' component={LazyComponent('/Inbox')} />
          <Route path='/starred' component={LazyComponent('/Starred')} />
          <Route path='/all-email' component={LazyComponent('/AllEmail')} />
          <Route path='/spam' component={LazyComponent('/Spam')} />
          <Route path='/trash' component={LazyComponent('/Trash')} />
          <Route exact path='/' component={LazyComponent('/Home')} />
          <Route component={NotFound} />
        </Switch>
      </Grid>
    </BrowserRouter>
  );
}

function LazyComponent (component: string) {
  return function Wrapper () {
    const Component = lazy(() => import(`./components${component}`)
      .catch((e) => {
        console.log(e);

        return import('./components/NotFound')
      }));

    return (
      <Suspense fallback={<CircularProgress />}><Component /></Suspense >
    );
  }
}