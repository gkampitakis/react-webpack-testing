import React from 'react';
import Router from './Router';

export default function App () {
  console.log(process.env.NODE_ENV);
  console.log(process.env.SOME_VALUE);
  console.log(process.env.SOME_OTHER_VALUE);

  return (
    <Router />
  );
}
