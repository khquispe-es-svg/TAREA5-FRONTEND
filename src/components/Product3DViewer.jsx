
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

function Phone3D() {
  return (
    <group>
      {/* Cuerpo del teléfono */}
      <mesh>
        <boxGeometry args={[1.4, 2.7, 0.16]} />
        <meshStandardMaterial color="#172554" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Pantalla */}
      <mesh position={[0, 0, 0.09]}>
        <boxGeometry args={[1.25, 2.5, 0.025]} />
        <meshStandardMaterial color="#2563eb" metalness={0.2} roughness={0.2} />
      </mesh>

      {/* Cámara */}
      <mesh position={[0.38, 1.12, 0.11]}>
        <cylinderGeometry args={[0.09, 0.09, 0.04, 32]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#020617" />
      </mesh>
    </group>
  )
}

export default function Product3DViewer() {
  return (
    <div className="my-8 h-80 overflow-hidden rounded-2xl bg-slate-900">
      <Canvas camera={{ position: [3, 2, 4], fov: 45 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 5, 5]} intensity={2} />

        <Phone3D />

        <OrbitControls enableZoom={false} />
      </Canvas>

      <p className="relative -mt-7 text-center text-xs text-white">
        Modelo 3D interactivo - Gira con el cursor
      </p>
    </div>
  )
}
