import React from 'react';
import VirtualList from './components/VirtualList'
// import VirtualListWaterfall from './components/VirtualListWaterfall';
import { StoreTestA, StoreTestB } from './components/StoreTest';
import './App.css';
const VirtualListWaterfall = React.lazy(() => import('./components/VirtualList'))




function App() {
  return (
    <div>
      <VirtualList />
      <VirtualListWaterfall />
      <StoreTestA />
      <StoreTestB />
    </div>
  );
}

export default App;
