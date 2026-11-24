import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo } from 'react'
import { afterImage } from 'three/examples/jsm/tsl/display/AfterImageNode.js'
import { pass } from 'three/tsl'
import * as THREE from 'three/webgpu'

export function ParticleTail() {
  const { scene, camera, renderer } = useThree()

  const { renderPipeline } = useMemo(() => {
    const scenePass = pass(scene, camera)
    const afterImagePass = afterImage(scenePass, 0.92)

    const renderPipeline = new THREE.RenderPipeline(renderer)
    renderPipeline.outputNode = afterImagePass

    return { renderPipeline }
  }, [scene, camera, renderer])

  useEffect(() => {
    return () => renderPipeline.dispose()
  }, [renderPipeline])

  useFrame(
    () => {
      renderPipeline.render()
    },
    { phase: 'render' },
  )

  return <></>
}