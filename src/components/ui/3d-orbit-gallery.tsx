"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { useTexture } from "@react-three/drei"
import * as THREE from "three"

export function ParticleSphere() {
  const PARTICLE_COUNT = 1500
  const PARTICLE_SIZE_MIN = 0.005
  const PARTICLE_SIZE_MAX = 0.01
  const SPHERE_RADIUS = 9
  const POSITION_RANDOMNESS = 4
  const ROTATION_SPEED_X = 0.0
  const ROTATION_SPEED_Y = 0.0005
  const PARTICLE_OPACITY = 1
  const IMAGE_COUNT = 24
  const IMAGE_SIZE = 1.5

  const groupRef = useRef<THREE.Group>(null)

  // Reliable Unsplash stock images (public, stable crop URLs)
  const textures = useTexture([
    "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1522673607200-164a1e16e4d3?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1529636798458-92182e662485?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1511285560929-80b456fe3ea9?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1515934758295-9ff6430b8a3c?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1520854221259-04c8b63d1624?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1494774157368-9ff7269a45e1?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1529634596772-f1f5da2c22e4?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1522673607200-164a1e16e4d3?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=60",
  ])

  useMemo(() => {
    textures.forEach((texture) => {
      if (texture) {
        texture.wrapS = THREE.ClampToEdgeWrapping
        texture.wrapT = THREE.ClampToEdgeWrapping
        texture.flipY = false
      }
    })
  }, [textures])

  const particles = useMemo(() => {
    const list = []
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const phi = Math.acos(-1 + (2 * i) / PARTICLE_COUNT)
      const theta = Math.sqrt(PARTICLE_COUNT * Math.PI) * phi
      const radiusVariation =
        SPHERE_RADIUS + (Math.random() - 0.5) * POSITION_RANDOMNESS
      const x = radiusVariation * Math.cos(theta) * Math.sin(phi)
      const y = radiusVariation * Math.cos(phi)
      const z = radiusVariation * Math.sin(theta) * Math.sin(phi)
      list.push({
        position: [x, y, z] as [number, number, number],
        scale:
          Math.random() * (PARTICLE_SIZE_MAX - PARTICLE_SIZE_MIN) +
          PARTICLE_SIZE_MIN,
        color: new THREE.Color().setHSL(
          Math.random() * 0.1 + 0.05,
          0.8,
          0.6 + Math.random() * 0.3
        ),
        rotationSpeed: (Math.random() - 0.5) * 0.01,
      })
    }
    return list
  }, [])

  const orbitingImages = useMemo(() => {
    const images = []
    for (let i = 0; i < IMAGE_COUNT; i++) {
      const angle = (i / IMAGE_COUNT) * Math.PI * 2
      const x = SPHERE_RADIUS * Math.cos(angle)
      const y = 0
      const z = SPHERE_RADIUS * Math.sin(angle)
      const position = new THREE.Vector3(x, y, z)
      const center = new THREE.Vector3(0, 0, 0)
      const outwardDirection = position.clone().sub(center).normalize()
      const euler = new THREE.Euler()
      const matrix = new THREE.Matrix4()
      matrix.lookAt(
        position,
        position.clone().add(outwardDirection),
        new THREE.Vector3(0, 1, 0)
      )
      euler.setFromRotationMatrix(matrix)
      euler.z += Math.PI
      images.push({
        position: [x, y, z] as [number, number, number],
        rotation: [euler.x, euler.y, euler.z] as [number, number, number],
        textureIndex: i % textures.length,
        color: new THREE.Color().setHSL(Math.random(), 0.7, 0.6),
      })
    }
    return images
  }, [textures.length])

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += ROTATION_SPEED_Y
      groupRef.current.rotation.x += ROTATION_SPEED_X
    }
  })

  return (
    <group ref={groupRef}>
      {particles.map((particle, index) => (
        <mesh key={index} position={particle.position} scale={particle.scale}>
          <sphereGeometry args={[1, 8, 6]} />
          <meshBasicMaterial
            color={particle.color}
            transparent
            opacity={PARTICLE_OPACITY}
          />
        </mesh>
      ))}
      {orbitingImages.map((image, index) => (
        <mesh
          key={`image-${index}`}
          position={image.position}
          rotation={image.rotation}
        >
          <planeGeometry args={[IMAGE_SIZE, IMAGE_SIZE]} />
          <meshBasicMaterial
            map={textures[image.textureIndex]}
            opacity={1}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}
