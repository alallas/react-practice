import React from 'react'
import './index.css'

function VirtualItem(props) {
  const { data } = props
  return (
    <div className="single-item">
      {data}
    </div>
  )
}

export default React.memo(VirtualItem)