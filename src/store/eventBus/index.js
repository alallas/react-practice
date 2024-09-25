import { HYEventBus, HYEventStore } from "hy-event-store"

const eventBus = new HYEventBus()

const eventStore = new HYEventStore({
  state: {
    name: 'zzz',
    banners: []
  },
  actions: {
    fetchData(state) {
      state.banners.push('pic1')
    }
  }
})

export {
  eventBus, eventStore,
}