import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import Stats from 'stats.js'


const curves = () => {
  const containerRef = useRef();

  useEffect(() => {
    let camera, scene, renderer, controls, curve;
    let scrollValue = 0;
    let currentDistance = 0;
    const stats = new Stats()
    let statistics = stats.showPanel(0) 
    document.body.appendChild(stats.dom)
    const init = async () => {

      const loader = new GLTFLoader();
      try {
        const gltf = await loader.loadAsync('finalmazlisFinal2.glb');
        const model = gltf.scene
        scene.add(model)
        model.traverse((child) => {
          if (child.isMesh && child.name === 'screens') {
            console.log(child.name)
            child.material.map = videoTextureMain;
            //child.material.emissive = new THREE.Color( 0x585858);
            //child.material.emissiveIntensity = 6
            //child.material.emissiveMap = videoTextureMain;
            child.material.needsUpdate = true;
            videoTextureMain.dispose()
          }
          if (child.isMesh && child.name === 'screensWall') {
            child.material.map = videoTextureWall;
            child.material.needsUpdate = true;
            videoTextureWall.dispose()
          }
          if(child.isMesh && child.name === 'tv') {
            child.material.map = videoTexture;
            child.material.needsUpdate = true;
            videoTexture.dispose()
          }
        });

      } catch (error) {
        console.error('An error occurred while loading the GLB file:', error);
      }
      window.addEventListener('resize', onWindowResize);
    };

    const videoMain = document.createElement('video');
      videoMain.src = 'Comp 1.mp4';  // Replace with your video file path
      videoMain.crossOrigin = 'anonymous';
      videoMain.loop = true;
      videoMain.muted = true;
      videoMain.play();
      // Create a video texture
      const videoTextureMain = new THREE.VideoTexture(videoMain);
      //videoTextureMain.wrapS = THREE.RepeatWrapping;
      //videoTextureMain.repeat.x = - 1;
      videoTextureMain.flipY = false
      videoTextureMain.minFilter = THREE.LinearFilter;
      videoTextureMain.magFilter = THREE.LinearFilter;
      videoTextureMain.format = THREE.RGBFormat

      // Create a video element
      const videowall = document.createElement('video');
      videowall.src = 'Walltv.mp4';  // Replace with your video file path
      videowall.crossOrigin = 'anonymous';
      videowall.loop = true;
      videowall.muted = true;
      videowall.play();
      // Create a video texture
      const videoTextureWall = new THREE.VideoTexture(videowall);
      videoTextureWall.flipY = false
      videoTextureWall.minFilter = THREE.LinearFilter;
      videoTextureWall.magFilter = THREE.LinearFilter;
      videoTextureWall.format = THREE.RGBFormat

      // Create a video element
      const video = document.createElement('video');
      video.src = '190624Finalzone1.mp4';  // Replace with your video file path
      video.crossOrigin = 'anonymous';
      video.loop = true;
      video.muted = true;
      video.play();
      // Create a video texture
      const videoTexture = new THREE.VideoTexture(video);
      videoTexture.flipY = false
      videoTexture.minFilter = THREE.LinearFilter;
      videoTexture.magFilter = THREE.LinearFilter;
      videoTexture.format = THREE.RGBFormat

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x808080);
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    scene.add(new THREE.GridHelper(2, 4, 0xFFFFFF, 0xFFFFFF));
    const points = [
      new THREE.Vector3(17.627, 1.000, 1.000),
      new THREE.Vector3(6.485, 1.000, 1.000),
      new THREE.Vector3(6.333, 1.000, -5.437),
      new THREE.Vector3(3.144, 1.000, -5.462),
      new THREE.Vector3(3.397, 1.000, -14.595),
      new THREE.Vector3(-7.930, 1.000, -14.553),
      new THREE.Vector3(-7.951, 1.000, -7.677),
      new THREE.Vector3(-7.972, 1.000, 4.240),
      new THREE.Vector3(-6.981, 1.000, 11.222),
      new THREE.Vector3(-5.987, 1.000, 6.405),
      new THREE.Vector3(-5.287, 1.000, -0.549),
      new THREE.Vector3(-4.928, 1.000, -8.185),
      new THREE.Vector3(-2.714, 1.000, -10.526),
      new THREE.Vector3(0.197, 1.000, -10.146),
      new THREE.Vector3(0.619, 1.000, -3.481),
      new THREE.Vector3(0.442, 1.000, 1.303),
      new THREE.Vector3(2.138, 1.000, 3.227),
      new THREE.Vector3(0.644, 1.000, 7.378),
      new THREE.Vector3(-0.014, 1.000, 10.946),
      new THREE.Vector3(1.505, 1.000, 14.338),
      new THREE.Vector3(6.010, 1.000, 14.363),
      new THREE.Vector3(6.588, 1.000, 1.137)

    ];

    curve = new THREE.CatmullRomCurve3(points);
    //const curveGeometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(100));
    //const curveMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    //const curveObject = new THREE.Line(curveGeometry, curveMaterial);
    //scene.add(curveObject);
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
      scene.environmentIntensity = 10 //controls the intensity 1 is the default 
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
        controls.panSpeed = 3
        return
      }
      const scrollSpeed = 0.002;
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

    controls.minDistance = 1;
    controls.maxDistance = 10;
    function animate() {
      stats.begin();
      const position = curve.getPointAt(scrollValue)
      camera.position.copy(position);
      renderer.render(scene, camera);
      stats.end();
      console.log("draw", renderer.info.render.calls)
      
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


export default curves;
