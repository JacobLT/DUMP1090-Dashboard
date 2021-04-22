import React from 'react';

const Dashboard = React.lazy(() => import('./views/Dashboard'));
const Radar = React.lazy(() => import('./views/Radar'));
const Live = React.lazy(() => import('./views/Live'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/radar', name: 'Radar', component: Radar },
  { path: '/live', name: 'Live', component: Live },
];

export default routes;
