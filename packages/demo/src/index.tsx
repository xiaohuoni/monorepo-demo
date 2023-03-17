import React from 'react';
import Loadable from 'react-loadable';

const Button = Loadable({
  loader: async () => {
    const button = await import(/* webpackChunkName: "demo" */ './button');
    return button;
  },
  loading: () => <div>Loading...</div>,
});

export { Button };
