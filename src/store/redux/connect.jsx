import { store } from './store'

export function connect(mapStateToProps, mapDispatchToProps) {
  return function(WrappedComponent) {

    // 使用pureComponent可以避免state和props不必要的更新
    class NewCompoent extends PureComponent {

      constructor(props) {
        super(props)
        this.state = mapStateToProps(store.getState())
      }

      componentDidMount() {
        this.unsubscribe = store.subscribe(() => {

          // 一旦dispatch改变了state，就执行这个callback，强制重新更新渲染组件
          // mapStateToProps(store.getState())相当于selector，拿到最新的state的一部分！
          this.setState(mapStateToProps(store.getState()))
        })
      }

      componentWillUnmount() {
        this.unsubscribe()
      }

      render() {
        const stateObj = mapStateToProps(store.getState())
        const dispatchObj = mapDispatchToProps(store.dispatch)
        return (
          <WrappedComponent {...this.props} {...stateObj} {...dispatchObj}/>
        )
      }
    }

    // 返回受到包裹的新的组件
    return NewCompoent
  }
}