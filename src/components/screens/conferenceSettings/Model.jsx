import { useGLTF } from "@react-three/drei";

export function Model({ name, ...props }) {
  const { nodes } = useGLTF("/compressed/compressed.glb");
  return (
    <mesh
      name={name}
      geometry={nodes[name].geometry}
      material={nodes[name].material}
      material-color={"#3397AB"}
      {...props}
      dispose={null}
    />
  );
}

useGLTF.preload("/compressed/compressed.glb");
