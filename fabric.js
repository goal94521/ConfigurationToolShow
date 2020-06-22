(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('three')) :
	typeof define === 'function' && define.amd ? define(['exports', 'three'], factory) :
	(global = global || self, factory(global.fabric = {}, global.THREE));
}(this, (function (exports, THREE) { 'use strict';

	var threeLight = function(scene) {
	    //var dirLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
	   // dirLight.color.setHSL( 0.1, 1, 0.9 );
	    // dirLight.position.set( -1, 1, 1 );
	    // dirLight.position.multiplyScalar( 100 );
	   // scene.add(dirLight);

	    /*
	    dirLight.castShadow = true;

	    dirLight.shadow.mapSize.width = 4096;
	    dirLight.shadow.mapSize.height = 4096;

	    var d = 10000;
	    dirLight.shadow.camera.left = -d;
	    dirLight.shadow.camera.right = d;
	    dirLight.shadow.camera.top = d;
	    dirLight.shadow.camera.bottom = -d;

	    dirLight.shadow.camera.far = 7000;
	    dirLight.shadow.bias = -0.0001;
	    
	    dirLight.shadowDarkness = 0.5;
	    */

	//    var dirLight_right = new THREE.DirectionalLight( 0xffffff, 0.4 );
	//    dirLight_right.color.setHSL( 0.1, 1, 0.9 );
	//    dirLight_right.position.set( 2, 1.75, 1 );
	//    dirLight_right.position.multiplyScalar( 1000 );
	   //scene.add(dirLight_right);

	     
	//    var dirLight_back = new THREE.DirectionalLight( 0xffffff, 0.5 );
	//    //dirLight_back.color.setHSL( 0.1, 0.5, 0.9 );
	//    dirLight_back.position.set( 1, 1, -1 );
	//    dirLight_back.position.multiplyScalar( 100 );
	//    scene.add(dirLight_back);

	//     var helper = new THREE.DirectionalLightHelper( dirLight, 5 );
	//     scene.add( helper );

	//     var helper1 = new THREE.DirectionalLightHelper( dirLight_back, 5 );
	//     scene.add( helper1 );

	    var spotLight_big = new THREE.SpotLight( 0xffffe3, 0.8 );
	    spotLight_big.position.set( -100, 50, 200 );
	    spotLight_big.castShadow = true;
	    spotLight_big.angle=Math.PI;
	    spotLight_big.penumbra=true;
	    scene.add(spotLight_big);

	    var spotLightHelper_big = new THREE.SpotLightHelper( spotLight_big );
	       // scene.add( spotLightHelper_big );

	    var spotLight_back = new THREE.SpotLight( 0xffffff, 0.8 );
	        spotLight_back.position.set( 200, 50, -200 );
	        spotLight_back.angle=Math.PI;
	        spotLight_back.penumbra=true;
	        scene.add(spotLight_back);

	    // var spotLightHelper_back = new THREE.SpotLightHelper( spotLight_back );
	    //     scene.add( spotLightHelper_back );

	    var spotLight_top = new THREE.SpotLight( 0xffffff, 0.4 );
	    spotLight_top.position.set( -30, 300, 100 );
	    spotLight_top.penumbra=true;
	    spotLight_top.angle=Math.PI/4;
	        scene.add(spotLight_top);

	    var ambient=new THREE.AmbientLight(0xb9cdff,0.2);
	    ambient.position.set(5000,5000,5000);
	    scene.add(ambient);
	};

	var state = {
	    fut:1,
	    padding:20,
	    depth: 0.01,
	    width: 30,
	    length: 60,
	    height: 16,
	    pitch:1,
	    pitch_calc:60/12,
	    o_sides:0,
	    o_end:0,
	    wainscot:false,
	    wainscotHeight:4,
	    gutter:false,

	    wainscotColor:'#d8e5e6',
	    wallColor: '#8a7967',
	    roofColor: '#d8e5e6',
	    trimColor: '#4b3d2a',
	    ventColor: '#d8e5e6',
	    rollupColor: '#d8e5e6',
	    doorColor: '#cccccc',
	    windowColor: '#00B8D9',

	    isChangeColor:false,
	    
	    girtColor: '#ff3300',
	    limits: {
	        width:[5,60],
	        length:[5,200],
	        height:[5,24],
	        pitch:[1,5],
	        o_sides:[0,5],
	        o_end:[0,5]
	    },
	    limitsLean: {
	        width:[6,25],
	        pitch:[1,5],
	        drop:[1,20],
	        cut1:[0,50],
	        cut2:[0,50]
	    },
	    holes: {
	        front:{},
	        back:{},
	        left:{},
	        right:{}
	    },
	    overhang: {
	        front:{
	            enable:false,
	            width:15,
	            pitch:1,
	            drop:2,
	            cut1:0,
	            cut2:0 
	        },
	        back:{
	            enable:false,
	            width:15,
	            pitch:1,
	            drop:2,
	            cut1:0,
	            cut2:0 
	        },
	        left:{
	            enable:false,
	            width:15,
	            pitch:1,
	            drop:2,
	            cut1:0,
	            cut2:0 
	        },
	        right:{
	            enable:false,
	            width:15,
	            pitch:1,
	            drop:2,
	            cut1:0,
	            cut2:0 
	        }
	    },
	    spread:false,
	    vent:'none',
	    viewPreset:false,
	    viewScene:'default',
	    isUpdateScene:true,
	    views:{
	        car:false,
	        person:false
	    },
	    accessories:false,
	    isUpdateAccessories:false,

	    newHole:false,
	    removeHole:false,
	    setState: function(action,callback) {
	       
	        if (typeof action === 'object') {
	            if (typeof this[action.type] !== "undefined" && action.type!='removeHole') {
	                if (action.type=='width' || action.type=='height' ||action.type=='length' ||action.type=='pitch' ||action.type=='o_sides' ||action.type=='o_end') {
	                    var value = parseInt(action.value);
	                    if (typeof this.limits[action.type] !== 'undefined') {
	                        if (value < this.limits[action.type][0]) {
	                            value = this.limits[action.type][0];
	                        } else if (value > this.limits[action.type][1]) {
	                            value = this.limits[action.type][1];
	                        }
	                    }
	                    if (action.type=='pitch') {
	                        this[action.type] = value/this.fut/2;
	                    } else {
	                        this[action.type] = value/this.fut;
	                    }
	                    if (typeof callback === 'function') callback(value);
	                    this.needsUpdate=true;

	                } else if (action.type == 'viewPreset') {
	                    this[action.type] = action.value;
	                } else if (action.type == 'viewScene') {
	                    this[action.type] = action.value;
	                    this.isUpdateScene = true;
	                } else {
	                    this[action.type] = action.value;
	                    this.needsUpdate=true;
	                }

	                console.log(state);
	           
	            } else {
	                if (action.type == 'hole') {
	                    this.holes[action.wall][action.id] = action.value;
	                    this.needsUpdate=true;

	                } else if (action.type == 'addHole') {
	                    this.newHole = {wall: action.wall, size: action.value, name:action.name, callback:action.callback};   
	                    this.needsUpdate=true;

	                } else if (action.type == 'removeHole') {
	                    this.removeHole = {id:action.value, callback:action.callback};  
	                    this.needsUpdate=true;

	                } else if (action.type == 'set-lean-to') {
	                    var value = parseInt(action.value);
	                    if (typeof this.limitsLean[action.name] !== 'undefined') {
	                        if (value < this.limitsLean[action.name][0]) {
	                            value = this.limitsLean[action.name][0];
	                        } else if (value > this.limitsLean[action.name][1]) {
	                            value = this.limitsLean[action.name][1];
	                        }
	                        if (action.name=='pitch') {
	                            this.overhang[action.wall][action.name] = value/2;
	                        } else {
	                            this.overhang[action.wall][action.name] = value;
	                        }
	                       
	                    } else {
	                        this.overhang[action.wall][action.name] = action.value;
	                    }
	                    if (typeof callback === 'function') callback(value);
	                    this.needsUpdate=true;

	                } else if (action.type == 'setColor') {
	                    this[action.name] = '#' + action.value;
	                    if (action.name == 'trimColor' || action.name == 'rollupColor') {
	                        this.isChangeColor = true;
	                    }
	                    this.needsUpdate=true;

	                } else if (action.type == 'addModel') {
	                    if (this.views[action.value]===false) this.views[action.value] = true;
	                    else if (this.views[action.value]===true) this.views[action.value] = false;

	                    if (typeof callback === 'function') callback({ type:action.value, status: this.views[action.value] });
	                    this.isUpdateAccessories=true;
	                } 
	                console.log(state);
	               
	            }
	        }
	        return this;
	    },
	    getScene: function () {
	        console.log(this.scene.toJSON());
	    },
	    scene:null,
	    group:null,
	    texture:null,

	    holeGroup:null,
	    baseUrl:'http://bydenis.com/fabric/build',
	    controls:true,
	    needsUpdate:true
	};

	var addLand = function(scene) {

	    var group = new THREE.Group();
	    
	    var TextureLoader=new THREE.TextureLoader();

	    var geometry = new THREE.PlaneBufferGeometry( 2000, 2000, 32 );
	        var material = new THREE.MeshStandardMaterial();
	        var plane = new THREE.Mesh( geometry, material );
	        plane.position.y=-0.1;
	        plane.rotateX(-Math.PI/2);
	        group.add( plane );

	    if (state.viewScene == 'default' || state.viewScene == 'west_texas' || state.viewScene == 'east_texas') {
	        

	        // SKYDOME
	        var vertexShader = document.getElementById('vertexShader').textContent;
	        var fragmentShader = document.getElementById('fragmentShader').textContent;
	        var uniforms = {
	            topColor:    {value: new THREE.Color(0x0077ff)},
	            bottomColor: {value: new THREE.Color(0xffffff)},
	            offset:      {value: 33},
	            exponent:    {value: 0.7}
	        };
	        //uniforms.topColor.value.copy(hemiLight.color);
	        
	        //scene.fog.color.copy(uniforms.bottomColor.value);

	        var skyGeo = new THREE.SphereGeometry(500,32,15);
	        var skyMat = new THREE.ShaderMaterial({vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms, side: THREE.BackSide});

	        var sky = new THREE.Mesh(skyGeo, skyMat);
	        group.add(sky);
	        
	        if (state.viewScene == 'west_texas') {
	            var TextureLoader=new THREE.TextureLoader();
	            TextureLoader.load(state.baseUrl + "/source/mountains.jpg",
	                function(texture) {
	                    texture.wrapS=texture.wrapT=THREE.RepeatWrapping;
	                    var _r=80;
	                    texture.repeat.set(512/_r,512/_r);
	                    material.map=texture;
	                    material.needsUpdate=true;
	                }
	            );
	        } else {

	            //участок текстура
	            TextureLoader.load(state.baseUrl + "/source/grass.jpg",
	                function(texture) {
	                    texture.wrapS=texture.wrapT=THREE.RepeatWrapping;
	                    texture.repeat.set(5/1865*8000*4,5/1865*8000*4);
	                    material.map=texture;
	                    material.needsUpdate=true;
	                }
	            );
	        }
	    } else if (state.viewScene == 'mountains') {

	        var TextureLoader=new THREE.TextureLoader();
	        TextureLoader.load(state.baseUrl + "/source/mountains.jpg",
	            function(texture) {
	                texture.wrapS=texture.wrapT=THREE.RepeatWrapping;
	                var _r=80;
	                texture.repeat.set(512/_r,512/_r);
	                material.map=texture;
	                material.needsUpdate=true;
	            }
	        );
	       
	       scene.background = new THREE.CubeTextureLoader()
	       .setPath( state.baseUrl + "/source/mountains/" )
	           .load( [
	               'px.jpg',
	               'nx.jpg',
	               'py.jpg',
	               'ny.jpg',
	               'pz.jpg',
	               'nz.jpg'
	           ] );
	    }
	    if (state.viewScene == 'east_texas') {
	        var loader = new THREE.ObjectLoader();
	        loader.load(state.baseUrl + "/source/tree1.json", function ( obj ) {
	            
	            var treeL1 = obj.clone();
	            treeL1.position.set(-40,0,-30);
	            treeL1.scale.set(1.5,1.5,1.5);
	            group.add(treeL1);

	            var treeL2 = obj.clone();
	            treeL2.position.set(-45,0,10);
	            treeL2.scale.set(1.8,1.8,1.8);
	            group.add(treeL2);

	            var treeL3 = obj.clone();
	            treeL3.position.set(-38,0,5);
	            treeL3.scale.set(0.5,0.5,0.5);
	            group.add(treeL3);

	            var treeL4 = obj.clone();
	            treeL4.position.set(-39,0,20);
	            treeL4.scale.set(1.3,1.3,1.3);
	            group.add(treeL4);


	            var treeR1 = obj.clone();
	            treeR1.position.set(45,0,8);
	            treeR1.scale.set(1.8,1.8,1.8);
	            group.add(treeR1);

	            var treeR2 = obj.clone();
	            treeR2.position.set(40,0,-30);
	            treeR2.scale.set(1.3,1.3,1.3);
	            group.add(treeR2);

	            var treeR3 = obj.clone();
	            treeR3.position.set(38,0,20);
	            treeR3.scale.set(0.5,0.5,0.5);
	            group.add(treeR3);

	            var treeR4 = obj.clone();
	            treeR4.position.set(45,0,-20);
	            treeR4.scale.set(0.5,0.5,0.5);
	            group.add(treeR4);

	            var treeR5 = obj.clone();
	            treeR5.position.set(41,0,25);
	            treeR5.scale.set(0.9,0.9,0.9);
	            group.add(treeR5);

	            var treeR6 = obj.clone();
	            treeR6.position.set(44,0,40);
	            treeR6.scale.set(1.9,1.9,1.9);
	            group.add(treeR6);
	            
	        });
	    }
	    
	    scene.remove(state.groupLand);
	    scene.add(group);
	    state.groupLand = group;

	    state.isUpdateScene=false;
	};

	var assignUVs = function(geometry) {
	    
	   geometry.faceVertexUvs[0] = [];

	    geometry.faces.forEach(function(face) {

	        var components = ['x', 'y', 'z'].sort(function(a, b) {
	            return Math.abs(face.normal[a]) > Math.abs(face.normal[b]);
	        });

	        var v1 = geometry.vertices[face.a];
	        var v2 = geometry.vertices[face.b];
	        var v3 = geometry.vertices[face.c];

	        geometry.faceVertexUvs[0].push([
	            new THREE.Vector2(v1[components[0]], v1[components[1]]),
	            new THREE.Vector2(v2[components[0]], v2[components[1]]),
	            new THREE.Vector2(v3[components[0]], v3[components[1]])
	        ]);

	    });

	    geometry.uvsNeedUpdate = true;
	};

	var materailWall = function(w,h,rotation,color) {
	    var set_color = state.wallColor;
	    if (typeof color != 'undefined') set_color=color;
	    var material = new THREE.MeshStandardMaterial( { color: set_color } );
	    material.side = THREE.DoubleSide;
	       
	    var TextureLoader=new THREE.TextureLoader();
	    TextureLoader.load( state.baseUrl + '/source/NormalMap.jpg',
	        function(texture) {
	            texture.wrapS=texture.wrapT=THREE.RepeatWrapping;
	           
	            texture.anisotropy = 1;
	            if (typeof rotation != 'undefined' && rotation!=-1) {
	                texture.rotation = rotation;
	                texture.repeat.set(h*10/4/3.1*state.fut,w/30*40/100*state.fut);
	                material.bumpScale = .04;
	            } else {
	                texture.repeat.set(w/30*40/1.5*state.fut,h*10/2*state.fut);
	                material.bumpScale = .04;
	            }
	            material.normalMap=texture;
	            material.normalScale = new THREE.Vector2(.3,1);
	           // material.bumpScale = .06;
	           
	            material.needsUpdate=true;
	            texture.needsUpdate=true;
	        }
	    );
	    
	    return material;
	};

	var buildTrim = function(scene) {
	    var lengthRoof = state.length+state.depth*2+state.o_end;
	    var material = new THREE.MeshBasicMaterial( { color: state.trimColor } );
	    //var material = new THREE.MeshNormalMaterial(  );
	    material.side = THREE.DoubleSide;

	    var otstup = 0.05;

	    var loader = new THREE.ObjectLoader();
	    loader.load(state.baseUrl + "/source/trim1.json", function ( obj ) {
	        var  lObj = 60.911766052246094;
	        var newObj = new THREE.Mesh(obj.geometry.clone(), material);
	        
	        //newObj.position.y = -0.1/2;

	        //scene.geometry.computeBoundingBox();
	        //console.log(newObj.geometry.boundingBox); 

	        var _roofZ = state.skew+state.depth/2+state.o_sides;
	        //var _roofX = state.skew+state.depth/2+state.o_sides;

	        if (scene.name == 'roofLeft') {
	            var trimCentr = newObj.clone();

	            trimCentr.scale.set(3,3,(lengthRoof)/lObj);
	            trimCentr.position.z = -(lengthRoof)/2;
	            trimCentr.position.x = -_roofZ/2-0.3;
	            trimCentr.rotateY(Math.PI);
	    
	            var trimFront = newObj.clone();
	            trimFront.scale.set(3,3,(_roofZ-otstup)/lObj);
	            trimFront.rotateY(-Math.PI/2);
	            trimFront.position.x = -(_roofZ-otstup)/2;
	            trimFront.position.z = (lengthRoof)/2+0.3;
	    
	            var trimBack = newObj.clone();
	            trimBack.scale.set(3,3,(_roofZ-otstup)/lObj);
	            trimBack.rotateY(Math.PI/2);
	            trimBack.position.x = (_roofZ-otstup)/2;
	            trimBack.position.z = -(lengthRoof)/2-0.3;

	            loader.load(state.baseUrl + "/source/trimAngel.json", function ( obj ) {
	                var angelObj = new THREE.Mesh(obj.geometry.clone(), material);
	                angelObj.scale.set(3,3,3);
	              //  angelObj.position.y = -0.1/2;

	                var angelFront = angelObj.clone();
	                angelFront.position.x = -(_roofZ)/2-0.1;
	                angelFront.position.z = (lengthRoof)/2+0.09;
	                angelFront.rotateY(-Math.PI/2);
	                scene.add(angelFront);
	                
	               
	                var angelBack = angelObj.clone();
	                angelBack.position.x = -(_roofZ)/2-0.2;
	                angelBack.position.z = -(lengthRoof)/2-0.05;
	                angelBack.rotateY(Math.PI);
	                scene.add(angelBack);
	            });
	    
	        } else if (scene.name == 'roofRight') {
	            var trimCentr = newObj.clone();
	            trimCentr.scale.set(3,3,(lengthRoof)/lObj);
	            trimCentr.position.z = (lengthRoof)/2;
	            trimCentr.position.x = _roofZ/2+0.3;
	            //trimCentr.rotateY(-Math.PI);

	            var trimFront = newObj.clone();
	            trimFront.scale.set(3,3,(_roofZ-otstup)/lObj);
	            trimFront.rotateY(-Math.PI/2);
	            trimFront.position.x = -(_roofZ-otstup)/2;
	            trimFront.position.z = (lengthRoof)/2+0.3;
	    
	            var trimBack = newObj.clone();
	            trimBack.scale.set(3,3,(_roofZ-otstup)/lObj);
	            trimBack.rotateY(Math.PI/2);
	            trimBack.position.x = (_roofZ-otstup)/2;
	            trimBack.position.z = -(lengthRoof)/2-0.3;

	            loader.load(state.baseUrl + "/source/trimAngel.json", function ( obj ) {
	                var angelObj = new THREE.Mesh(obj.geometry.clone(), material);
	                angelObj.scale.set(3,3,3);
	              //  angelObj.position.y = -0.1/2;

	                var angelFront = angelObj.clone();
	                angelFront.position.x = (_roofZ)/2+0.2;
	                angelFront.position.z = (lengthRoof)/2;
	                scene.add(angelFront);
	                
	               
	                var angelBack = angelObj.clone();
	                angelBack.position.x = (_roofZ)/2+0.11;
	                angelBack.position.z = -(lengthRoof)/2-0.09;
	                angelBack.rotateY(Math.PI/2);
	                scene.add(angelBack);
	            });
	        }
	        
	        scene.add(trimCentr);
	        scene.add(trimFront);
	        scene.add(trimBack);

	    });
	};

	var buildGirt = function(scene) {
	   // var material = new THREE.MeshBasicMaterial( { color: state.girtColor } );
	    var material = new THREE.MeshStandardMaterial( { color: state.girtColor } );
	    //var material = new THREE.MeshNormalMaterial(  );
	    material.side = THREE.DoubleSide;

	    var lengthGirt = 1.3121999502182007*2;
	    var depthGirt = 0.2-0.08;

	    var setGirt = function(obj,h) {
	        var newObj = obj.clone();
	        newObj.position.y += h;
	        return newObj;
	    };
	    var setGirtRoof = function(obj,x) {
	        var newObj = obj.clone();
	        newObj.position.x += x;
	        return newObj;
	    };

	    var loader = new THREE.ObjectLoader();
	    loader.load(state.baseUrl + "/source/girt.json", function ( obj ) {
	        obj.position.set(0,0,0);
	        obj.material = material;
	        
	        var objFB = obj.clone(obj);
	        obj.scale.set(1,1,state.length/lengthGirt);
	        objFB.scale.set(1,1,state.width/lengthGirt);


	        if (scene.name == 'roofLeft') {
	            var count = Math.ceil((state.skew+state.depth/2-1)/4);  

	            var objRoof = obj.clone();
	            objRoof.rotateZ(Math.PI/2);
	            objRoof.position.x = (state.skew+state.depth/2) / 2 + 3;
	            objRoof.position.y = -depthGirt;

	            for (var i=1; i<count; i++) {
	                 scene.add( setGirtRoof(objRoof, -i*4) );
	            }
	            scene.add( setGirtRoof( objRoof, -state.skew+state.depth/2 + depthGirt));

	        } else if (scene.name == 'roofRight') {
	            var count = Math.ceil((state.skew+state.depth/2-1)/4);  

	            var objRoof = obj.clone();
	            objRoof.rotateZ(-Math.PI/2);
	            objRoof.position.x = -(state.skew+state.depth/2) / 2 - 3;
	            objRoof.position.y = -depthGirt;

	            for (var i=1; i<count; i++) {
	                scene.add( setGirtRoof(objRoof, i*4) );
	           }
	           scene.add( setGirtRoof( objRoof, state.skew+state.depth/2 - depthGirt));

	        } else {
	            if (state.height>5) {
	                var countVertical = Math.ceil(state.height/4);  
	                
	                var objLeft = obj.clone();
	                objLeft.position.x = -state.width/2 + depthGirt;
	    
	                var objRight = obj.clone();
	                objRight.rotateY(Math.PI);
	                objRight.position.x = state.width/2 - depthGirt;
	    
	                var objFront = objFB.clone();
	                objFront.rotateY(Math.PI/2);
	                objFront.position.z = state.length/2 - depthGirt;
	    
	                var objBack = objFB.clone();
	                objBack.rotateY(-Math.PI/2);
	                objBack.position.z = -state.length/2 + depthGirt;
	    
	                for (var i=1; i<countVertical; i++) {
	                    scene.add( setGirt(objLeft, i*4) );
	                    scene.add( setGirt(objRight, i*4) );
	                    scene.add( setGirt(objFront, i*4) );
	                    scene.add( setGirt(objBack, i*4) );
	                }
	            }
	        }
	    });

	};

	var setGirt = function(obj,z) {
	    var newObj = obj.clone();
	    newObj.position.z += z;
	    return newObj;
	};

	var buildGirtVertical = function(scene,roofLeft,roofRight) {
	    var material = new THREE.MeshStandardMaterial( { color: state.girtColor } );
	    //var material = new THREE.MeshNormalMaterial(  );
	    material.side = THREE.DoubleSide;

	    var lengthGirt = 3.04*2;
	    var depthGirt = 0.12;
	    // obj.geometry.computeBoundingBox();
	    // console.log(obj.geometry.boundingBox); 

	    var countGirt = Math.floor((state.length-1)/25);

	    var loader = new THREE.ObjectLoader();
	   
	    loader.load(state.baseUrl + "/source/gritVertical.json", function ( obj ) {
	        obj.position.set(0,0,0);
	        obj.material = material;
	        var objFB = obj.clone();
	        obj.scale.set(state.height/lengthGirt,2,2);
	        obj.rotateZ(Math.PI/2);
	        
	        objFB.scale.set((state.height+state.pitch_calc-0.1)/lengthGirt,2,2);
	        objFB.rotateZ(Math.PI/2);

	        if (state.width>20) {
	            objFB.position.y = (state.height+state.pitch_calc-0.1)/2-0.01;
	            var objFront = objFB.clone();
	            objFront.position.z = -state.length/2+depthGirt;

	            var objBack = objFB.clone();
	            objBack.rotateY(Math.PI);
	            objBack.position.z = state.length/2-depthGirt;
	            
	            scene.add(objFront);
	            scene.add(objBack);
	        }

	        //Левая стена
	        var objLeft = obj.clone();
	        objLeft.position.y = state.height/2-0.01;
	        objLeft.position.x = -state.width/2+depthGirt;
	        objLeft.rotateX(Math.PI/2);

	        var objLeftFront = objLeft.clone();
	        objLeftFront.position.z = state.length/2-depthGirt*2;
	        scene.add(objLeftFront);

	        var objLeftBack = objLeft.clone();
	        objLeftBack.position.z = -state.length/2+depthGirt*2;
	        scene.add(objLeftBack);
	        
	        if (countGirt==1) {
	            scene.add(setGirt(objLeft,0));
	        } else {

	            for (var i = 0; i<countGirt; i++) {
	                var offset = 25*i - (state.length/4+depthGirt*2*2*i);
	                scene.add(setGirt(objLeft,offset));
	            }
	        }

	        //Правая стена
	        var objRight = objLeft.clone();
	        objRight.rotateX(Math.PI);
	        objRight.position.x = state.width/2-depthGirt;
	        
	        var objRightFront = objRight.clone();
	        objRightFront.position.z = state.length/2-depthGirt*2;
	        scene.add(objRightFront);
	        var objRightBack = objRight.clone();
	        objRightBack.position.z = -state.length/2+depthGirt*2;
	        scene.add(objRightBack);
	        
	        if (countGirt==1) {
	            scene.add(setGirt(objRight,0));
	        } else {

	            for (var i = 0; i<countGirt; i++) {
	                var offset = 25*i - (state.length/4+depthGirt*2*2*i);
	                scene.add(setGirt(objRight,offset));
	            }
	        }

	        //Крыша
	        loader.load(state.baseUrl + "/source/beam.json", function ( obj ) {
	            obj.position.set(0,-0.32,0);

	            var lengthBeam = 3.4723;
	            // obj.geometry.computeBoundingBox();
	            // console.log(obj.geometry.boundingBox); 

	            obj.scale.set(2,(state.skew-0.32)/lengthBeam,2);
	            obj.material = material;
	            //obj.material = new THREE.MeshNormalMaterial();

	            obj.rotateZ(Math.PI/2);
	            obj.rotateY(Math.PI/2);

	            var beamLeft = obj.clone();
	            beamLeft.rotateZ(Math.PI);
	            beamLeft.position.x=0.05*state.pitch_calc+0.2+state.o_sides/2;

	            var beamRight = obj.clone();
	            beamRight.position.x=-0.05*state.pitch_calc-0.2-state.o_sides/2;

	            var beamLeftFront = beamLeft.clone();
	            beamLeftFront.position.z= state.length/2-0.2;
	            roofLeft.add(beamLeftFront);

	            var beamLeftBack = beamLeft.clone();
	            beamLeftBack.position.z= -state.length/2+0.2;
	            roofLeft.add(beamLeftBack);

	            var beamReightFront = beamRight.clone();
	            beamReightFront.position.z= state.length/2-0.2;
	            roofRight.add(beamReightFront);

	            var beamReightBack = beamRight.clone();
	            beamReightBack.position.z= -state.length/2+0.2;
	            roofRight.add(beamReightBack);


	            if (countGirt==1) {
	                roofLeft.add(setGirt(beamLeft,0));
	            } else {
	    
	                for (var i = 0; i<countGirt; i++) {
	                    var offset = 25*i - (state.length/4+depthGirt*2*2*i);
	                    roofLeft.add(setGirt(beamLeft,offset));
	                }
	            }

	            if (countGirt==1) {
	                roofRight.add(setGirt(beamRight,0));
	            } else {
	    
	                for (var i = 0; i<countGirt; i++) {
	                    var offset = 25*i - (state.length/4+depthGirt*2*2*i);
	                    roofRight.add(setGirt(beamRight,offset));
	                }
	            }

	        });
	      
	    });

	};

	var buildWall = function(scene) {
	    //calc angel
	    state.pitch_calc = state.width/12*state.pitch;
	    
	    state.skew = Math.sqrt(state.pitch_calc*state.pitch_calc + state.width/2*state.width/2);
	    var sin = state.pitch_calc/state.skew;
	    state.rotate_angel = Math.asin(sin)/Math.PI * 180 * Math.PI/180;

	    var extrudeSettings = { depth: state.depth, bevelEnabled: false, steps: 1};

	    //Wall front
	    var shapeFront = new THREE.Shape();
	    shapeFront.moveTo(-state.width/2,0);
	    shapeFront.lineTo(state.width/2,0);
	    shapeFront.lineTo(state.width/2,state.height);
	    shapeFront.lineTo(0,state.height+state.pitch_calc);
	    shapeFront.lineTo(-state.width/2,state.height);
	    shapeFront.lineTo(-state.width/2,0);
	    var shapeBack = shapeFront.clone();

	    var shapeFrontWainscot = new THREE.Shape();
	    shapeFrontWainscot.moveTo(-state.width/2,0);
	    shapeFrontWainscot.lineTo(state.width/2,0);
	    shapeFrontWainscot.lineTo(state.width/2,state.wainscotHeight);
	    shapeFrontWainscot.lineTo(-state.width/2,state.wainscotHeight);
	    shapeFrontWainscot.lineTo(-state.width/2,0);
	    var shapeBackWainscot = shapeFrontWainscot.clone();
	    
	    for (var _hole in state.holes.front) {
	        shapeFront.holes.push(state.holes.front[_hole]); 

	        var w_hole = state.holes.front[_hole].clone();
	        var is_add=false;
	        for(var w=0; w<w_hole.curves.length; w++) {
	            if (w_hole.curves[w].v1.y<state.wainscotHeight || w_hole.curves[w].v2.y<state.wainscotHeight) is_add=true;
	            if (w_hole.curves[w].v1.y>state.wainscotHeight) w_hole.curves[w].v1.y = state.wainscotHeight;
	            if (w_hole.curves[w].v2.y>state.wainscotHeight) w_hole.curves[w].v2.y = state.wainscotHeight;
	        }
	        if (is_add===true) shapeFrontWainscot.holes.push(w_hole); 
	    }
	    for (var _hole in state.holes.back) {
	        shapeBack.holes.push(state.holes.back[_hole]);

	        var w_hole = state.holes.back[_hole].clone();
	        var is_add=false;
	        for(var w=0; w<w_hole.curves.length; w++) {
	            if (w_hole.curves[w].v1.y<state.wainscotHeight || w_hole.curves[w].v2.y<state.wainscotHeight) is_add=true;
	            if (w_hole.curves[w].v1.y>state.wainscotHeight) w_hole.curves[w].v1.y = state.wainscotHeight;
	            if (w_hole.curves[w].v2.y>state.wainscotHeight) w_hole.curves[w].v2.y = state.wainscotHeight;
	        }
	        if (is_add===true) shapeBackWainscot.holes.push(w_hole); 
	    }
	  
	    var geometryFront = new THREE.ExtrudeGeometry( shapeFront, extrudeSettings );
	    geometryFront.uvsNeedUpdate = true;
	    assignUVs(geometryFront);

	    var geometryBack = new THREE.ExtrudeGeometry( shapeBack, extrudeSettings );
	    geometryBack.uvsNeedUpdate = true;
	    assignUVs(geometryBack);
	    
	    var meshFront = new THREE.Mesh( geometryFront, materailWall(1,1));
	    meshFront.name = 'wallFront';
	    meshFront.position.z = state.length/2;
	    
	    var meshBack = new THREE.Mesh( geometryBack, materailWall(1,1));
	    meshFront.name = 'wallBack';
	    meshBack.position.z = -state.length/2-state.depth;
	   
	    if (state.wainscot===true) {
	        var geometryFrontWainscot = new THREE.ExtrudeGeometry( shapeFrontWainscot, extrudeSettings );
	        geometryFrontWainscot.uvsNeedUpdate = true;
	        assignUVs(geometryFrontWainscot);
	        
	        var meshFrontWainscot = new THREE.Mesh( geometryFrontWainscot, materailWall(1,1,-1,state.wainscotColor));
	        meshFrontWainscot.name = 'wainscotFront';
	        meshFrontWainscot.position.z = 0.01;
	        meshFront.add(meshFrontWainscot);

	        var geometryBackWainscot = new THREE.ExtrudeGeometry( shapeBackWainscot, extrudeSettings );
	        geometryBackWainscot.uvsNeedUpdate = true;
	        assignUVs(geometryBackWainscot);
	        
	        var meshBackWainscot = new THREE.Mesh( geometryBackWainscot, materailWall(1,1,-1,state.wainscotColor));
	        meshBackWainscot.name = 'wainscotBack';
	        meshBackWainscot.position.z = -0.01;
	        meshBack.add(meshBackWainscot);
	    }

	    var geometryFloor = new THREE.BoxGeometry( state.width,state.depth, state.length );
	    var meshFloor = new THREE.Mesh( geometryFloor, new THREE.MeshStandardMaterial({ color: 0xcccccc }) );
	    meshFloor.name = 'floor';
	    meshFloor.position.y = state.depth/2;
	    
	    //Wall left/right
	    var shapeLeft = new THREE.Shape();
	    shapeLeft.moveTo(-state.length/2,0);
	    shapeLeft.lineTo(state.length/2,0);
	    shapeLeft.lineTo(state.length/2,state.height);
	    shapeLeft.lineTo(-state.length/2,state.height);
	    shapeLeft.lineTo(-state.length/2,0);
	    var shapeRight = shapeLeft.clone();

	    var shapeLeftWainscot = new THREE.Shape();
	    shapeLeftWainscot.moveTo(-state.length/2,0);
	    shapeLeftWainscot.lineTo(state.length/2,0);
	    shapeLeftWainscot.lineTo(state.length/2,state.wainscotHeight);
	    shapeLeftWainscot.lineTo(-state.length/2,state.wainscotHeight);
	    shapeLeftWainscot.lineTo(-state.length/2,0);
	    var shapeRightWainscot = shapeLeftWainscot.clone();

	    for (var _hole  in state.holes.left) {
	        shapeLeft.holes.push(state.holes.left[_hole]);

	        var w_hole = state.holes.left[_hole].clone();
	        var is_add=false;
	        for(var w=0; w<w_hole.curves.length; w++) {
	            if (w_hole.curves[w].v1.y<state.wainscotHeight || w_hole.curves[w].v2.y<state.wainscotHeight) is_add=true;
	            if (w_hole.curves[w].v1.y>state.wainscotHeight) w_hole.curves[w].v1.y = state.wainscotHeight;
	            if (w_hole.curves[w].v2.y>state.wainscotHeight) w_hole.curves[w].v2.y = state.wainscotHeight;
	        }
	        if (is_add===true) shapeLeftWainscot.holes.push(w_hole); 
	    }
	    for (var _hole  in state.holes.right) {
	        shapeRight.holes.push(state.holes.right[_hole]);

	        var w_hole = state.holes.right[_hole].clone();
	        var is_add=false;
	        for(var w=0; w<w_hole.curves.length; w++) {
	            if (w_hole.curves[w].v1.y<state.wainscotHeight || w_hole.curves[w].v2.y<state.wainscotHeight) is_add=true;
	            if (w_hole.curves[w].v1.y>state.wainscotHeight) w_hole.curves[w].v1.y = state.wainscotHeight;
	            if (w_hole.curves[w].v2.y>state.wainscotHeight) w_hole.curves[w].v2.y = state.wainscotHeight;
	        }
	        if (is_add===true) shapeRightWainscot.holes.push(w_hole); 
	    }

	    var geometryLeft = new THREE.ExtrudeGeometry( shapeLeft, extrudeSettings );
	    geometryLeft.uvsNeedUpdate = true;
	    assignUVs(geometryLeft);

	    
	    var meshLeft = new THREE.Mesh( geometryLeft, materailWall(1,1) );
	        meshLeft.name = 'wallLeft';
	        meshLeft.rotateY(Math.PI/2);
	       // meshLeft.position.y = (state.height-state.depth)/2+state.depth;
	        meshLeft.position.x = -state.width/2+state.depth/2;
	        
	    var geometryRight = new THREE.ExtrudeGeometry( shapeRight, extrudeSettings );
	    geometryRight.uvsNeedUpdate = true;
	    assignUVs(geometryRight);

	    var meshRight = new THREE.Mesh( geometryRight, materailWall(1,1) );
	        meshRight.name = 'wallRight';
	        meshRight.rotateY(Math.PI/2);
	        meshRight.position.x = state.width/2-state.depth/2;

	    if (state.wainscot===true) {
	        var geometryLeftWainscot = new THREE.ExtrudeGeometry( shapeLeftWainscot, extrudeSettings );
	        geometryLeftWainscot.uvsNeedUpdate = true;
	        assignUVs(geometryLeftWainscot);
	        
	        var meshLeftWainscot = new THREE.Mesh( geometryLeftWainscot, materailWall(1,1,-1,state.wainscotColor));
	        meshLeftWainscot.name = 'wainscotLeft';
	        meshLeftWainscot.position.z = -0.01;
	        meshLeft.add(meshLeftWainscot);

	        var geometryRightWainscot = new THREE.ExtrudeGeometry( shapeRightWainscot, extrudeSettings );
	        geometryRightWainscot.uvsNeedUpdate = true;
	        assignUVs(geometryRightWainscot);
	        
	        var meshRightWainscot = new THREE.Mesh( geometryRightWainscot, materailWall(1,1,-1,state.wainscotColor));
	        meshRightWainscot.name = 'wainscotRight';
	        meshRightWainscot.position.z = 0.01;
	        meshRight.add(meshRightWainscot);
	    }
	    //--Skew
	    var geometry_skew = new THREE.BoxGeometry( state.skew+state.depth/2+state.o_sides, state.depth, state.length+state.depth*2+state.o_end );
	    var mesh_skew= new THREE.Mesh( geometry_skew, materailWall(state.skew+state.depth/2+state.o_sides, state.length+state.depth*2+state.o_end, Math.PI/2, state.roofColor) );
	    
	    
	    var roof_left = mesh_skew.clone();
	    roof_left.name = 'roofLeft';
	    roof_left.position.x=-state.o_sides/2;
	    
	        buildTrim(roof_left);//ADD TRIM
	        buildGirt(roof_left);//ADD GIRT


	    var roof_left_group =new THREE.Group();
	        roof_left_group.name = 'roofLeftGroup';
	        roof_left_group.rotateZ(state.rotate_angel);
	        roof_left_group.position.y = state.height+state.pitch_calc/2+state.depth/2;
	        roof_left_group.position.x = -state.width/2/2;
	        roof_left_group.add(roof_left);

	    var roof_right = mesh_skew.clone();
	        roof_right.name = 'roofRight';
	        roof_right.position.x=state.o_sides/2;

	        buildTrim(roof_right);//ADD TRIM
	        buildGirt(roof_right);//ADD GIRT

	    var roof_right_group =new THREE.Group();
	        roof_right_group.name = 'roofRightGroup';
	    roof_right_group.rotateZ(-state.rotate_angel);
	    roof_right_group.position.y = state.height+state.pitch_calc/2+state.depth/2;
	    roof_right_group.position.x = state.width/2/2;
	    roof_right_group.add(roof_right);
	    //-------

	    scene.add( roof_left_group );
	    scene.add( roof_right_group );

	    scene.add( meshLeft );
	    scene.add( meshRight );

	    scene.add( meshFloor );

	    scene.add( meshBack );
	    scene.add( meshFront );
	   
	    buildGirtVertical(scene,roof_left,roof_right);
	    buildGirt(scene);
	  
	};

	var getHoles = function(callback) {
	    if (typeof callback === 'function') { 
	        var return_arr = new Array();
	        for (var i=0; i<state.holeGroup.children.length; i++) {
	            return_arr.push({name:state.holeGroup.children[i].name, id: state.holeGroup.children[i].uuid});
	        }
	        callback(return_arr); 
	    }
	};

	var addHole = function() {
	    if (state.newHole !==false && typeof state.newHole.size != 'undefined') {
	        var arr_size = state.newHole.size.split('_');
	        arr_size[1] = parseInt(arr_size[1]);
	        arr_size[2] = parseInt(arr_size[2]);

	        var geometry = new THREE.BoxGeometry( arr_size[1] + .6, arr_size[2] + .6, 0.8 );
	        var geometry_glass = new THREE.BoxGeometry( arr_size[1], arr_size[2], .01 );
	        var material = new THREE.MeshStandardMaterial({color:0xd7d7d7});
	        material.side = THREE.DoubleSide;
	        material.transparent = true;
	        material.opacity = 0;
	        material.alphaTest = 0.1;

	        var mesh = new THREE.Mesh( geometry,  material);
	        
	        var material_glass = material.clone();
	        var mesh_glass = new THREE.Mesh( geometry_glass, material_glass );
	       // mesh_glass.position.set(arr_size[1]/2,arr_size[2]/2,0);
	        mesh_glass.position.set(0,0,0.04);

	        mesh.wall = state.newHole.wall;
	        mesh.design = arr_size[0];
	        mesh.sizeHole = state.newHole.size;
	        mesh.name = state.newHole.name;
	        if ( mesh.design == 'w') {
	            mesh.position.y = 5;
	        } else {
	            mesh.position.y = arr_size[2]/2;
	        }
	        switch(mesh.wall) {
	            case 'front': 
	                mesh.position.z = state.length/2+state.depth/2;

	                break;
	            case 'back': 
	                mesh.position.z = -state.length/2-state.depth/2;

	                break;
	            case 'left': 
	                mesh.rotateY(Math.PI/2);
	                mesh.position.x = -state.width/2-state.depth/2;
	                break;
	            case 'right':
	                mesh.rotateY(Math.PI/2);
	                mesh.position.x = state.width/2+state.depth/2;
	                break;
	        }

	        if (arr_size[0]=='w') {
	            material_glass.color.set(state.windowColor);
	            material_glass.opacity = .3;
	            material_glass.needsUpdate = true;
	            mesh.add(mesh_glass);
	        } else if (arr_size[0]=='d') {
	            material_glass.color.set(state.doorColor);
	            material_glass.opacity = 1;
	            material_glass.needsUpdate = true;
	            mesh_glass.position.set(0,0,0.02);
	            mesh.add(mesh_glass);
	        }
	       

	        //state.holes[mesh.wall][mesh.uuid] = action.value;
	        var loader = new THREE.ObjectLoader();
	        loader.load(state.baseUrl + "/source/" +state.newHole.size+ ".json", function ( obj ) {
	            
	            var ft = 0.33*10;
	            obj.position.set(0,0,0.05);

	            if (arr_size[0]=='w' || arr_size[0]=='d') {
	                for (var _obj in obj.children) {
	                    var c_obj = obj.children[_obj];
	                    if (mesh.wall == 'front' ) c_obj.position.set(0,0,0.05);
	                    if (mesh.wall == 'back' ) c_obj.position.set(0,0,0.1);
	                    if (mesh.wall == 'left') c_obj.position.set(0,0,0.05);
	                    if (mesh.wall == 'right') c_obj.position.set(0,0,0.05);
	    
	                    c_obj.scale.set(ft,ft,ft );
	                    c_obj.material = new THREE.MeshStandardMaterial( { color: state.trimColor } );
	    
	                   mesh.add(c_obj);
	                }
	            } else if (arr_size[0]=='r') {
	                obj.position.set(0,0,0.1);
	                obj.scale.set(8*ft,8*ft,0.25*ft/2 );
	                obj.material = new THREE.MeshStandardMaterial( { color: state.trimColor } );
	                mesh.add(obj);
	                for (var _obj in obj.children) {
	                    if (obj.children[_obj].material.name == 'white' || obj.children[_obj].material.name == 'panels') {
	                        obj.children[_obj].material = new THREE.MeshStandardMaterial( { color: state.rollupColor, side: THREE.DoubleSide, name: 'white'} );
	                    } else if (obj.children[_obj].material.name == 'trim') {
	                        obj.children[_obj].material = new THREE.MeshStandardMaterial( { color: state.trimColor, side: THREE.DoubleSide  } );
	                        
	                    }
	                }

	            }
	           
	        
	        });
	        state.holeGroup.add(mesh);
	        
	        getHoles(state.newHole.callback);//Отправка списка пользователю

	        state.newHole = false;
	    }
	};

	var removeHole = function() {
	    if (state.removeHole !==false && typeof state.removeHole.id != 'undefined') {
	        for (var i=0; i<state.holeGroup.children.length; i++) {
	            if (state.holeGroup.children[i].uuid == state.removeHole.id) {
	                delete state.holes[state.holeGroup.children[i].wall][state.removeHole.id];
	                state.holeGroup.remove(state.holeGroup.children[i]);
	                i=state.holeGroup.children.length;
	            } 
	        }
	    }

	    getHoles(state.removeHole.callback);//Отправка списка пользователю

	    state.removeHole = false;
	};

	var updateColor = function() {
	    if (state.isChangeColor === true) {
	        for (var i=0; i<state.holeGroup.children.length; i++) {
	            if (state.holeGroup.children[i].name.indexOf('Roll-Up') !== -1 ) {
	                for (var _obj in state.holeGroup.children[i].children[0].children) {
	                    if (state.holeGroup.children[i].children[0].children[_obj].material.name == 'white') {
	                        state.holeGroup.children[i].children[0].children[_obj].material = new THREE.MeshStandardMaterial( { color: state.rollupColor, side: THREE.DoubleSide, name: 'white' } );
	                    }
	                }
	            } 
	        }
	    }
	    state.isChangeColor = false;
	};

	var buildOutsideAngel = function(scene) {
	    var material = new THREE.MeshBasicMaterial( { color: state.trimColor } );
	    //var material = new THREE.MeshNormalMaterial(  );
	    material.side = THREE.DoubleSide;

	    var loader = new THREE.ObjectLoader();
	    loader.load(state.baseUrl + "/source/outsideAngel.json", function ( obj ) {
	        var angelObj = obj.clone();
	        angelObj.position.set(0,0,0);
	        angelObj.material = material;
	       // angelObj.geometry.computeBoundingBox();
	       // console.log(angelObj.geometry.boundingBox); 

	        var HObj = 0.30480000376701355;
	        angelObj.scale.set(3,3,state.height/HObj);
	       
	        var frontRight = angelObj.clone();
	        frontRight.position.z = state.length/2;
	        frontRight.position.x = state.width/2;

	        var frontLeft = angelObj.clone();
	        frontLeft.position.z = state.length/2;
	        frontLeft.position.x = -state.width/2;
	        frontLeft.rotateZ(-Math.PI/2);
	        
	        var backRight = angelObj.clone();
	        backRight.position.z = -state.length/2;
	        backRight.position.x = state.width/2;
	        backRight.rotateZ(Math.PI/2);

	        var backLeft = angelObj.clone();
	        backLeft.position.z = -state.length/2;
	        backLeft.position.x = -state.width/2;
	        backLeft.rotateZ(Math.PI);
	        
	        scene.add(frontRight);
	        scene.add(frontLeft);

	        scene.add(backRight);
	        scene.add(backLeft);
	    });
	};

	var buildVent = function(scene,lengthRoof ) {
	    if (state.vent == 'standard' || state.vent == 'low') {
	        var material_vent = new THREE.MeshStandardMaterial( { color: state.ventColor } );
	        material_vent.side = THREE.DoubleSide;
	        
	        var loader = new THREE.ObjectLoader();
	        loader.load(state.baseUrl + "/source/vent4-" +state.vent+ ".json", function ( obj ) {
	            // obj.geometry.computeBoundingBox();
	            // console.log(obj.geometry.boundingBox); 
	            obj.material = material_vent;
	            obj.position.set(0,.31,0);
	            if ( state.spread === true) {
	                obj.scale.set(2,2,3.3/2);
	                var groupVent = new THREE.Group();
	                var count = Math.ceil((lengthRoof-1)/25);
	                var offset = lengthRoof/count;
	                for (var i=0; i<count; i++) {
	                    var newObj = obj.clone();
	                    newObj.position.z = offset*(i);
	                    groupVent.add(newObj);
	                }
	                groupVent.position.z = -offset*(count-1)/2;
	                scene.add(groupVent);
	            } else {
	                var lengthVent = 2.985793113708496*2;
	                obj.scale.set(2,2,lengthRoof/lengthVent-state.depth*2);
	                scene.add(obj);
	            }
	        });
	    }
	};

	var buildPeak = function(scene) {
	    var peakGroup = new THREE.Group();
	    peakGroup.position.y = state.height + state.pitch_calc + 0.01;
	  
	    var lengthRoof = state.length+state.depth*2+state.o_end;

	    var material = new THREE.MeshStandardMaterial( { color: state.roofColor } );
	    material.side = THREE.BackSide;

	    var material_box = new THREE.MeshBasicMaterial( { color: state.trimColor } );
	    material_box.side = THREE.DoubleSide;

	    var loader = new THREE.ObjectLoader();
	    loader.load(state.baseUrl + "/source/peakRoll.json", function ( obj ) {
	        obj.position.set(0,0,0);
	        obj.material = material;
	        var lengthRoll = 0.15240000188350677*2;
	        obj.scale.set(3,3,lengthRoof/lengthRoll);
	        peakGroup.add(obj);
	    });

	    loader.load(state.baseUrl + "/source/peakBox.json", function ( obj ) {
	        obj.position.set(0,0.2,lengthRoof/2);
	        obj.material = material_box;
	        obj.scale.set(3,3,3);
	       

	        var objBack = obj.clone();
	        objBack.position.set(0,0.2,-lengthRoof/2);
	        objBack.rotateY(Math.PI);
	     
	        peakGroup.add(obj);
	        peakGroup.add(objBack);
	    });

	    buildVent(peakGroup, lengthRoof);
	    scene.add(peakGroup);
	};

	var overhangTrim = function(scene,lengthRoof,_roofZ) {
	    var material = new THREE.MeshBasicMaterial( { color: state.trimColor } );
	    material.side = THREE.DoubleSide;

	    var otstup = 0.05;

	    var loader = new THREE.ObjectLoader();
	    loader.load(state.baseUrl + "/source/trim1.json", function ( obj ) {
	        var  lObj = 60.911766052246094;
	        var newObj = new THREE.Mesh(obj.geometry.clone(), material);
	        var _g = new THREE.Group();

	        var trimCentr = newObj.clone();
	        trimCentr.scale.set(3,3,(lengthRoof)/lObj);
	        trimCentr.position.z = -(lengthRoof)/2;
	        trimCentr.position.x = -_roofZ/2-0.2;
	        trimCentr.rotateY(Math.PI);

	        var trimFront = newObj.clone();
	        trimFront.scale.set(3,3,(_roofZ-otstup)/lObj);
	        trimFront.rotateY(-Math.PI/2);
	        trimFront.position.x = -(_roofZ-otstup)/2;
	        trimFront.position.z = (lengthRoof)/2+0.1;

	        var trimBack = newObj.clone();
	        trimBack.scale.set(3,3,(_roofZ-otstup)/lObj);
	        trimBack.rotateY(Math.PI/2);
	        trimBack.position.x = (_roofZ-otstup)/2;
	        trimBack.position.z = -(lengthRoof)/2-0.1;

	        loader.load(state.baseUrl + "/source/trimAngel.json", function ( obj ) {
	            var angelObj = new THREE.Mesh(obj.geometry.clone(), material);
	            //  angelObj.position.y = -0.1/2;

	            var angelFront = angelObj.clone();
	            angelFront.position.x = -(_roofZ)/2-0.1;
	            angelFront.position.z = (lengthRoof)/2+0.09;
	            angelFront.rotateY(-Math.PI/2);
	            _g.add(angelFront);
	            
	            
	            var angelBack = angelObj.clone();
	            angelBack.position.x = -(_roofZ)/2-0.2;
	            angelBack.position.z = -(lengthRoof)/2-0.05;
	            angelBack.rotateY(Math.PI);
	            _g.add(angelBack);
	        });
	        
	        _g.add(trimCentr);
	        _g.add(trimFront);
	        _g.add(trimBack);
	        _g.rotateY(Math.PI/2);

	        scene.add(_g);
	    });
	};

	var setGirt$1 = function(obj,z) {
	    var newObj = obj.clone();
	    newObj.position.z += z;
	    return newObj;
	};

	var overhangGirt = function(scene,_w,_l,pitch_calc,_h) {
	   // var material = new THREE.MeshBasicMaterial( { color: state.girtColor } );
	    var material = new THREE.MeshStandardMaterial( { color: state.girtColor } );
	    //var material = new THREE.MeshNormalMaterial(  );
	    material.side = THREE.DoubleSide;

	    var lengthGirt = 1.3121999502182007*2;
	    var depthGirt = 0.2-0.08;

	    var setGirtRoof = function(obj,x) {
	        var newObj = obj.clone();
	        newObj.position.x += x;
	        return newObj;
	    };

	    var _g = new THREE.Group();
	    var loader = new THREE.ObjectLoader();
	    loader.load(state.baseUrl + "/source/girt.json", function ( obj ) {
	        obj.position.set(0,0,0);
	        obj.material = material;
	        obj.scale.set(1,1,_w/lengthGirt);
	        
	        var count = Math.ceil((_l+state.depth/2-1)/4);  

	        var objRoof = obj.clone();
	        objRoof.rotateZ(Math.PI/2);
	        objRoof.position.x = (_l+state.depth/2) / 2;
	        objRoof.position.y = -depthGirt;

	        for (var i=1; i<count; i++) {
	            _g.add( setGirtRoof(objRoof, -i*4) );
	        }
	        _g.add( setGirtRoof( objRoof, -_l + depthGirt/2));

	       //Балки 
	       loader.load(state.baseUrl + "/source/beam.json", function ( obj ) {
	        obj.position.set(0,-0.32,0);

	        var lengthBeam = 3.4723;
	       

	        obj.scale.set(2,(_l-0.4)/lengthBeam,2);
	        obj.material = material;
	        //obj.material = new THREE.MeshNormalMaterial();

	        obj.rotateZ(Math.PI/2);
	        obj.rotateY(Math.PI/2);

	        var beamLeft = obj.clone();
	        beamLeft.position.x=-0.02*pitch_calc-0.2;

	        var beamLeftFront = beamLeft.clone();
	        beamLeftFront.position.z= _w/2-0.2;
	        _g.add(beamLeftFront);

	        var beamLeftBack = beamLeft.clone();
	        beamLeftBack.position.z= -_w/2+0.2;
	        _g.add(beamLeftBack);

	        var countGirt = Math.floor((_w-1)/20);

	        if (countGirt==1) {
	            _g.add(setGirt$1(beamLeft,0));
	        } else {
	            var centrGroup = new THREE.Group();
	            for (var i = 0; i<countGirt; i++) {
	                //var offset = 20*i - (_l/4+depthGirt*2*2*i);
	                centrGroup.add(setGirt$1(beamLeft,20*i));
	            }
	            _g.add(centrGroup);
	            centrGroup.position.z = -20*countGirt/2/2;
	        }

	    });
	    //--------------
	       _g.rotateY(Math.PI/2);
	       scene.add(_g);
	        
	    });

	};

	var loadGutter = function(height,callback,angel,offset_z,scene) {
	    if (state.gutter===true) {  
	        var material = new THREE.MeshBasicMaterial( { color: state.trimColor } );
	        material.side = THREE.DoubleSide;

	        var loader = new THREE.ObjectLoader();
	        loader.load(state.baseUrl + "/source/gutterProfile.json", function ( objProfile ) {
	            loader.load(state.baseUrl + "/source/gutterKickout.json", function ( objKickout ) {
	                var guttrtGroup = new THREE.Group();
	                objProfile.material = material;
	                objProfile.position.set(0,height,0);
	                objProfile.scale.set(3,(height-1)*3.3,3);

	                guttrtGroup.add(objProfile);

	                objKickout.material = material;
	                objKickout.position.set(0,1,-0.3);
	                objKickout.rotateY(-Math.PI/2);
	                objKickout.scale.set(3,3,3);
	                guttrtGroup.add(objKickout);
	                
	                if (typeof angel !='undefined') guttrtGroup.rotateY(angel);
	                if (typeof offset_z !='undefined') guttrtGroup.position.z = offset_z;
	                var retGroup = new THREE.Group();
	                retGroup.add(guttrtGroup);
	                if (typeof callback === 'function') callback(retGroup);
	                if (typeof scene === 'object' &&  scene.name == 'add') scene.add(retGroup);
	            });
	        });
	    }
	};

	var setGirt$2 = function(obj,z) {
	    var newObj = obj.clone();
	    newObj.position.z += z;
	    return newObj;
	};

	var overhangColon = function(scene,_w,_l,pitch_calc,_h,offsetColon, rotate_angel,pitch) {
	    //Colon build
	    //pitch_calc = pitch_calc*0.05*pitch;
	    var material = new THREE.MeshStandardMaterial( { color: state.girtColor } );
	    material.side = THREE.DoubleSide;

	    var countGirt = Math.floor((_w-1)/20);
	    var loader = new THREE.ObjectLoader();
	    var _g = new THREE.Group();

	    loader.load(state.baseUrl + "/source/colon.json", function ( obj ) {
	        // obj.geometry.computeBoundingBox();
	        // console.log(obj.geometry.boundingBox); 
	        var lengthColon = 0.3;

	        obj.position.set(0,0,0.15);
	        obj.material = material;
	        obj.scale.set(3,(_h - pitch_calc-0.2)/lengthColon,3);
	        obj.rotateZ(-rotate_angel);
	        obj.position.y = -0.2;
	        obj.position.x = -_l/2+0.4;
	            
	        var objLeft = obj.clone();
	            objLeft.position.z = -_w/2+0.3;
	            _g.add(objLeft);

	            loadGutter(_h - pitch_calc-0.5,function(obj) {
	                obj.position.y = -29/100;
	                obj.position.x = -0.2;
	                obj.scale.set(1/3,1/((_h - pitch_calc-0.2)/lengthColon),1/3);
	                objLeft.add(obj);
	            },-Math.PI/2);

	        var objRight = obj.clone();
	            objRight.position.z = _w/2;
	            _g.add(objRight);

	        loadGutter(_h - pitch_calc-0.5,function(obj) {
	            obj.position.y = -29/100;
	            obj.position.x = -0.2;
	            obj.scale.set(1/3,1/((_h - pitch_calc-0.2)/lengthColon),1/3);
	            objRight.add(obj);
	        },-Math.PI/2);


	        if (countGirt==1) {
	            var _girt = setGirt$2(obj,0);
	            _g.add(_girt);

	            loadGutter(_h - pitch_calc-0.5,function(obj) {
	               obj.position.y = -29/100;
	               obj.position.x = -0.2;
	               obj.scale.set(1/3,1/((_h - pitch_calc-0.2)/lengthColon),1/3);
	               _girt.add(obj);
	            },-Math.PI/2);

	        } else {
	            var centrGroup = new THREE.Group();
	            for (var i = 0; i<countGirt; i++) {
	                var _girt = setGirt$2(obj,20*i);
	                _girt.name = 'add';
	                centrGroup.add(_girt);

	                loadGutter(_h - pitch_calc-0.5,function(obj) {

	                    obj.position.y = -29/100;
	                    obj.position.x = -0.2;
	                    obj.scale.set(1/3,1/((_h - pitch_calc-0.2)/lengthColon),1/3);
	                    //_girt.add(obj);

	                 },-Math.PI/2,0, _girt);
	                
	            }
	            _g.add(centrGroup);
	            centrGroup.position.z = -20*countGirt/2/2;
	        }
	    });

	    _g.rotateY(Math.PI/2);
	    scene.add(_g);
	};

	var overhang = function (props,width,height) {
	    var retgroup = new THREE.Group();
	    var group = new THREE.Group();

	    var _w = width;
	    var _l = props.width;
	    var _h = height-props.drop;

	    var geometry = new THREE.BoxGeometry( _w - props.cut1 - props.cut2, state.depth, _l );
	    var roof =  new THREE.Mesh( geometry, materailWall(_w - props.cut1 - props.cut2, _l, -1, state.roofColor) );
	    roof.position.z = _l/2;
	   
	    //props.pitch = props.pitch/2
	    //var pitch_calc = _l/24*props.pitch;
	    var pitch_calc = _l/12*props.pitch;
	    
	    var skew = Math.sqrt(pitch_calc*pitch_calc + _l*_l);
	    
	    var offsetColon = Math.sqrt(skew*skew - pitch_calc*pitch_calc);

	    var sin = pitch_calc/skew;
	    var rotate_angel = Math.asin(sin)/Math.PI * 180 * Math.PI/180;
	    
	    var roof_group =new THREE.Group();
	        roof_group.rotateX(rotate_angel);
	        //roof_group.position.z = _l/2;
	        roof_group.position.y = _h-state.depth*2;
	        roof_group.add(roof);  

	        overhangTrim(roof,_w - props.cut1 - props.cut2, _l);
	        overhangGirt(roof,_w - props.cut1 - props.cut2, _l, pitch_calc);//Балки

	        overhangColon(roof, _w - props.cut1 - props.cut2, _l, pitch_calc, _h , offsetColon, rotate_angel,props.pitch);//колоны

	    group.add(roof_group);
	    group.position.x = -props.cut1/2+props.cut2/2;
	    retgroup.add(group);
	    return retgroup;
	};

	var buildOverhang = function(scene) {
	    if (state.overhang.front.enable===true) {
	        var obj = overhang(state.overhang.front, state.width, state.height);
	        obj.position.z = state.length/2;
	        scene.add(obj);
	    }  
	    if (state.overhang.back.enable===true) {
	        var obj = overhang(state.overhang.back, state.width, state.height);
	        obj.rotateY(Math.PI);
	        obj.position.z = -state.length/2;
	        scene.add(obj);
	    }

	    if (state.overhang.left.enable===true) {
	        var obj = overhang(state.overhang.left, state.length, state.height);
	        obj.rotateY(-Math.PI/2);
	        obj.position.x = -state.width/2;
	        scene.add(obj);
	    }

	    if (state.overhang.right.enable===true) {
	        var obj = overhang(state.overhang.right, state.length, state.height);
	        obj.rotateY(Math.PI/2);
	        obj.position.x = state.width/2;
	        scene.add(obj);
	    }

	};

	var buildArea = function(scene) {
	    var aWidth = state.width+state.padding;
	    var aLenght = state.length+state.padding;
	    var offsetX=0;
	    var offsetZ=0;

	    if (state.overhang.front.enable===true) {
	        aLenght += state.overhang.front.width;
	        offsetZ += state.overhang.front.width/2;
	    }  
	    if (state.overhang.back.enable===true) {
	        aLenght += state.overhang.back.width;
	        offsetZ -= state.overhang.back.width/2;
	    }

	    if (state.overhang.left.enable===true) {
	        aWidth += state.overhang.left.width;
	        offsetX -= state.overhang.left.width/2;
	    }

	    if (state.overhang.right.enable===true) {
	        aWidth += state.overhang.right.width;
	        offsetX += state.overhang.right.width/2;
	    }

	    var geometry = new THREE.BoxBufferGeometry( aWidth, aLenght, 0.1 );

	    
	    var material = new THREE.MeshStandardMaterial();
	    material.transparent = true;
	    material.opacity = 0;
	    var TextureLoader=new THREE.TextureLoader();
	    TextureLoader.load(state.baseUrl + "/source/areaBg.jpg",
	    function(texture) {
	        texture.wrapS=texture.wrapT=THREE.RepeatWrapping;
	        material.opacity = .9;
	        texture.anisotropy = 1;
	        texture.repeat.set(aWidth/2048*1000/8,aLenght/1536*1000/8);
	        material.map=texture;
	        material.needsUpdate=true;
	        texture.needsUpdate=true;
	    }
	);


	    var area = new THREE.Mesh( geometry, material );
	    area.position.x = offsetX;
	    area.position.z = offsetZ;
	    area.position.y=-0.05;
	    area.rotateX(-Math.PI/2);
	    scene.add( area );
	};

	var gutter = function (width,height) {
	    var material = new THREE.MeshBasicMaterial( { color: state.trimColor } );
	    material.side = THREE.DoubleSide;
	    var _g = new THREE.Group();

	    loadGutter(height,function(obj) {
	        var groupReturn = new THREE.Group();
	        var l_width = width-24;
	        var count = Math.ceil((l_width-1)/25);
	        var offset = l_width/count;

	        for (var i=0; i<count; i++) {
	            var newObj = obj.clone();
	            newObj.position.x = offset*(i);
	            groupReturn.add(newObj);
	        }
	        
	        var offsetGroup = -offset*(count-1)/2;
	        groupReturn.position.x = offsetGroup;
	    
	        var firstObj = obj.clone();
	        firstObj.position.x = -width/2-offsetGroup+2;
	        groupReturn.add(firstObj);
	        
	        var lastObj = obj.clone();
	        lastObj.position.x = width/2-offsetGroup-2;
	        groupReturn.add(lastObj);

	        _g.add(groupReturn);
	    });

	    return _g;
	};

	var buildGutter = function (scene) {
	    if (state.gutter===true) {  
	        if (state.overhang.left.enable!==true) {
	            var obj = gutter(state.length, state.height);
	            obj.rotateY(-Math.PI/2);
	            obj.position.x = -state.width/2-0.3;
	            scene.add(obj);
	        }
	    
	        if (state.overhang.right.enable!==true) {
	            var obj = gutter(state.length, state.height);
	            obj.rotateY(Math.PI/2);
	            obj.position.x = state.width/2+0.3;
	            scene.add(obj);
	        }
	    }
	};

	var build = function(callbck) {
	    var group=new THREE.Group();

	    addHole();
	    removeHole();
	    updateColor();//Обновить цвет ролет
	    buildWall(group);

	    buildOutsideAngel(group);
	    buildPeak(group);
	  
	    buildOverhang(group);
	    buildGutter(group);
	      
	    buildArea(group);

	    state.scene.remove(state.group);
	    state.scene.add(group);
	    state.group = group;

	    state.needsUpdate=false;
	    callbck();
	};

	var viewPreset = function(action, camera) {
	   
	    switch (action) {
	        case 'top': camera.position.set( 0, 80, 0 ); break;
	        case 'front': camera.position.set( 0, 5, -state.length/2-20 ); break;
	        case 'back': camera.position.set( 0, 5, state.length/2+20 ); break;
	        case 'left': camera.position.set( -state.width/2-30 , 5, 0 ); break;
	        case 'right': camera.position.set( state.width/2+30 , 5, 0 ); break;
	        case 'inside': camera.position.set( 0 , 5, state.length/2-5 ); break;

	        case 'front-left': camera.position.set( -state.width/2-30 , 5, -state.length/2-20 ); break;
	        case 'front-right': camera.position.set( state.width/2+30 , 5, -state.length/2-20 ); break;

	        case 'back-left': camera.position.set( -state.width/2-30 , 5, state.length/2+20 ); break;
	        case 'back-right': camera.position.set( state.width/2+30 , 5, state.length/2+20 ); break;

	        case 'zoomin': camera.position.multiplyScalar(1.2); break;
	        case 'zoomout': camera.position.multiplyScalar(0.8); break;
	    }
	    state.viewPreset=false;
	};

	var addAccessories = function() {
	    var accesGroup = new THREE.Group();

	    var loader = new THREE.ObjectLoader();
	    loader.load(state.baseUrl + "/source/car.json", function ( obj ) {
	        obj.position.set(35,0,10);
	        obj.isHole=false;
	        obj.scale.set(3.3 , 3.3, 3.3);
	        obj.visible = false;
	        obj.name = 'car';
	        accesGroup.add(obj);
	    });

	    loader.load(state.baseUrl + "/source/person.json", function ( obj ) {
	        obj.position.set(33,0,20);
	        obj.isHole=false;
	        obj.scale.set(3.3 , 3.3, 3.3);
	        obj.visible = false;
	        obj.name = 'person';
	        accesGroup.add(obj);
	    });
	    return accesGroup;
	};

	var updateAccessories = function() {
	    if (state.accessories !==false) {
	        for (var i=0; i<state.accessories.children.length; i++) {
	            if (typeof state.views[state.accessories.children[i].name] != 'undefined') {
	                if (state.views[state.accessories.children[i].name] === true) {
	                    state.accessories.children[i].visible = true;
	                } else {
	                    state.accessories.children[i].visible = false; 
	                }
	            }
	        }
	    }
	    state.isUpdateAccessories = false;
	};

	var camera,scene,renderer,controls;

	function init() {
		renderer = new THREE.WebGLRenderer({antialias:true, alpha: true });
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth, window.innerHeight);
		
	    camera = new THREE.PerspectiveCamera(65, window.innerWidth/window.innerHeight, 1, 10000);
		camera.position.y = state.height*1.1;
		camera.position.z = state.length*1.1;
		camera.position.x = state.width;
		//camera.lookAt(new THREE.Vector3(0, 500, 0));

	    scene = new THREE.Scene();
	    state.scene = scene;

	    scene.fog = new THREE.Fog(0xffffff,1,10000);
	    scene.fog.color.setHSL(0.6,0,1);

	   

		window.addEventListener('resize',onWindowResize,false);

		function onWindowResize() {
			camera.aspect = window.innerWidth/window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth,window.innerHeight);
	    }    
	    document.getElementById('canvas-fabric').appendChild(renderer.domElement);


	    threeLight(scene);

	    controls = new THREE.OrbitControls( camera, renderer.domElement );
	    controls.screenSpacePanning=true;

	    controls.target = new THREE.Vector3(0, 3, 0);
	    controls.enableDamping=true;
	    controls.dampingFactor=0.08;
	    controls.enableZoom=true;
	    controls.minPolarAngle=0;
	    controls.maxPolarAngle=Math.PI/2.1;
	    controls.minDistance = 5;
	    controls.maxDistance = 300;
	    controls.enablePan = false;
	    controls.rotateSpeed=1.5;

	    state.controls = controls;

	    state.accessories = addAccessories();
	    scene.add(state.accessories);

	    var holeGroup=new THREE.Group();
	    state.holeGroup = holeGroup;
	    
	    scene.add(holeGroup);

	    var dragControls = new THREE.DragControls( [holeGroup,state.accessories], camera, renderer.domElement );
	    dragControls.transformGroup=false;
	    dragControls.addEventListener( 'dragstart', function ( event ) {
	        controls.enabled=false;
	        if (event.object.isHole!==false) {
	            event.object.geometry.computeBoundingBox();
	            event.object.material.emissive.set( 0xaaaaaa );
	            event.object.material.opacity=0;
	        }
	    });
	    dragControls.addEventListener( 'dragend', function ( event ) {
	        controls.enabled=true;
	        if (event.object.isHole!==false) {
	            event.object.material.emissive.set( 0x000000 );
	            event.object.material.opacity=0;

	            var widthObj = (event.object.geometry.boundingBox.max.x-event.object.geometry.boundingBox.min.x) - 0.6;
	            var heightObj = (event.object.geometry.boundingBox.max.y-event.object.geometry.boundingBox.min.y) - 0.6;

	            var hole = new THREE.Path();
	            if (event.object.wall=='left' || event.object.wall=='right') {
	                hole.moveTo( -event.object.position.z-widthObj/2, event.object.position.y-heightObj/2 );
	                hole.lineTo( -event.object.position.z+widthObj/2, event.object.position.y-heightObj/2 );
	                hole.lineTo( -event.object.position.z+widthObj/2, event.object.position.y+heightObj/2 );
	                hole.lineTo( -event.object.position.z-widthObj/2, event.object.position.y+heightObj/2 );
	                hole.lineTo( -event.object.position.z-widthObj/2, event.object.position.y-heightObj/2 );
	            } else {
	                hole.moveTo( event.object.position.x-widthObj/2, event.object.position.y-heightObj/2 );
	                hole.lineTo( event.object.position.x+widthObj/2, event.object.position.y-heightObj/2 );
	                hole.lineTo( event.object.position.x+widthObj/2, event.object.position.y+heightObj/2 );
	                hole.lineTo( event.object.position.x-widthObj/2, event.object.position.y+heightObj/2 );
	                hole.lineTo( event.object.position.x-widthObj/2, event.object.position.y-heightObj/2 );
	            }
	            
	            hole.pid = event.object.uuid;
	            state.setState({ type:'hole', value:hole, obj:event.object, wall:event.object.wall, id:event.object.uuid });
	        }
	    });
	    dragControls.addEventListener ( 'drag', function( event ){
	        if (event.object.isHole!==false) {
	            var widthObj = (event.object.geometry.boundingBox.max.x-event.object.geometry.boundingBox.min.x)/2+2;
	            var heightObj = (event.object.geometry.boundingBox.max.y-event.object.geometry.boundingBox.min.y)/2-0.3;

	            if (event.object.wall=='front' || event.object.wall=='back') {
	                event.object.position.z = state.length/2+.1/2;
	                if (event.object.wall=='back') event.object.position.z = -state.length/2-.1/2;

	                if (event.object.position.x>state.width/2-widthObj) {
	                    event.object.position.x = state.width/2-widthObj;
	                } else if (event.object.position.x<-state.width/2+widthObj) {
	                    event.object.position.x = -state.width/2+widthObj;
	                }
	                
	                if (event.object.position.y>state.height-heightObj) {
	                    event.object.position.y = state.height-heightObj;
	                    
	                } else if (event.object.position.y<heightObj) {
	                    event.object.position.y = heightObj;
	                }
	            } else if (event.object.wall=='left' || event.object.wall=='right') {
	                event.object.position.x = -state.width/2-.1/2;
	                if (event.object.wall=='right') event.object.position.x = state.width/2+.1/2;

	                if (event.object.position.z>state.length/2-widthObj) {
	                    event.object.position.z = state.length/2-widthObj;
	                } else if (event.object.position.z<-state.length/2+widthObj) {
	                    event.object.position.z = -state.length/2+widthObj;
	                }
	        
	                if (event.object.position.y>state.height-heightObj) {
	                    event.object.position.y = state.height-heightObj;
	        
	                } else if (event.object.position.y<heightObj) {
	                    event.object.position.y = heightObj;
	                }
	            }
	        } else {
	            event.object.position.y = 0;
	        }
	    });
	    
	    //camera.lookAt(new THREE.Vector3(0, 50, 0));
	    animate();
	}
	function animate() {
	    if (state.isUpdateScene!==false) addLand(scene);
	    if (state.viewPreset!==false) viewPreset(state.viewPreset, camera);
	    if (state.isUpdateAccessories===true) updateAccessories();
	    if (state.needsUpdate===true) {

	        build(function() {
	            render();
	        });
	        //state.needsUpdate=false;
	    } else {
	        render();
	    }
	   
	}
	function render() {
	    controls.update();
	    renderer.render(scene,camera);
	    requestAnimationFrame(animate);
	}

	exports.init = init;
	exports.state = state;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
