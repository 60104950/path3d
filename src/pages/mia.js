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
        new THREE.Vector3(23.000, 4.500, -1.000),
new THREE.Vector3(9.201, 4.500, -1.000),
new THREE.Vector3(9.201, 4.500, 9.728),
new THREE.Vector3(0.030, 4.500, 9.728),
new THREE.Vector3(0.030, 4.500, 10.198),
new THREE.Vector3(4.616, 4.500, 10.198),
new THREE.Vector3(4.616, 4.500, 17.488),
new THREE.Vector3(7.183, 4.500, 17.488),
new THREE.Vector3(7.183, 4.500, 16.038),
new THREE.Vector3(9.750, 4.500, 16.038),
new THREE.Vector3(12.004, 4.500, 16.038),
new THREE.Vector3(12.004, 4.500, 17.488),
new THREE.Vector3(9.691, 4.500, 17.488),
new THREE.Vector3(9.691, 4.500, 19.037),
new THREE.Vector3(9.691, 4.500, 23.054),
new THREE.Vector3(10.318, 4.500, 23.054),
new THREE.Vector3(10.318, 4.500, 19.487),
new THREE.Vector3(16.619, 4.500, 21.557),
new THREE.Vector3(19.562, 4.500, 22.446),
new THREE.Vector3(20.211, 4.500, 19.945),
new THREE.Vector3(29.067, 4.500, 22.378),
new THREE.Vector3(28.276, 4.500, 25.369),
new THREE.Vector3(27.650, 4.500, 27.833),
new THREE.Vector3(23.033, 4.500, 26.645),
new THREE.Vector3(18.687, 4.500, 25.460),
new THREE.Vector3(19.308, 4.500, 23.343),
new THREE.Vector3(12.465, 4.500, 21.149),
new THREE.Vector3(9.986, 4.500, 21.149),
new THREE.Vector3(9.986, 4.500, 17.198),
new THREE.Vector3(4.314, 4.500, 17.198),
new THREE.Vector3(4.314, 4.500, 10.820),
new THREE.Vector3(9.506, 4.500, 10.820),
new THREE.Vector3(9.506, 4.500, -1.342),
new THREE.Vector3(9.506, 4.500, -10.852),
new THREE.Vector3(5.358, 4.500, -10.852),
new THREE.Vector3(0.319, 4.500, -10.852),
new THREE.Vector3(0.319, 4.500, -11.340),
new THREE.Vector3(5.318, 4.500, -11.340),
new THREE.Vector3(5.318, 4.500, -18.492),
new THREE.Vector3(5.318, 4.500, -18.492),
new THREE.Vector3(5.318, 4.500, -11.340),
new THREE.Vector3(0.319, 4.500, -11.340),
new THREE.Vector3(0.319, 4.500, -10.852),
new THREE.Vector3(5.358, 4.500, -10.852),
new THREE.Vector3(9.506, 4.500, -10.852),
new THREE.Vector3(9.506, 4.500, -1.342),
new THREE.Vector3(9.506, 4.500, 10.820),
new THREE.Vector3(8.314, 4.500, 10.820),
new THREE.Vector3(6.314, 4.500, 17.198),
new THREE.Vector3(9.986, 4.500, 17.198),
new THREE.Vector3(9.986, 4.500, 21.149),
new THREE.Vector3(12.465, 4.500, 21.149),
new THREE.Vector3(19.308, 4.500, 23.343),
new THREE.Vector3(18.687, 4.500, 25.460),
new THREE.Vector3(23.033, 4.500, 26.645),
new THREE.Vector3(27.650, 4.500, 27.833),
new THREE.Vector3(28.276, 4.500, 25.369),
new THREE.Vector3(29.067, 4.500, 22.378),
new THREE.Vector3(20.211, 4.500, 19.945),
new THREE.Vector3(19.562, 4.500, 22.446),
new THREE.Vector3(16.619, 4.500, 21.557)

      ];
  
      curve = new THREE.CatmullRomCurve3(points);
      /*const curveGeometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(100));
      const curveMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
      const curveObject = new THREE.Line(curveGeometry, curveMaterial);
      scene.add(curveObject);*/
      curve.up = new THREE.Vector3(0, 0, 1)
  
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
       renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setAnimationLoop(animate);
      containerRef.current.appendChild(renderer.domElement);
  
  
      const hdrUrl = 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/dikhololo_night_2k.hdr'
      new RGBELoader().load(hdrUrl, texture => {
        const gen = new THREE.PMREMGenerator(renderer)
        const envMap = gen.fromEquirectangular(texture).texture
        scene.environment = envMap
        scene.environmentIntensity = 5 //controls the intensity 1 is the default 
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