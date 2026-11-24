import './App.css'
import { Canvas, useThree } from '@react-three/fiber'
import { Particle } from './components/Particle'
import { Suspense, useEffect } from 'react'
import { ParticleTail } from './components/ParticleTail'
import { Box } from './components/Box'

function FitToScreen() {
  const { camera, size } = useThree()
  useEffect(() => {
    const aspect = size.width / size.height

    // camera.left = -10 * aspect
    // camera.right = 10 * aspect
    // camera.top = 10
    // camera.bottom = -10

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

        <axesHelper args={[10]} />

        <Suspense fallback={null}>
          <Particle />
          <ParticleTail />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default App
