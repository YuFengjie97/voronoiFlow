import { useTexture } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo } from 'react'
import { smoothstep, Fn, hash, If, instancedArray, instanceIndex, positionLocal, sin, texture, uniform, vec2, vec3, fract, uv, length } from 'three/tsl'
import * as THREE from 'three/webgpu'

export function Particle() {
  const count = 8000
  const range = 10
  const speed = uniform(.01)
  const uvScale = uniform(2.)
  const lifeSpeed = uniform(.01)

  const particleSize = .03

  const renderer = useThree((state) => state.renderer)

  const texV = useTexture(`${import.meta.env.BASE_URL}img/Techno 9 - 512x512.png`)


  const { positionNode, colorNode, initPos, update } = useMemo(() => {
    const posBuffer = instancedArray(count, 'vec3')
    const lifeBuffer = instancedArray(count, 'float')

    // react complier不允许直接修改,只好复制一份设置重复
    const texVoronoi = texV.clone()
    texVoronoi.wrapS = THREE.RepeatWrapping
    texVoronoi.wrapT = THREE.RepeatWrapping

    const positionNode = Fn(() => {
      const pos = posBuffer.element(instanceIndex)
      return positionLocal.add(pos)
    })()

    const colorNode = Fn(() => {
      let d = length(uv().sub(.5))
      d = smoothstep(.5,0.,d);

      const col = sin(vec3(3,2,1).add(instanceIndex)).mul(.5).add(.5)
      const life = lifeBuffer.element(instanceIndex).toVar()
      const mask = smoothstep(0, .2, life)
                    .mul(smoothstep(1., .8, life))
      return col.mul(mask).mul(d).mul(2)
    })()

    const getRndPos = () => {
      const x = hash(instanceIndex).mul(range)
      const y = hash(instanceIndex.add(1.)).mul(range)
      return vec3(x,y,0)
    }

    const getVel = (pos: THREE.Node<'vec3'>) => {
      const uv = pos.div(range).xy.mul(uvScale) // 归一化

      const e = .01
      const d = texture(texVoronoi,  uv).r
      const dx = texture(texVoronoi, uv.add(vec2(e, 0))).r.sub(d)
      const dy = texture(texVoronoi, uv.add(vec2(0, e))).r.sub(d)
      const vel = vec2(dy, dx.mul(-1)).normalize()
      return vec3(vel, 0);
    }


    const initPos = Fn(() => {
      const pos = getRndPos()
      posBuffer.element(instanceIndex).assign(pos)
      lifeBuffer.element(instanceIndex).assign(hash(instanceIndex.mul(23.13)))
    })().compute(count)


    const update = Fn(() => {
      const pos = posBuffer.element(instanceIndex).toVar()
      const vel = getVel(pos)
      pos.addAssign(vel.mul(speed))
      
      const life = lifeBuffer.element(instanceIndex).toVar()
      life.addAssign(lifeSpeed)
      
      If(
        pos.x.lessThan(0)
        .or(pos.x.greaterThan(range))
        .or(pos.y.lessThan(0))
        .or(pos.y.greaterThan(range))
        .or(life.greaterThan(1)),
        () => {
          pos.assign(getRndPos())
          life.assign(fract(life))
        }
      )


      posBuffer.element(instanceIndex).assign(pos)
      lifeBuffer.element(instanceIndex).assign(life)


    })().compute(count)

    return { positionNode, colorNode, initPos, update }
  }, [texV])

  useEffect(() => {
    renderer.compute(initPos)
  }, [renderer, initPos])

  useFrame(() => {
    renderer.compute(update)
  })

  return (
    <instancedMesh frustumCulled={false} args={[undefined, undefined, count]}>
      {/* <icosahedronGeometry args={[particleSize, 0]} /> */}
      <planeGeometry args={[particleSize, particleSize, 1,1]} />
      <meshBasicNodeMaterial positionNode={positionNode} colorNode={colorNode}  />
    </instancedMesh>
  )
}
