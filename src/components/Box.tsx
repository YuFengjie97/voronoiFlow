import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import * as THREE from 'three/webgpu'

export function Box(){
  const boxRef = useRef<THREE.Mesh>(null)
  useFrame((state, delta, xrFrame) => {
    boxRef.current.position.x = Math.sin(state.elapsed)*4
    boxRef.current.rotation.x += delta
  })

  return (
    <mesh ref={boxRef}>
      <boxGeometry args={[1,1,1,1,1,1]}/>
      <meshNormalNodeMaterial />
    </mesh>
  )
}
