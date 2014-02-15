if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = ( function () {
        return window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();
}

window.Tetris = window.Tetris || {};


document.getElementById("reset").addEventListener('click', function (event) {
    Tetris.camera.position.set(0, 0 , Tetris.boundingBoxConfig.depth/2);
    Tetris.camera.rotation.set(0, 0, 0);
});

Tetris.init = function () {
    // set the scene size
    var WIDTH = window.innerWidth,
        HEIGHT = window.innerHeight;

    // set some camera attributes
    var VIEW_ANGLE = 45,
        ASPECT = WIDTH / HEIGHT,
        NEAR = 0.1,
        FAR = 10000;

    // create a WebGL renderer, camera
    // and a scene
    Tetris.renderer = new THREE.WebGLRenderer();
    Tetris.camera = new THREE.PerspectiveCamera(VIEW_ANGLE,
        ASPECT,
        NEAR,
        FAR);
    Tetris.scene = new THREE.Scene();

        // the camera starts at 0,0,0 so pull it back
    controls = new THREE.OrbitControls( Tetris.camera );
    controls.addEventListener( 'change', Tetris.renderer.render(Tetris.scene,Tetris.camera) );

    // start the renderer
    Tetris.renderer.setSize(WIDTH, HEIGHT);

    // attach the render-supplied DOM element
    document.body.appendChild(Tetris.renderer.domElement);

    // configuration object
    var boundingBoxConfig = {
        width:360,
        height:360,
        depth:1200,
        splitX:6,
        splitY:6,
        splitZ:20
    };
    Tetris.camera.position.z = boundingBoxConfig.depth/2;
    Tetris.scene.add(Tetris.camera);
    Tetris.boundingBoxConfig = boundingBoxConfig;
    Tetris.blockSize = boundingBoxConfig.width / boundingBoxConfig.splitX;

    Tetris.Board.init(boundingBoxConfig.splitX, boundingBoxConfig.splitY, boundingBoxConfig.splitZ);

    var boundingBox = new THREE.Mesh(
        new THREE.CubeGeometry(boundingBoxConfig.width, boundingBoxConfig.height, boundingBoxConfig.depth, boundingBoxConfig.splitX, boundingBoxConfig.splitY, boundingBoxConfig.splitZ),
        new THREE.MeshBasicMaterial({vertexColors: THREE.FaceColors })
    );
    boundingBox.material.side=THREE.DoubleSide;
    //generate different colors
    var geom=boundingBox.geometry;
    for (var i = 0; i < geom.faces.length; i++) {
        var face = geom.faces[i];
        face.color.set( Math.random() * 0x0000ff );
    }
    Tetris.scene.add(boundingBox);
    Tetris.renderer.setClearColor( 0xffffff, 1);
    Tetris.renderer.render(Tetris.scene, Tetris.camera);

    Tetris.stats = new Stats();
    Tetris.stats.domElement.style.position = 'absolute';
    Tetris.stats.domElement.style.top = '10px';
    Tetris.stats.domElement.style.left = '10px';
    document.body.appendChild(Tetris.stats.domElement);

    document.getElementById("play_button").addEventListener('click', function (event) {
        event.preventDefault();
        Tetris.start();
        Tetris.setFacesPositions();
    });
};


Tetris.start = function () {

    document.getElementById("menu").style.display = "none";
    Tetris.pointsDOM = document.getElementById("points");
    Tetris.pointsDOM.style.display = "block";
    Tetris.holesDOM = document.getElementById("holes");
    Tetris.holesDOM.style.display = "block";
    Tetris.xtDOM = document.getElementById("xtrans");
    Tetris.xtDOM.style.display = "block";
    Tetris.ytDOM = document.getElementById("ytrans");
    Tetris.ytDOM.style.display = "block";
    Tetris.ztDOM = document.getElementById("ztrans");
    Tetris.ztDOM.style.display = "block";
    Tetris.holesW=document.getElementById("holesw").value;
    Tetris.erosionW=document.getElementById("erosionw").value;
    Tetris.wellcellW=document.getElementById("wellcellw").value;
    Tetris.linW=document.getElementById("linw").value;
    Tetris.colW=document.getElementById("colw").value;
    Tetris.heightW=document.getElementById("heightw").value;
    Tetris.endlinew=document.getElementById("endlinew").value;
    Tetris.Block.center();
    Tetris.Block.generate();
    setTimeout(Tetris.Block.move(0,0,-1),500);
    Tetris.animate();
    
    
};
//initializes the position of the faces
Tetris.setFacesPositions=function(){
    var faces = Tetris.scene.children[1].geometry.faces;
    for (var i = faces.length - 1; i >= 0; i--) {
        var face=faces[i];

        var x=face.centroid.x;
        var y=face.centroid.y;
        var z=face.centroid.z;
        if((x===-(Tetris.boundingBoxConfig.width/2))||(x===(Tetris.boundingBoxConfig.width/2))){x=-1;}
        else{x=Math.floor((x+(Tetris.boundingBoxConfig.width/2))/(Tetris.boundingBoxConfig.width/Tetris.boundingBoxConfig.splitX));}

        if((y===-(Tetris.boundingBoxConfig.height/2))||(y===(Tetris.boundingBoxConfig.height/2))){y=-1;}
        else{y=Math.floor((y+(Tetris.boundingBoxConfig.height/2))/(Tetris.boundingBoxConfig.height/Tetris.boundingBoxConfig.splitY));}
        
        if((z===-(Tetris.boundingBoxConfig.depth/2))||(z===(Tetris.boundingBoxConfig.depth/2))){z=-1;}
        else{z=Math.floor((z+(Tetris.boundingBoxConfig.depth/2))/(Tetris.boundingBoxConfig.depth/Tetris.boundingBoxConfig.splitZ));}
        face.facePosition=[x,y,z];
    };
}
Tetris.getFacesProjectionOf=function(x,y,z) {
    return Tetris.scene.children[1].geometry.faces.filter(function(obj){
        return (obj.facePosition[0]===x)&&(obj.facePosition[1]===y)||(obj.facePosition[1]===y)&&(obj.facePosition[2]===z)||(obj.facePosition[0]===x)&&(obj.facePosition[2]===z);
    });
}
//change color of a face of the bound
 Tetris.changeInWhite=function(face, color){
    var color=color||0xffffff;
    face.color.set(color);
    Tetris.scene.children[1].geometry.colorsNeedUpdate=true;
}

Tetris.gameStepTime = 1000;

Tetris.frameTime = 0; // ms
Tetris.cumulatedFrameTime = 0; // ms
Tetris._lastFrameTime = Date.now(); // timestamp

Tetris.gameOver = false;

Tetris.animate = function () {
    var time = Date.now();
    Tetris.frameTime = time - Tetris._lastFrameTime;
    Tetris._lastFrameTime = time;
    Tetris.cumulatedFrameTime += Tetris.frameTime;

    while (Tetris.cumulatedFrameTime > Tetris.gameStepTime) {
        Tetris.cumulatedFrameTime -= Tetris.gameStepTime;
    }

    Tetris.renderer.render(Tetris.scene, Tetris.camera);

    Tetris.stats.update();

    if (!Tetris.gameOver) window.requestAnimationFrame(Tetris.animate);
};


// nice test:
// var i = 0, j = 0, k = 0, interval = setInterval(function() {if(i==6) {i=0;j++;} if(j==6) {j=0;k++;} if(k==6) {clearInterval(interval); return;} Tetris.addStaticBlock(i,j,k); i++;},30)

Tetris.staticBlocks = [];
Tetris.zColors = [
    0x6666ff, 0x66ffff, 0xcc68EE, 0x666633, 0x66ff66, 0x9966ff, 0x00ff66, 0x66EE33, 0x003399, 0x330099, 0xFFA500, 0x99ff00, 0xee1289, 0x71C671, 0x00BFFF, 0x666633, 0x669966, 0x9966ff
];
Tetris.addStaticBlock = function (x, y, z) {
    if (Tetris.staticBlocks[x] === undefined) Tetris.staticBlocks[x] = [];
    if (Tetris.staticBlocks[x][y] === undefined) Tetris.staticBlocks[x][y] = [];

    var mesh = THREE.SceneUtils.createMultiMaterialObject(new THREE.CubeGeometry(Tetris.blockSize, Tetris.blockSize, Tetris.blockSize), [
        new THREE.MeshBasicMaterial({color:0x000000, shading:THREE.FlatShading, wireframe:true, transparent:true}),
        new THREE.MeshBasicMaterial({color:Tetris.zColors[z]})
    ]);

    mesh.position.x = (x - Tetris.boundingBoxConfig.splitX / 2) * Tetris.blockSize + Tetris.blockSize / 2;
    mesh.position.y = (y - Tetris.boundingBoxConfig.splitY / 2) * Tetris.blockSize + Tetris.blockSize / 2;
    mesh.position.z = (z - Tetris.boundingBoxConfig.splitZ / 2) * Tetris.blockSize + Tetris.blockSize / 2;

    Tetris.scene.add(mesh);
    Tetris.staticBlocks[x][y][z] = mesh;
};
Tetris.bestBlocks=[];
Tetris.addBestBlocks = function (x, y, z) {
    if (Tetris.bestBlocks[x] === undefined) Tetris.bestBlocks[x] = [];
    if (Tetris.bestBlocks[x][y] === undefined) Tetris.bestBlocks[x][y] = [];
    var mesh = THREE.SceneUtils.createMultiMaterialObject(new THREE.CubeGeometry(Tetris.blockSize, Tetris.blockSize, Tetris.blockSize), [
        new THREE.MeshBasicMaterial({color:0x000000, shading:THREE.FlatShading, wireframe:true, transparent:true}),
        new THREE.MeshBasicMaterial({color:0x00ff00, transparent:true, opacity:0.3})
    ]);

    mesh.position.x = (x - Tetris.boundingBoxConfig.splitX / 2) * Tetris.blockSize + Tetris.blockSize / 2;
    mesh.position.y = (y - Tetris.boundingBoxConfig.splitY / 2) * Tetris.blockSize + Tetris.blockSize / 2;
    mesh.position.z = (z - Tetris.boundingBoxConfig.splitZ / 2) * Tetris.blockSize + Tetris.blockSize / 2;

    Tetris.scene.add(mesh);
    Tetris.bestBlocks[x][y][z]=mesh;
};
Tetris.clearBest=function(){
    if(Tetris.bestBlocks!==undefined){
        for (var i = 0; i < Tetris.bestBlocks.length; i++) {
            if(Tetris.bestBlocks[i]!==undefined){
                for (var j = 0; j < Tetris.bestBlocks[i].length; j++) {
                    if(Tetris.bestBlocks[i][j]!==undefined){
                        for (var k = 0; k < Tetris.bestBlocks[i][j].length; k++) {
                            Tetris.scene.remove(Tetris.bestBlocks[i][j][k]);
                            Tetris.bestBlocks[i][j][k] = undefined;
                        }
                    }
                }
            }
        }
    }
};

Tetris.currentPoints = 0;
Tetris.addPoints = function (n) {
    Tetris.currentPoints += n;
    Tetris.pointsDOM.innerHTML = Tetris.currentPoints;
    };

window.addEventListener("load", Tetris.init);

window.addEventListener('keydown', function (event) {
    var key = event.which ? event.which : event.keyCode;

    switch (key) {
        //case

        case 38: // up (arrow)
            Tetris.Block.move(0, 1, 0);
            break;
        case 40: // down (arrow)
            Tetris.Block.move(0, -1, 0);
            break;
        case 37: // left(arrow)
            Tetris.Block.move(-1, 0, 0);
            break;
        case 39: // right (arrow)
            Tetris.Block.move(1, 0, 0);
            break;
        case 32: // space
            Tetris.Block.move(0, 0, -1);
            break;
        case 85: // space
            Tetris.Block.move(0, 0, 1);
            break;

        case 65: // up (A)
            Tetris.Block.rotate(90, 0, 0);
            break;
        case 81: // down (Q)
            Tetris.Block.rotate(-90, 0, 0);
            break;

        case 90: // left(Z)
            Tetris.Block.rotate(0, 90, 0);
            break;
        case 83: // right (S)
            Tetris.Block.rotate(0, -90, 0);
            break;

        case 69: // (E)
            Tetris.Block.rotate(0, 0, 90);
            break;
        case 68: // (D)
            Tetris.Block.rotate(0, 0, -90);
            break;
    }
}, false);