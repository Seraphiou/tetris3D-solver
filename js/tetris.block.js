window.Tetris = window.Tetris || {};

Tetris.Utils = {};

// cloneVector clone a vector
Tetris.Utils.cloneVector = function (v) {
    return {x:v.x, y:v.y, z:v.z};
};
// roundVector round the coodinates of the vector
Tetris.Utils.roundVector = function(v) {
    v.x = Math.round(v.x);
    v.y = Math.round(v.y);
    v.z = Math.round(v.z);
};
Tetris.Utils.roundMatrix4 = function(m) {
    m.n11 = Math.round(m.n11);
    m.n12 = Math.round(m.n12);
    m.n13 = Math.round(m.n13);
    m.n14 = Math.round(m.n14);
    m.n21 = Math.round(m.n21);
    m.n22 = Math.round(m.n22);
    m.n23 = Math.round(m.n23);
    m.n24 = Math.round(m.n24);
    m.n31 = Math.round(m.n31);
    m.n32 = Math.round(m.n32);
    m.n33 = Math.round(m.n33);
    m.n34 = Math.round(m.n34);
    m.n41 = Math.round(m.n41);
    m.n42 = Math.round(m.n42);
    m.n43 = Math.round(m.n43);
    m.n44 = Math.round(m.n44);
};

Tetris.Block = {};
//add the shapes here
Tetris.Block.Uncenteredshapes = [
    [
        {x:0, y:-1, z:0},//barre
        {x:0, y:0, z:0},
        {x:0, y:1, z:0},
        {x:0, y:2, z:0}
    ]/*,
    [
        {x:0, y:0, z:0},//T
        {x:0, y:1, z:0},
        {x:0, y:2, z:0},
        {x:1, y:1, z:0}
    ],
    [
        {x:0, y:0, z:0},//carre
        {x:0, y:1, z:0},
        {x:1, y:0, z:0},
        {x:1, y:1, z:0}
    ],
    [
        {x:0, y:0, z:0},//L
        {x:0, y:1, z:0},
        {x:0, y:2, z:0},
        {x:1, y:2, z:0}
    ],
    [
        {x:0, y:0, z:0},//S
        {x:0, y:1, z:0},
        {x:1, y:1, z:0},
        {x:1, y:2, z:0}
    ]*/
];
//shapes will be centered and inject in this array
Tetris.Block.shapes = [];

Tetris.Block.position = {};
Tetris.Block.center = function () {
    for(j=0; j<Tetris.Block.Uncenteredshapes.length;j++) {
        var shape = Tetris.Block.Uncenteredshapes[j];
        //the block must be centered to have good rotations
        var tablex=[];
        var tabley=[];
        for (i = 0; i < shape.length; i++) {
            tablex[i]=shape[i].x;
            tabley[i]=shape[i].y;
        }
        var xaverage=Math.floor((Math.max.apply(null,tablex)-Math.min.apply(null,tablex))/2);
        var yaverage=Math.floor((Math.max.apply(null,tabley)-Math.min.apply(null,tabley))/2);
        for (i = 0; i < shape.length; i++) {
            shape[i].x=shape[i].x-xaverage;
            shape[i].y=shape[i].y-yaverage;
        }
        Tetris.Block.shapes[j]=shape;
    }
};

Tetris.Block.generate = function () {
    var geometry, tmpGeometry, i;
    //choose a type
    var type = Math.floor(Math.random() * (Tetris.Block.shapes.length));
    this.blockType = type;

    Tetris.Block.shape = [];
    //we clone the shape of the chosen type in a new object
    for (i = 0; i < Tetris.Block.shapes[type].length; i++) {
        Tetris.Block.shape[i] = Tetris.Utils.cloneVector(Tetris.Block.shapes[type][i]);
    }


    //generate a cube in the good dimensions
    geometry = new THREE.CubeGeometry(0, 0, 0);
    for (i = 0; i < Tetris.Block.shape.length; i++) {
            tmpGeometry = new THREE.Mesh(new THREE.CubeGeometry(Tetris.blockSize, Tetris.blockSize, Tetris.blockSize));
            tmpGeometry.position.x = Tetris.blockSize * Tetris.Block.shape[i].x;//
            tmpGeometry.position.y = Tetris.blockSize * Tetris.Block.shape[i].y;
            THREE.GeometryUtils.merge(geometry, tmpGeometry);//merges the differents cube with theyr positions to get the final geometry
    }

    //we create a multimaterial object to see the lines
    Tetris.Block.mesh = THREE.SceneUtils.createMultiMaterialObject(geometry, [
        new THREE.MeshBasicMaterial({color:0x00ffff, shading:THREE.FlatShading, wireframe:true, transparent:true}),
        new THREE.MeshBasicMaterial({color:0x000000})
    ]);

    // initial position
    Tetris.Block.position = {x:Math.floor(Tetris.boundingBoxConfig.splitX / 2) - 1, y:Math.floor(Tetris.boundingBoxConfig.splitY / 2) - 1, z:15};
    //if there is a collision game is over
    if (Tetris.Board.testCollision(true) === Tetris.Board.COLLISION.GROUND) {
        Tetris.gameOver = true;
        Tetris.pointsDOM.innerHTML = "GAME OVER";
    }

    Tetris.Block.mesh.position.x = (Tetris.Block.position.x - Tetris.boundingBoxConfig.splitX / 2) * Tetris.blockSize / 2;
    Tetris.Block.mesh.position.y = (Tetris.Block.position.y - Tetris.boundingBoxConfig.splitY / 2) * Tetris.blockSize / 2;
    Tetris.Block.mesh.position.z = (Tetris.Block.position.z - Tetris.boundingBoxConfig.splitZ / 2) * Tetris.blockSize + Tetris.blockSize / 2;

    Tetris.Block.mesh.rotationMatrix=new THREE.Matrix4();
    Tetris.Block.mesh.rotationMatrix.setRotationFromEuler({x:0,y:0,z:0});
    Tetris.Block.mesh.overdraw = true;

    Tetris.scene.add(Tetris.Block.mesh);
};


Tetris.Block.rotate = function (x, y, z) {
    var rotation={x:(x*Math.PI)/180,y:(y*Math.PI)/180,z:(z*Math.PI)/180};
    // we create the rotation matrix
    var rotationMatrixtmp = new THREE.Matrix4();
    rotationMatrixtmp.setRotationFromEuler(rotation);
    Tetris.Utils.roundMatrix4(rotationMatrixtmp);
    //we store the total rotation matrix for the current state of the Block rotation
    Tetris.Block.mesh.rotationMatrix=Tetris.Block.mesh.rotationMatrix.multiply(Tetris.Block.mesh.rotationMatrix,rotationMatrixtmp);

    //rotationMatrix is the global rotation matrix
    var rotationMatrix=Tetris.Block.mesh.rotationMatrix;

    for (var i = 0; i < Tetris.Block.shape.length; i++) {
        Tetris.Block.shape[i] = Tetris.Block.mesh.rotationMatrix.multiplyVector3(
            Tetris.Utils.cloneVector(Tetris.Block.shapes[this.blockType][i])
        );
        Tetris.Utils.roundVector(Tetris.Block.shape[i]);
    }

    if (Tetris.Board.testCollision(false) === Tetris.Board.COLLISION.WALL) {
        Tetris.Block.rotate(-x, -y, -z);
    }
};

Tetris.Block.move = function (x, y, z) {
    Tetris.Block.mesh.position.x += x * Tetris.blockSize;
    Tetris.Block.position.x += x;

    Tetris.Block.mesh.position.y += y * Tetris.blockSize;
    Tetris.Block.position.y += y;

    Tetris.Block.mesh.position.z += z * Tetris.blockSize;
    Tetris.Block.position.z += z;

    var collision = Tetris.Board.testCollision((z != 0));

    if (collision === Tetris.Board.COLLISION.WALL) {
        Tetris.Block.move(-x, -y, 0); // laziness FTW
    }
    if (collision === Tetris.Board.COLLISION.GROUND) {
        Tetris.Block.hitBottom();
        Tetris.Board.checkCompleted();
    }
};

/**
 * call when hits the floor and should be transformed to static blocks
 */
Tetris.Block.petrify = function () {
    var shape = Tetris.Block.shape;
    for (var i = 0; i < shape.length; i++) {
        Tetris.addStaticBlock(Tetris.Block.position.x + shape[i].x, Tetris.Block.position.y + shape[i].y, Tetris.Block.position.z + shape[i].z);
        Tetris.Board.fields[Tetris.Block.position.x + shape[i].x][Tetris.Block.position.y + shape[i].y][Tetris.Block.position.z + shape[i].z] = Tetris.Board.FIELD.PETRIFIED;
    }
};

Tetris.Block.hitBottom = function () {
    Tetris.Block.petrify();
    Tetris.scene.removeObject(Tetris.Block.mesh);
    Tetris.Block.generate();
    Tetris.Board.rate();
}
