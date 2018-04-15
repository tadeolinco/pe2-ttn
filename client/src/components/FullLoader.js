import React from 'react'
import { Loader } from 'semantic-ui-react'

const FullLoader = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Loader active content="Loading" />
    </div>
  )
}

export default FullLoader
