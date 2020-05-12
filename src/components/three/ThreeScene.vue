<script>
  import * as THREE from 'three';

  const TREES_IN_ROW = 16;

  const Tree = function() {
    const material0 = new THREE.MeshLambertMaterial( {color: 0xffaa00} );
    const material1 = new THREE.MeshLambertMaterial( {color: 0xffffff} );
    this.mesh = new THREE.Group();
    
    const mesh0 = new THREE.Mesh(new THREE.CylinderGeometry( 5, 5, 10, 4 ), material0);
    mesh0.position.y = 5;
    mesh0.castShadow = true;
    mesh0.receiveShadow = true;
    this.mesh.add(mesh0);

    var mesh1 = new THREE.Mesh(new THREE.CylinderGeometry( 0, 25, 60, 7 ), material1);
    mesh1.position.y = 40;
    mesh1.castShadow = true;
    mesh1.receiveShadow = true;
    this.mesh.add(mesh1);

    var mesh2 = new THREE.Mesh(new THREE.CylinderGeometry( 0, 20, 50, 7 ), material1);
    mesh2.position.y = 55;
    mesh2.castShadow = true;
    mesh2.receiveShadow = true;
    this.mesh.add(mesh2);

    var mesh3 = new THREE.Mesh(new THREE.CylinderGeometry( 0, 15, 40, 7 ), material1);
    mesh3.position.y = 70;
    mesh3.castShadow = true;
    mesh3.receiveShadow = true;
    this.mesh.add(mesh3);
    
    this.variation = (Math.random() - .5) * .25;
    
    this.mesh.scale.x = 1 + this.variation;
    this.mesh.scale.y = 1 + this.variation;
    this.mesh.scale.z = 1 + this.variation;
    this.mesh.rotation.y = Math.random() * Math.PI;
  };

  export default {
    name: 'ThreeScene',
    data: () => ({
      scene: {},
      camera: {},
      renderer: {},
      cube: {},
      mesh: {}
    }),
    mounted() {
      this.init();
      this.initTrees();
      this.initFloor();
      this.animate();
    },
    methods: {
      init: function() {
        const container = document.getElementById('scene');

        this.camera = new THREE.PerspectiveCamera(70, container.clientWidth/container.clientHeight, 0.01, 10);
        this.camera.position.z = 1;

        this.scene = new THREE.Scene();
        // const geometry = new THREE.BoxGeometry();

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(this.renderer.domElement);
      },
      animate: function() {
        requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);
      },
      initFloor: function() {
        const floor = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000, 1, 1), new THREE.MeshLambertMaterial({ color: 0xffffff }));
        floor.rotation.x = -Math.PI/2;
        floor.receiveShadow = true;
        this.scene.add(floor);
      },
      initTrees: function() {
        const treeGroup = new THREE.Group();

        for (let z = 0; z < TREES_IN_ROW; z++) {
          for(var x = 0; x < TREES_IN_ROW; x++) {
            const tree = new Tree();
            const variation = (Math.random() - .5) * 25;

            tree.mesh.position.z = (z * 80) - (8 * 80) + variation;
            tree.mesh.position.x = (x * 80) - (8 * 80) + variation;

            treeGroup.add(tree.mesh);
          }
        }

        treeGroup.rotation.y = 1;
        this.scene.add(treeGroup);
      },
    }
  };
</script>

<template>
  <div id="scene">

  </div>
</template>

<style scoped lang="scss">
  @import '@/styles/partials';

</style>
