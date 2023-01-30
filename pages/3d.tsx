import React, { useRef, useMemo } from "react";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { TextureLoader } from "three";

const Avatar3D = () => {
    const group = useRef();
    
    const { nodes, materials } = useGLTF("/me1.glb");
    // console.log(nodes);
    // console.log(materials);

    const gltf = useLoader(GLTFLoader, "/me1.glb")
    const texture = useLoader(TextureLoader, "/stacy.jpg");
    console.log(gltf);
    const [bones, skeleton, neck, waist] = useMemo(() => {
        // By putting bones into the view Threejs removes it automatically from the
        // cached scene. Next time the component runs these two objects will be gone.
        // Since the gltf object is a permenently cached object, we can extend it here
        // and extend it with all the data we may need.
        if (!gltf.bones) gltf.bones = gltf.scene.children[0].children[0]
        if (!gltf.skeleton) gltf.skeleton = gltf.scene.children[0].children[1].skeleton
        if (!gltf.neck) {
          gltf.bones.traverse((o: { isBone: boolean, name: string }) => {
            if (o.isBone && o.name === "Neck") gltf.neck = o
            if (o.isBone && o.name === "Spine") gltf.waist = o
          })
        }
        return [gltf.bones, gltf.skeleton, gltf.neck, gltf.waist]
      }, [gltf]);

      console.log(bones, skeleton, neck, waist);

    const nodeNames: string[] = [
        "Armature",
        "Head",
        "Hips",
        "LeftArm",
        "LeftFoot",
        "LeftForeArm",
        "LeftHand",
        "LeftHandIndex1",
        "LeftHandIndex2",
        "LeftHandIndex3",
        "LeftHandMiddle1",
        "LeftHandMiddle2",
        "LeftHandMiddle3",
        "LeftHandPinky1",
        "LeftHandPinky2",
        "LeftHandPinky3",
        "LeftHandRing1",
        "LeftHandRing2",
        "LeftHandRing3",
        "LeftHandThumb1",
        "LeftHandThumb2",
        "LeftHandThumb3",
        "LeftLeg",
        "LeftShoulder",
        "LeftToeBase",
        "LeftUpLeg",
        "Neck",
        "RightArm",
        "RightFoot",
        "RightForeArm",
        "RightHand",
        "RightHandIndex1",
        "RightHandIndex2",
        "RightHandIndex3",
        "RightHandMiddle1",
        "RightHandMiddle2",
        "RightHandMiddle3",
        "RightHandPinky1",
        "RightHandPinky2",
        "RightHandPinky3",
        "RightHandRing1",
        "RightHandRing2",
        "RightHandRing3",
        "RightHandThumb1",
        "RightHandThumb2",
        "RightHandThumb3",
        "RightLeg",
        "RightShoulder",
        "RightToeBase",
        "RightUpLeg",
        "Scene",
        "Spine",
        "Spine1",
        "Spine2",
        "UnionAvatars_Body",
        "UnionAvatars_Bottom",
        "UnionAvatars_Hair",
        "UnionAvatars_Head",
        "UnionAvatars_Shoes",
        "UnionAvatars_Top",
        "UnionAvatars_Top_1",
        "UnionAvatars_Top_2"
    ];

    return (
        <Canvas style={{ background: "#171717" }}>
            {/* <group ref={group} dispose={null}>
                    {nodeNames.map((name: string, i: number) => (
                        nodes[name].type == "Object3D" ? <primitive key={i} object={nodes[name]}/> : undefined
                    ))}
                    <meshStandardMaterial {...materials["model.jpg"]}/>
            </group> */}
            <group ref={group} dispose={null}>
                <object3D name="Stacy" rotation={[1.5707964611537577, 0, 0]} scale={[0.009999999776482582, 0.009999999776482582, 0.009999999776482582]}>
                    <primitive object={bones} />
                    <skinnedMesh
                        // onClick={() => onClickEmote("swingdance")}
                        name="stacy"
                        rotation={[-1.5707964611537577, 0, 0]}
                        scale={[100, 100, 99.9999771118164]}
                        skeleton={skeleton}
                        castShadow
                    >
                        <bufferGeometry attach="geometry" {...gltf.nodes.UnionAvatars_Body.geometry} />
                        <meshPhongMaterial attach="material">
                            <texture attach="map" {...texture} flipY={false} />
                        </meshPhongMaterial>
                    </skinnedMesh>
                </object3D>
                </group>
        </Canvas>
    );
}

export default Avatar3D;