import React from 'react';
import {RouteComponentProps} from 'react-router-dom';

export default function Type0({location}: RouteComponentProps<{}, {}, {url: string}>) {
  return (
    <div className='rg-type0'>
      <iframe className='rg-web' src={location.state.url}></iframe>
    </div>
  );
}
