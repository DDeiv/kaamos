import React, { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { OrbitControls } from '@react-three/drei'
import { sampleParticlesFromImage } from '../utils/imageSampler'

// Custom shader for the organic morphing effect
const OrganicMaterial = {
    uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#ffffff') },
        uMorphFactor: { value: 0 }
    },
    vertexShader: `
    uniform float uTime;
    uniform float uMorphFactor;
    attribute vec3 targetPosition;
    varying vec2 vUv;
    varying float vDisplacement;

    // Simplex noise function
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise(vec3 v) {
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 = v - i + dot(i, C.xxx) ;
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i); 
      vec4 p = permute( permute( permute( 
                 i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
               + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
      float n_ = 0.142857142857;
      vec3  ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                    dot(p2,x2), dot(p3,x3) ) );
    }

    void main() {
      vUv = uv;
      
      // Mix between current position and target position
      vec3 mixedPos = mix(position, targetPosition, uMorphFactor);
      
      // Reduced noise for more defined shapes
      float noise = snoise(mixedPos * 2.0 + uTime * 0.15);
      vDisplacement = noise;
      
      // Minimal organic movement to keep shape definition
      vec3 finalPos = mixedPos + normal * noise * 0.08;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPos, 1.0);
      gl_PointSize = 2.5;
    }
  `,
    fragmentShader: `
    uniform vec3 uColor;
    varying float vDisplacement;

    void main() {
      vec2 center = gl_PointCoord - 0.5;
      float dist = length(center);
      // Sharper particle edges
      float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
      
      if (alpha < 0.01) discard;
      
      vec3 finalColor = uColor + vDisplacement * 0.1;
      
      // More opaque for better definition
      gl_FragColor = vec4(finalColor, alpha * 0.85);
    }
  `
}

function MorphingShape() {
    const meshRef = useRef()
    const materialRef = useRef()
    const [shapes, setShapes] = useState([])
    const [currentShapeIndex, setCurrentShapeIndex] = useState(0)
    const [nextShapeIndex, setNextShapeIndex] = useState(1)
    const [morphProgress, setMorphProgress] = useState(0)

    const PARTICLE_COUNT = 30000

    // Load shapes on mount
    useEffect(() => {
        const loadShapes = async () => {
            const shapeUrls = [
                '/shapes/shape1.png',
                '/shapes/shape2.png',
                '/shapes/shape3.png',
                '/shapes/shape4.png',
                '/shapes/shape5.png'
            ]

            try {
                const loadedShapes = await Promise.all(
                    shapeUrls.map(url => sampleParticlesFromImage(url, PARTICLE_COUNT))
                )
                setShapes(loadedShapes)
            } catch (err) {
                console.error("Error loading shapes:", err)
            }
        }
        loadShapes()
    }, [])

    // Geometry setup
    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry()
        // Initial positions (sphere)
        const positions = new Float32Array(PARTICLE_COUNT * 3)
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const u = Math.random()
            const v = Math.random()
            const theta = 2 * Math.PI * u
            const phi = Math.acos(2 * v - 1)
            const r = 2
            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
            positions[i * 3 + 2] = r * Math.cos(phi)
        }
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        // Target positions attribute (will be updated)
        geo.setAttribute('targetPosition', new THREE.BufferAttribute(positions.slice(), 3))
        // Normals for noise calculation (simplified, just pointing out from center)
        const normals = new Float32Array(PARTICLE_COUNT * 3)
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const x = positions[i * 3]
            const y = positions[i * 3 + 1]
            const z = positions[i * 3 + 2]
            const len = Math.sqrt(x * x + y * y + z * z)
            normals[i * 3] = x / len
            normals[i * 3 + 1] = y / len
            normals[i * 3 + 2] = z / len
        }
        geo.setAttribute('normal', new THREE.BufferAttribute(normals, 3))

        return geo
    }, [])

    // Animation loop
    useFrame((state, delta) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime

            // Morphing logic
            if (shapes.length > 0) {
                // Increment progress
                const speed = 0.5 // Morph speed
                let newProgress = morphProgress + delta * speed

                if (newProgress >= 1) {
                    // Morph complete, switch indices
                    newProgress = 0
                    const next = (nextShapeIndex + 1) % shapes.length

                    // Update attributes
                    // Current position becomes what was the target
                    geometry.attributes.position.array.set(shapes[nextShapeIndex])
                    geometry.attributes.position.needsUpdate = true

                    // New target
                    geometry.attributes.targetPosition.array.set(shapes[next])
                    geometry.attributes.targetPosition.needsUpdate = true

                    setCurrentShapeIndex(nextShapeIndex)
                    setNextShapeIndex(next)
                }

                setMorphProgress(newProgress)
                // Smooth step for uMorphFactor
                const smoothProgress = newProgress * newProgress * (3 - 2 * newProgress)
                materialRef.current.uniforms.uMorphFactor.value = smoothProgress
            }
        }

        if (meshRef.current) {
            // Rotation removed
            meshRef.current.rotation.set(0, 0, 0)
        }
    })

    // Initial attribute update when shapes load
    useEffect(() => {
        if (shapes.length > 0 && geometry) {
            geometry.attributes.position.array.set(shapes[0])
            geometry.attributes.position.needsUpdate = true
            geometry.attributes.targetPosition.array.set(shapes[1])
            geometry.attributes.targetPosition.needsUpdate = true
        }
    }, [shapes, geometry])

    return (
        <points ref={meshRef} geometry={geometry}>
            <shaderMaterial
                ref={materialRef}
                attach="material"
                args={[OrganicMaterial]}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    )
}

export default function Scene() {
    return (
        <>
            <color attach="background" args={['#050505']} />
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <MorphingShape />
            <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
        </>
    )
}
