import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';



const mia = () => {
  const containerRef = useRef();

  useEffect(() => {
    let camera, scene, renderer, controls, curve;
    let scrollValue = 0;
    let currentDistance = 0;
    //const stats = new Stats()
    //let statistics = stats.showPanel(0) 
    //document.body.appendChild(stats.dom)
    const init = async () => {
      const loader = new GLTFLoader();
      try {
          const gltf = await loader.loadAsync('mia.glb');
          const model = gltf.scene
          scene.add(model)
          model.traverse((child) => {
              if (child.isMesh && child.name.includes("Cube002")) {
                  child.receiveShadow = true

              }
              if (child.isMesh && !child.name.includes("Cube002")) {
                  child.castShadow = true
              }
              if (child.isLight) {
                  child.castShadow = true
                  child.color = new THREE.Color(0xFFF2CC);

              }
          })

      } catch (error) {
          console.error('An error occurred while loading the GLB file:', error);
      }
      window.addEventListener('resize', onWindowResize);
    };
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x808080);
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    scene.add(new THREE.GridHelper(2, 4, 0xFFFFFF, 0xFFFFFF));
    const points = [
      new THREE.Vector3(20.025, 4.500, -0.278),
            new THREE.Vector3(16.210, 4.500, -0.216),
            new THREE.Vector3(9.470, 4.500, -0.216),
            new THREE.Vector3(9.808, 4.500, 9.489),
            new THREE.Vector3(4.734, 4.500, 9.553),
            new THREE.Vector3(5.070, 4.500, 17.241),
            new THREE.Vector3(10.624, 4.500, 17.359),
            new THREE.Vector3(16.283, 4.500, 21.744),
            new THREE.Vector3(19.245, 4.500, 22.366),
            new THREE.Vector3(20.623, 4.500, 19.477),
            new THREE.Vector3(30.162, 4.500, 22.040),
            new THREE.Vector3(29.555, 4.500, 24.943),
            new THREE.Vector3(28.592, 4.500, 28.098),
            new THREE.Vector3(18.016, 4.500, 25.373),
            new THREE.Vector3(19.068, 4.500, 22.706),
            new THREE.Vector3(9.602, 4.500, 17.552),
            new THREE.Vector3(5.040, 4.500, 17.018),
            new THREE.Vector3(4.887, 4.500, 9.903),
            new THREE.Vector3(9.289, 4.500, 9.877),
            new THREE.Vector3(9.402, 4.500, 3.170),
            new THREE.Vector3(9.573, 4.500, -6.236),
            new THREE.Vector3(9.573, 4.500, -7.236),
            new THREE.Vector3(4.859, 4.500, -12.185),
            new THREE.Vector3(5.648, 4.500, -19.184),
            new THREE.Vector3(8.442, 4.500, -19.269),
    ];

    curve = new THREE.CatmullRomCurve3(points);
    /*const curveGeometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(100));
    const curveMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    const curveObject = new THREE.Line(curveGeometry, curveMaterial);
    scene.add(curveObject);*/
    curve.up = new THREE.Vector3(0, 0, 1)

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animate);
    containerRef.current.appendChild(renderer.domElement);


    const hdrUrl = 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/dikhololo_night_2k.hdr'
    new RGBELoader().load(hdrUrl, texture => {
      const gen = new THREE.PMREMGenerator(renderer)
      const envMap = gen.fromEquirectangular(texture).texture
      //scene.environment = envMap
      //scene.environmentIntensity = 5 //controls the intensity 1 is the default 
      //scene.background = envMap

      texture.dispose()
      gen.dispose()
    })


    camera.position.z = 1


    window.addEventListener('wheel', (event) => {
      const scrollSpeed = 0.00003;
      scrollValue -= event.deltaY * scrollSpeed;

      scrollValue = THREE.MathUtils.clamp(scrollValue, 0, 1);
    })
    window.addEventListener('touchmove', (event) => {
      if (event.touches.length == 1) {
        controls.panSpeed = 2
        return
      }
      const scrollSpeed = 0.0007;
      let locationX = event.touches[1].clientX - event.touches[0].clientX
      let locationY = event.touches[1].clientY - event.touches[0].clientY
      let distance = Math.sqrt((locationX * locationX + locationY * locationY))
      scrollValue += scrollSpeed //zoom in
      if (currentDistance > distance) {
        //zoom out
        scrollValue -= scrollSpeed * 2
      }
      currentDistance = distance
      scrollValue = THREE.MathUtils.clamp(scrollValue, 0, 1);
    });


    controls = new OrbitControls(camera, renderer.domElement);
    controls.rotateSpeed = 0.3


    controls.mouseButtons = {
      LEFT: THREE.MOUSE.PAN,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.ROTATE
    }
    controls.touches = {
      ONE: THREE.TOUCH.PAN,
      TWO: THREE.TOUCH.DOLLY_PAN
    }

    controls.minDistance = 10;
    controls.maxDistance = 60;
    function animate() {
      //stats.begin();
      const position = curve.getPointAt(scrollValue)
      camera.position.copy(position);
      renderer.render(scene, camera);
      //stats.end();
      //console.log("draw", renderer.info.render.calls)

    }
    init()
    animate()
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    return () => {
      window.removeEventListener('resize', onWindowResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);


  return (
    <div className="relative w-full h-screen">
      <div ref={containerRef} className="absolute inset-0" />
      <div id="info" className="absolute top-0 left-0 p-2 bg-white text-black z-10">
        <a href="https://threejs.org" target="_blank" rel="noopener noreferrer">
          three.js
        </a>{' '}
        - USDZLoader
      </div>
    </div>
  );
};


export default mia;