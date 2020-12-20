import React, { Component } from 'react'
import { SyncLoader } from 'react-spinners';

function Loader() {
  return (
    <div className='columns is-centered is-fullwidth is-flex is-marginless' style={{ height: '100%' }}>
      <div className='column is-half is-narrow has-text-centered is-flex is-justify-center is-align-center'>
        <div>
          <SyncLoader color='#999' size={8} margin='2px' />
        </div>
      </div>
    </div>
  )
}

export default Loader
