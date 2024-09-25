import { useCallback, useEffect, useRef, useState } from "react"
import VirtualItemWaterfall from "./VirtualItemWaterfall"
import './index.css'


const singleItemHeight = 40
const visibleHeight = document.body.clientHeight || document.documentElement.clientHeight

function getDataApi(totalCount, times) {
  const data = new Promise((resolve, reject) => {
    const d = new Array(totalCount).fill(0).map((item, index) => {
      const diffHeight = Math.ceil(Math.random() * 10)
      const diffWidth = Math.ceil(Math.random() * 10)
      return ({
        width: diffWidth,
        height: diffHeight,
        label: `第${times}次的${index}`
      })
    })
    setTimeout(() => {
      resolve(d)
    }, 500)
  })
  return data
}


// 假如数据返回的是图片，且图片的高度是不知道的，如何拿到这个图片的高度
// 在图片未渲染之前，如何占位
// 图片渲染之后，拿到高度，再计算总高度吗？



function VirtualListWaterfall() {
  const listContainer = useRef(null)
  const [colWidth, setColWidth] = useState(0)
  const [tList, setTList] = useState([])

  const colNum = 2

  function getColWidth(colNum) {
    if (listContainer.current) {
      const width = listContainer.current.clientWidth
      const colWidth = (500 - (10*Math.max(colNum-1, 0))) / colNum
      setColWidth(colWidth)
      return colWidth
    }
  }

  function totalListData(colNum) {
    let list = []
    for(let i = 0; i < colNum; i++) {
      list.push({
        id: `${i}ge`,
        childList: [],
        childListHeight: 0
      })
    }
    return list
  }

  function minHeightIndex(arr) {
    let minH = Infinity, minIndex = 0
    for(let i = 0; i < arr.length; i++) {
      if (arr[i].childListHeight < minH) {
        minH = arr[i].childListHeight
        minIndex = i
      }
    }
    return minIndex
  }

  async function getData(colWidth) {
    const res = await getDataApi(50, 1)
    console.log(res)
    let list = totalListData(colNum)
    let i = 0
    while(i < res.length) {
      const minIndex = minHeightIndex(list)
      console.log('list', list)

      // 更新最短的那个列表和其高度
      const curHeight = (res[i].height * colWidth / res[i].width) + 10
      const HeightToPlus = curHeight + list[minIndex].childListHeight
      const listToInput = [
        ...list[minIndex].childList,
        {
          ...res[i],
          lastHeight: list[minIndex].childListHeight,
        }
      ]
      list = [
        ...list.slice(0, minIndex),
        {
          id: `${minIndex}ge`,
          childList: listToInput,
          childListHeight: HeightToPlus,
        },
        ...list.slice(minIndex + 1)
      ]
      i++
    }
    console.log("list", list)
    setTList(list)

  }

  // async function getData() {
  //   const res = await getDataApi(50, 1)
  //   console.log(res)
  //   let i = 0
  //   let list1 = []
  //   let list2 = []
  //   while(i < res.length) {
  //     console.log('i start', i)
  //     list1.push(res[i++])
  //     console.log('i middle', i)
  //     if (i < res.length) {
  //       list2.push(res[i++])
  //     }
  //     console.log('i end', i)
  //   }
  //   setCol1(list1)
  //   setCol2(list2)
  // }
  

  useEffect(() => {
    const colWidth = getColWidth(colNum)
    getData(colWidth)
  }, [])

  return (
    <div className="list" ref={listContainer}>
      {
        tList.map((item) => (
          <div className="col" style={{width: `${colWidth}px`}} key={item.childListHeight}>
            {
              item.childList.map((i) => (
                <VirtualItemWaterfall data={i} colWidth={colWidth} />
              ))
            }
          </div>
        ))
      }
    </div>
  )
}

export default VirtualListWaterfall