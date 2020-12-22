import React from 'react'
import PropTypes from 'prop-types'
import Loader from 'react-loader-spinner'

function CustomLoader (props) {
  const { size } = props

  let width = 48
  let height = 48

  if (size === 'small') {
    width = 32
    height = 32
  }

  if (size === 'large') {
    width = 64
    height = 64
  }

  return (
    <div className='has-text-centered'>
      <Loader type='ThreeDots' color='#ddd' height={height} width={width} />
    </div>
  )
}

CustomLoader.propTypes = {
  size: PropTypes.string
}

CustomLoader.defaultProps = {
  size: 'medium'
}

export default CustomLoader
