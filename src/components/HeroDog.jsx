import {
  OrbitControls,
  useAnimations,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import { Camera } from "three";
import * as THREE from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const HeroDog = () => {
  // gsap.registerPlugin(useGSAP());
  gsap.registerPlugin(ScrollTrigger);

  const model = useGLTF("/models/dog.drc.glb");

  useThree(({ camera, scene, gl }) => {
    // console.log(camera.position);
    camera.position.z = 0.7;
    gl.toneMapping = THREE.ReinhardToneMapping;
    gl.outputColorSpace = THREE.SRGBColorSpace;
  });

  const { actions } = useAnimations(model.animations, model.scene);

  useEffect(() => {
    actions["Take 001"].play();
  }, [actions]);

  // const textures = useTexture({
  //   normalMap: "/dog_normals.jpg",
  //   sampleMatCap: "/matcap/mat-2.png",
  // });

  const [
    mat1,
    mat2,
    mat3,
    mat4,
    mat5,
    mat6,
    mat7,
    mat8,
    mat9,
    mat10,
    mat11,
    mat12,
    mat13,
    mat14,
    mat15,
    mat16,
    mat17,
    mat18,
    mat19,
    mat20,
  ] = useTexture([
    "/matcap/mat-1.png",
    "/matcap/mat-2.png",
    "/matcap/mat-3.png",
    "/matcap/mat-4.png",
    "/matcap/mat-5.png",
    "/matcap/mat-6.png",
    "/matcap/mat-7.png",
    "/matcap/mat-8.png",
    "/matcap/mat-9.png",
    "/matcap/mat-10.png",
    "/matcap/mat-11.png",
    "/matcap/mat-12.png",
    "/matcap/mat-13.png",
    "/matcap/mat-14.png",
    "/matcap/mat-15.png",
    "/matcap/mat-16.png",
    "/matcap/mat-17.png",
    "/matcap/mat-18.png",
    "/matcap/mat-19.png",
    "/matcap/mat-20.png",
  ]).map((texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  });

  const materialRef = useRef({
    uMatcap1: { value: mat19 },
    uMatcap2: { value: mat2 },
    uProgress: { value: 1.0 },
  });

  const [normalMap] = useTexture(["/dog_normals.jpg"]).map((texture) => {
    texture.flipY = false;
    texture.colorSpace = THREE.LinearSRGBColorSpace;
    return texture;
  });

  const [branchMap, branchNormalMap] = useTexture([
    "/branches_diffuse.jpg",
    "/branches_normals.jpg",
  ]).map((texture) => {
    texture.flipY = false;
    texture.colorSpace = THREE.LinearSRGBColorSpace;
    return texture;
  });

  const dogMaterial = new THREE.MeshMatcapMaterial({
    normalMap: normalMap,
    matcap: mat2,
  });

  const branchMaterial = new THREE.MeshMatcapMaterial({
    normalMap: branchNormalMap,
    map: branchMap,
  });

  model.scene.traverse((child) => {
    // console.log(child.name);
    if (child.name.includes("DOG")) {
      child.material = dogMaterial;
    } else {
      child.material = branchMaterial;
    }
  });

  const dogModelRef = useRef(model);

  const onBeforeCompile = (shader) => {
    shader.uniforms.uMatcapTexture1 = materialRef.current.uMatcap1;
    shader.uniforms.uMatcapTexture2 = materialRef.current.uMatcap2;
    shader.uniforms.uProgress = materialRef.current.uProgress;

    // Store reference to shader uniforms for GSAP animation

    shader.fragmentShader = shader.fragmentShader.replace(
      "void main() {",
      `
        uniform sampler2D uMatcapTexture1;
        uniform sampler2D uMatcapTexture2;
        uniform float uProgress;

        void main() {
        `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      "vec4 matcapColor = texture2D( matcap, uv );",
      `
          vec4 matcapColor1 = texture2D( uMatcapTexture1, uv );
          vec4 matcapColor2 = texture2D( uMatcapTexture2, uv );
          float transitionFactor  = 0.2;
          
          float progress = smoothstep(uProgress - transitionFactor,uProgress, (vViewPosition.x+vViewPosition.y)*0.5 + 0.5);

          vec4 matcapColor = mix(matcapColor2, matcapColor1, progress );
        `
    );
  };

  dogMaterial.onBeforeCompile = onBeforeCompile;

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#section-1",
        endTrigger: "#section-4",
        start: "top top",
        end: "bottom bottom",
        markers: true,
        scrub: true,
      },
    });

    tl.to(dogModelRef.current.scene.position, {
      z: "-=0.5",
      y: "+=0.1",
    })
      .to(dogModelRef.current.scene.rotation, {
        x: `+=${Math.PI / 15}`,
      })
      .to(
        dogModelRef.current.scene.rotation,
        {
          y: `-=${Math.PI}`,
        },
        "third"
      )
      .to(
        dogModelRef.current.scene.position,
        {
          x: "-0.3",
          z: "+=0.59",
          y: "-=0.04",
        },
        "third"
      );
  }, []);

  useEffect(() => {
    document
      .querySelector(`.title[img-title="tomorrowland"]`)
      .addEventListener("mouseenter", () => {
        materialRef.current.uMatcap1.value = mat19;
        gsap.to(materialRef.current.uProgress, {
          value: 0.0,
          duration: 0.3,
          onComplete: () => {
            materialRef.current.uMatcap2.value =
              materialRef.current.uMatcap1.value;
            materialRef.current.uProgress.value = 1.0;
          },
        });
      });
    document
      .querySelector(`.title[img-title="navy-pier"]`)
      .addEventListener("mouseenter", () => {
        materialRef.current.uMatcap1.value = mat8;
        gsap.to(materialRef.current.uProgress, {
          value: 0.0,
          duration: 0.3,
          onComplete: () => {
            materialRef.current.uMatcap2.value =
              materialRef.current.uMatcap1.value;
            materialRef.current.uProgress.value = 1.0;
          },
        });
      });
    document
      .querySelector(`.title[img-title="msi-chicago"]`)
      .addEventListener("mouseenter", () => {
        materialRef.current.uMatcap1.value = mat9;
        gsap.to(materialRef.current.uProgress, {
          value: 0.0,
          duration: 0.3,
          onComplete: () => {
            materialRef.current.uMatcap2.value =
              materialRef.current.uMatcap1.value;
            materialRef.current.uProgress.value = 1.0;
          },
        });
      });
    document
      .querySelector(`.title[img-title="louis-phone"]`)
      .addEventListener("mouseenter", () => {
        materialRef.current.uMatcap1.value = mat12;
        gsap.to(materialRef.current.uProgress, {
          value: 0.0,
          duration: 0.3,
          onComplete: () => {
            materialRef.current.uMatcap2.value =
              materialRef.current.uMatcap1.value;
            materialRef.current.uProgress.value = 1.0;
          },
        });
      });
    document
      .querySelector(`.title[img-title="festival-2018"]`)
      .addEventListener("mouseenter", () => {
        materialRef.current.uMatcap1.value = mat10;
        gsap.to(materialRef.current.uProgress, {
          value: 0.0,
          duration: 0.3,
          onComplete: () => {
            materialRef.current.uMatcap2.value =
              materialRef.current.uMatcap1.value;
            materialRef.current.uProgress.value = 1.0;
          },
        });
      });
    document
      .querySelector(`.title[img-title="kennedy-center"]`)
      .addEventListener("mouseenter", () => {
        materialRef.current.uMatcap1.value = mat17;
        gsap.to(materialRef.current.uProgress, {
          value: 0.0,
          duration: 0.3,
          onComplete: () => {
            materialRef.current.uMatcap2.value =
              materialRef.current.uMatcap1.value;
            materialRef.current.uProgress.value = 1.0;
          },
        });
      });
    document
      .querySelector(`.title[img-title="royal-opera"]`)
      .addEventListener("mouseenter", () => {
        materialRef.current.uMatcap1.value = mat13;
        gsap.to(materialRef.current.uProgress, {
          value: 0.0,
          duration: 0.3,
          onComplete: () => {
            materialRef.current.uMatcap2.value =
              materialRef.current.uMatcap1.value;
            materialRef.current.uProgress.value = 1.0;
          },
        });
      });
    document.querySelector(`.titles`).addEventListener("mouseleave", () => {
      materialRef.current.uMatcap1.value = mat2;
      gsap.to(materialRef.current.uProgress, {
        value: 0.0,
        duration: 0.3,
        onComplete: () => {
          materialRef.current.uMatcap2.value =
            materialRef.current.uMatcap1.value;
          materialRef.current.uProgress.value = 1.0;
        },
      });
    });
  }, []);

  return (
    <>
      {/* <mesh>
        <meshBasicMaterial color={0x00ff00} />
        <boxGeometry args={[1, 1, 1]} />
      </mesh> */}
      <primitive
        object={model.scene}
        position={[0.25, -0.55, 0]}
        rotation={[0, Math.PI / 3.2, 0]}
      />
      <directionalLight color={0xffffff} intensity={10} position={[0, 5, 5]} />
    </>
  );
};

export default HeroDog;
