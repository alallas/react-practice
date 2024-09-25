import React from 'react'
import './index.css'

function VirtualItemWaterfall(props) {
  const { data, colWidth } = props
  return (
    <div className="single-item" style={{lineHeight: `${data.height * colWidth / data.width}px`, transform: `translate3d(0, ${data.lastHeight}px, 0)`, width: `${colWidth}px`}} key={data.label}>
      {data.label}
    </div>
  )
}

export default React.memo(VirtualItemWaterfall)