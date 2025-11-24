import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import Scene from './components/Scene'
import Overlay from './components/Overlay'

function App() {
  return (
    <>
      <div className="absolute-full" style={{ zIndex: 0 }}>
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>
      <div className="absolute-full" style={{ zIndex: 1, pointerEvents: 'none' }}>
        <Overlay />
      </div>
    </>
  )
}

export default App
