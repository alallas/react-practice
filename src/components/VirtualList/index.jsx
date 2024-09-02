import { useCallback, useEffect, useRef, useState } from "react"
import VirtualItem from "./VirtualItem"
import './index.css'


const singleItemHeight = 40
const visibleHeight = document.body.clientHeight || document.documentElement.clientHeight

function getDataApi(totalCount, times) {
  const data = new Promise((resolve, reject) => {
    const d = new Array(totalCount).fill(0).map((item, index) => `第${times}次的${index}`)
    setTimeout(() => {
      resolve(d)
    }, 500)
  })
  return data
}


// 并非无限滚动
// 最外层容器是有固定高度的


function VirtualList() {
  const [scrollTop, setScrollTop] = useState(0)
  const [dataList, setDataList] = useState([])
  const [totalData, setTotalData] = useState([])
  const [atBottom, setAtBottom] = useState(false)


  const addVisibleChild = () => {
    // 上缓冲区开始位置(上滚动过的有多少个)
    const startIndex = Math.max(Math.floor(scrollTop / singleItemHeight), 0)

    // 中间有多少个（可视的有多少个）
    const middleVisibleItemCount = Math.ceil(visibleHeight / singleItemHeight)

    // 下缓冲区结束位置（加上底部兜底的2个，总共有多少个）
    const downBufferEndIndex = Math.min(startIndex + middleVisibleItemCount + 2, totalData.length)

    const sectionData = totalData.slice(startIndex, downBufferEndIndex)
    setDataList(sectionData)
  }

  const onContainerScroll = async (e) => {
    console.log('event', e.target.scrollTop)
    const limit = (totalData.length * singleItemHeight) - visibleHeight
    if (e.target.scrollTop >= limit) {
      console.log('e.target.scrollTop >= limit')
    }
    const scrollTop = e.target.scrollTop >= limit ? limit : e.target.scrollTop
    setScrollTop(scrollTop)

    //滚动到底部
    const totalHeightValue = totalData.length * singleItemHeight
    console.log('totalData.length', totalData.length)
    if (scrollTop >= totalHeightValue - visibleHeight - 200){
      console.log('滚到底部了')
      if (!atBottom) {
        setAtBottom(true)
      }
    }
  }


  async function getData(totalCount, times) {
    const res = await getDataApi(totalCount, times)
    console.log('getData', res.length, res)
    setTotalData([...totalData, ...res])
  }

  // 需要挂载就去拿数据，填充totalData
  useEffect(() => {
    getData(50, 1)
  }, [])

  // 需要挂载就去拿数据，且每次滚动的时候都更新当前视口数据，且数据再次请求有新增的时候也更新
  useEffect(() => {
    addVisibleChild()
  }, [scrollTop, totalData])


  const getNewData = async () => {
    console.log('执行callback')
    await getData(100, 2)
    setAtBottom(false)
  }

  // 只是要更新，不需要挂载执行，因此要加判断条件
  useEffect(() =>{
    if (atBottom) {
      getNewData()
    }
  }, [atBottom])

  
  return (
    <div className="whole-data-container" style={{height: `${visibleHeight}px`}} onScroll={(e) => onContainerScroll(e)}>
      <div style={{height: `${totalData.length * singleItemHeight}px`}}/>
      <div className="whole-data-inner" style={{transform: `translate3d(0, ${scrollTop}px, 0)`}}>
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