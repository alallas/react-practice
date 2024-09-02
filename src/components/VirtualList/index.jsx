import { useCallback, useEffect, useRef, useState } from "react"
import VirtualItem from "./VirtualItem"
import './index.css'

const totalCount = 100
const singleItemHeight = 40
const visibleHeight = window.innerHeight

function getDataApi() {
  const data = new Promise((resolve, reject) => {
    const d = new Array(totalCount).fill(0).map((item, index) => `${index}`)
    setTimeout(() => {
      resolve(d)
    }, 500)
  })
  return data
}

async function getData() {
  const res = await getDataApi()
  return res
}


const totalData = await getData() || []
console.log(totalData)


// 并非无限滚动
// 最外层容器是有固定高度的


function VirtualList() {
  const [scrollTop, setScrollTop] = useState(0)
  const [dataList, setDataList] = useState([])


  const addVisibleChild = () => {
    // 上缓冲区开始位置(上滚动过的有多少个)
    const startIndex = Math.max(Math.floor(scrollTop / singleItemHeight), 0)

    // 中间有多少个（可视的有多少个）
    const middleVisibleItemCount = Math.ceil(visibleHeight / singleItemHeight)

    // 下缓冲区结束位置（加上底部兜底的2个，总共有多少个）
    const downBufferEndIndex = Math.min(startIndex + middleVisibleItemCount + 2, totalCount)

    const sectionData = totalData.slice(startIndex, downBufferEndIndex)
    setDataList(sectionData)
  }

  const onContainerScroll = (e) => {
    console.log('event', e.target.scrollTop)
    const limit = (totalCount * singleItemHeight) - (visibleHeight)
    if (e.target.scrollTop >= limit) {
      console.log('e.target.scrollTop >= limit')
    }
    const scrollTop = e.target.scrollTop >= limit ? limit : e.target.scrollTop
    setScrollTop(scrollTop)
    addVisibleChild()
  }

  useEffect(() => {
    addVisibleChild()
  }, [])

  return (
    <div className="whole-data-container" style={{height: `${visibleHeight}px`}} onScroll={(e) => onContainerScroll(e)}>
      <div style={{height: `${totalCount * singleItemHeight}px`}}/>
      <div className="whole-data-inner" style={{top: `${scrollTop}px`}}>
        {
          dataList.map((item) => (
            <VirtualItem data={item} key={item}/>
          ))
        }
      </div>
    </div>
  )
}

export default VirtualList