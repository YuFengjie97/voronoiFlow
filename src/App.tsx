import './App.css'
import { Canvas, useThree } from '@react-three/fiber'
import { Particle } from './components/Particle'
import { Suspense, useEffect } from 'react'
import { ParticleTail } from './components/ParticleTail'

function FitToScreen() {
  const { camera, size } = useThree()
  useEffect(() => {
    camera.position.set(5, 5, 1)
    camera.lookAt(5, 5, 0)

    camera.updateProjectionMatrix()
  }, [camera, size])

  return <></>
}

function App() {
  return (
    <div className='canvas-con'>
      <Canvas
        orthographic
        camera={{
          zoom: 140,
          near: 0.01,
          far: 100,
        }}
      >
        <FitToScreen />
        <color attach='background' args={['#202025']} />

        {/* <axesHelper args={[10]} /> */}

        <Suspense fallback={null}>
          <Particle />
          <ParticleTail />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default App
