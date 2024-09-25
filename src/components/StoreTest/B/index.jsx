import { useEffect } from "react";
import { eventBus, eventStore } from "../../../store/eventBus";




function StoreTestB() {


  useEffect(() => {

    // eventBus.emit('eat', 'egg', 'apple')
    // eventBus.emit('eat', 'bananer')

    // eventBus.emit('run', 'playground')
    // eventBus.emit('run', 'home')

    // 给调度中心注入数据，发布（不需要实现订阅，就可以直接发布，因为key已经存在仓库了）
    eventStore.setState('name', 'zyl')

    eventStore.dispatch('fetchData')

  }, [])


  return (
    <div>bbb</div>
  )

}

export default StoreTestB