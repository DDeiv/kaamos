import React, { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { sampleParticlesFromImage } from '../utils/imageSampler'
import { client, urlFor } from '../sanityClient'

// Custom shader for the organic morphing effect
const OrganicMaterial = {
    uniforms: {
        uTime: { value: 0 },
        uMorphFactor: { value: 0 },
        uMouse: { value: new THREE.Vector3() },
        uMouseStrength: { value: 0.8 },
        uIsMobile: { value: 0.0 }
    },
    vertexShader: `
    uniform float uTime;
    uniform float uMorphFactor;
    uniform vec3 uMouse;
    uniform float uMouseStrength;
    uniform float uIsMobile;
    attribute vec3 targetPosition;
    attribute float smoothedSpeed;
    varying vec2 vUv;
    varying float vDisplacement;
    varying float vSpeed;
    varying float vSmoothedSpeed;

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

      // Calculate speed proxy based on distance to target
      vSpeed = length(targetPosition - position);

      // Pass smoothed speed to fragment shader
      vSmoothedSpeed = smoothedSpeed;

      // Noise calculation for color variation only
      float noise = snoise(mixedPos * 2.0 + uTime * 0.15);
      vDisplacement = noise;

      // No displacement - particles stay exactly within shape boundaries
      vec3 finalPos = mixedPos;

      // Mouse interaction - DISABLED
      // vec3 toMouse = finalPos - uMouse;
      // float distToMouse = length(toMouse);
      // float pushRadius = 2.0;

      // if (distToMouse < pushRadius) {
      //   float pushForce = (1.0 - distToMouse / pushRadius) * uMouseStrength;
      //   pushForce = pow(pushForce, 2.0); // Make the falloff sharper
      //   finalPos += normalize(toMouse) * pushForce;
      // }

      gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPos, 1.0);

      // Very small particles for ultra-sharp, highly defined shapes
      float baseSize = 2.2;
      float mobileSize = 1.8;
      gl_PointSize = mix(baseSize, mobileSize, uIsMobile);
    }
  `,
    fragmentShader: `
    varying float vDisplacement;
    varying float vSpeed;
    varying float vSmoothedSpeed;

    void main() {
      vec2 center = gl_PointCoord - 0.5;
      float dist = length(center);
      // Much sharper particle edges - tighter smoothstep range
      float alpha = 1.0 - smoothstep(0.35, 0.45, dist);
      
      if (alpha < 0.01) discard;
      
      // Pastel Colors
      vec3 pastelGreen = vec3(0.6, 0.9, 0.7);
      vec3 pastelPink = vec3(1.0, 0.7, 0.85);
      vec3 pastelBlue = vec3(0.6, 0.8, 1.0);

      // Map noise (vDisplacement) from [-1, 1] to [0, 1]
      float noiseVal = vDisplacement * 0.5 + 0.5;
      
      // Combine noise and speed for the gradient
      // Base color comes from noise (so it's colorful even when static)
      // Speed pushes it towards Blue
      float t = noiseVal * 0.7 + smoothstep(0.0, 4.0, vSmoothedSpeed) * 0.6;

      // Ensure balanced distribution
      // 0.0 - 0.4: Green -> Pink
      // 0.4 - 0.8: Pink -> Blue
      // > 0.8: Blue
      
      vec3 finalColor = mix(pastelGreen, pastelPink, smoothstep(0.1, 0.45, t));
      finalColor = mix(finalColor, pastelBlue, smoothstep(0.45, 0.8, t));
      
      // More opaque for better definition
      gl_FragColor = vec4(finalColor, alpha * 0.9);
    }
  `
}

function MorphingShape({ onLoadComplete }) {
    const meshRef = useRef()
    const materialRef = useRef()
    const [shapes, setShapes] = useState([])
    const [currentShapeIndex, setCurrentShapeIndex] = useState(0)
    const [nextShapeIndex, setNextShapeIndex] = useState(1)
    const [morphProgress, setMorphProgress] = useState(0)
    const mousePos = useRef(new THREE.Vector3(0, 0, 5))
    const targetMousePos = useRef(new THREE.Vector3(0, 0, 5))

    // Detect if device is mobile
    const isMobile = useMemo(() => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
            window.innerWidth < 768
    }, [])

    // Use 120,000 particles (corrected from 1.2M)
    const PARTICLE_COUNT = 120000

    // Load shapes on mount
    useEffect(() => {
        const loadShapes = async () => {
            let shapeUrls = []

            try {
                // Try fetching from Sanity
                const query = '*[_type == "particleShape"] | order(order asc) { image }'
                console.log("Fetching particle shapes from Sanity...")
                const sanityShapes = await client.fetch(query)
                console.log("Sanity response:", sanityShapes)

                if (sanityShapes && sanityShapes.length > 0) {
                    // Use Sanity images
                    shapeUrls = sanityShapes.map(shape => {
                        const url = urlFor(shape.image).width(800).url()
                        console.log("Generated shape URL:", url)
                        return url
                    })
                    console.log("Using Sanity particle shapes:", shapeUrls.length, shapeUrls)
                } else {
                    // Fallback to local shapes if no Sanity data
                    console.log("No Sanity particle shapes found, using local shapes")
                    shapeUrls = [
                        '/shapes/shape1.png',
                        '/shapes/shape2.png',
                        '/shapes/shape3.png',
                        '/shapes/shape4.png',
                        '/shapes/shape5.png'
                    ]
                }

                const loadedShapes = await Promise.all(
                    shapeUrls.map(url => sampleParticlesFromImage(url, PARTICLE_COUNT))
                )
                setShapes(loadedShapes)
                onLoadComplete?.()
            } catch (err) {
                console.warn("Sanity fetch failed, using local shapes:", err)
                // Fallback to local shapes on error
                shapeUrls = [
                    '/shapes/shape1.png',
                    '/shapes/shape2.png',
                    '/shapes/shape3.png',
                    '/shapes/shape4.png',
                    '/shapes/shape5.png'
                ]
                const loadedShapes = await Promise.all(
                    shapeUrls.map(url => sampleParticlesFromImage(url, PARTICLE_COUNT))
                )
                setShapes(loadedShapes)
                onLoadComplete?.()
            }
        }
        loadShapes()
    }, [onLoadComplete])

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

        // Smoothed speed attribute for gradual color transitions
        const smoothedSpeeds = new Float32Array(PARTICLE_COUNT)
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            smoothedSpeeds[i] = 0.0
        }
        geo.setAttribute('smoothedSpeed', new THREE.BufferAttribute(smoothedSpeeds, 1))

        return geo
    }, [])

    // Mouse and touch move handler - DISABLED
    // useEffect(() => {
    //     const updatePosition = (clientX, clientY) => {
    //         // Convert position to normalized device coordinates (-1 to +1)
    //         const x = (clientX / window.innerWidth) * 2 - 1
    //         const y = -(clientY / window.innerHeight) * 2 + 1

    //         // Project to 3D space at z=0 plane
    //         targetMousePos.current.set(x * 5, y * 5, 0)
    //     }

    //     const handleMouseMove = (event) => {
    //         updatePosition(event.clientX, event.clientY)
    //     }

    //     const handleTouchMove = (event) => {
    //         if (event.touches.length > 0) {
    //             const touch = event.touches[0]
    //             updatePosition(touch.clientX, touch.clientY)
    //         }
    //     }

    //     window.addEventListener('mousemove', handleMouseMove)
    //     window.addEventListener('touchmove', handleTouchMove, { passive: true })

    //     return () => {
    //         window.removeEventListener('mousemove', handleMouseMove)
    //         window.removeEventListener('touchmove', handleTouchMove)
    //     }
    // }, [])

    // Animation loop
    useFrame((state, delta) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
            materialRef.current.uniforms.uIsMobile.value = isMobile ? 1.0 : 0.0

            // Mouse interaction disabled
            // mousePos.current.lerp(targetMousePos.current, 0.1)
            // materialRef.current.uniforms.uMouse.value.copy(mousePos.current)

            // Morphing logic
            if (shapes.length > 0) {
                // Increment progress
                const speed = 0.2 // Slower, more organic speed
                let newProgress = morphProgress + delta * speed

                // Pause threshold: 1.0 is morph complete. 
                // We let it go up to 1.5, meaning it stays at "1.0" for (0.5 / 0.2) = 2.5 seconds.
                // Wait, speed is 0.2. 
                // If we want 1 second pause: 1.0 + (1.0 * 0.2) = 1.2
                const totalCycle = 1.2

                if (newProgress >= totalCycle) {
                    // Morph complete + pause complete, switch indices
                    newProgress = 0
                    const next = (nextShapeIndex + 1) % shapes.length

                    // Update attributes
                    // Current position becomes what was the target
                    geometry.attributes.position.array.set(shapes[nextShapeIndex])
                    geometry.attributes.position.needsUpdate = true

                    // New target
                    geometry.attributes.targetPosition.array.set(shapes[next])
                    geometry.attributes.targetPosition.needsUpdate = true

                    // Reset smoothed speeds to prevent artifacts
                    const smoothedSpeeds = geometry.attributes.smoothedSpeed.array
                    for (let i = 0; i < PARTICLE_COUNT; i++) {
                        smoothedSpeeds[i] = 0
                    }
                    geometry.attributes.smoothedSpeed.needsUpdate = true

                    setCurrentShapeIndex(nextShapeIndex)
                    setNextShapeIndex(next)
                }

                setMorphProgress(newProgress)

                // Clamp progress to 1 for the shader so it stays "finished" during the pause
                const visualProgress = Math.min(newProgress, 1)

                // Smooth step for uMorphFactor
                const smoothProgress = visualProgress * visualProgress * (3 - 2 * visualProgress)
                materialRef.current.uniforms.uMorphFactor.value = smoothProgress

                // Update smoothed speed values with lerp for gradual color transitions
                // Only update during active morphing, not during pause
                if (meshRef.current && meshRef.current.geometry && visualProgress < 1.0) {
                    const geo = meshRef.current.geometry
                    const positions = geo.attributes.position.array
                    const targetPositions = geo.attributes.targetPosition.array
                    const smoothedSpeeds = geo.attributes.smoothedSpeed.array

                    const lerpFactor = 0.05 // Lower = smoother transitions (0.05 = ~1 second transition)

                    for (let i = 0; i < PARTICLE_COUNT; i++) {
                        const idx = i * 3
                        const dx = targetPositions[idx] - positions[idx]
                        const dy = targetPositions[idx + 1] - positions[idx + 1]
                        const dz = targetPositions[idx + 2] - positions[idx + 2]
                        const actualSpeed = Math.sqrt(dx * dx + dy * dy + dz * dz)

                        // Lerp smoothed speed towards actual speed
                        smoothedSpeeds[i] += (actualSpeed - smoothedSpeeds[i]) * lerpFactor
                    }

                    geo.attributes.smoothedSpeed.needsUpdate = true
                }
            }
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
                blending={THREE.NormalBlending}
            />
        </points>
    )
}

export default function Scene({ onLoadComplete }) {
    return (
        <>
            <color attach="background" args={['#ffffff']} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <MorphingShape onLoadComplete={onLoadComplete} />
        </>
    )
}
