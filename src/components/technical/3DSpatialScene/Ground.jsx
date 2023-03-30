import { RigidBody } from "@react-three/rapier";

export default function Ground(props) {
  return (
    <>
      <RigidBody
        type="fixed"
        position-y={-0.1 / 2}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <mesh receiveShadow>
          <planeGeometry args={[200, 200]} />
          <meshStandardMaterial color={"lightgreen"} />
        </mesh>
      </RigidBody>
      <RigidBody
        type="fixed"
        rotation={[0, Math.PI / 2, 0]}
        position-x={-100}
        position-y={25}
      >
        <mesh receiveShadow>
          <planeGeometry args={[200, 50]} />
          <meshPhongMaterial wireframe transparent color="red" opacity={0} />
        </mesh>
      </RigidBody>
      <RigidBody
        type="fixed"
        rotation={[0, -Math.PI / 2, 0]}
        position-y={25}
        position-x={100}
      >
        <mesh receiveShadow>
          <planeGeometry args={[200, 50]} />
          <meshPhongMaterial wireframe transparent color="red" opacity={0} />
        </mesh>
      </RigidBody>
      <RigidBody
        type="fixed"
        position-y={25}
        rotation={[0, -Math.PI, 0]}
        position-z={100}
      >
        <mesh receiveShadow>
          <planeGeometry args={[200, 50]} />
          <meshPhongMaterial wireframe transparent color="red" opacity={0} />
        </mesh>
      </RigidBody>
      <RigidBody position-y={25} type="fixed" position-z={-100}>
        <mesh receiveShadow>
          <planeGeometry args={[200, 50]} />
          <meshPhongMaterial wireframe transparent color="red" opacity={0} />
        </mesh>
      </RigidBody>
    </>
  );
}
