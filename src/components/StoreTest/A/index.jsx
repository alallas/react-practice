import { useEffect } from "react";
import { eventBus, eventStore } from "../../../store/eventBus";




function StoreTestA() {

  const callback = (...args) => {
    console.log('food', ...args)
  }

  useEffect(() => {
    // eventBus.on('eat', callback)

    // eventBus.once('run', (...args) => {
    //   console.log('run', ...args)
    // })


    // 监听调度中心的数据，拿到调度中心的数据
    eventStore.onState('name', (...args) => {
      console.log('name', ...args)
    })

    eventStore.onState('banners', (...args) => {
      console.log('banners', ...args)
    })


  }, [])


  return (
    <div>aaa</div>
  )

}

export default StoreTestA