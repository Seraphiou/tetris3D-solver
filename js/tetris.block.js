window.Tetris = window.Tetris || {};

Tetris.Utils = {};

Tetris.beforeWhiteFaces=[];
// cloneVector clone a vector
Tetris.Utils.cloneVector = function (v) {
    return {x:v.x, y:v.y,  z:v.z};
};

// roundVector round the coodinates of the vector
Tetris.Utils.roundVector = function(v) {
    v.x = Math.round(v.x);
    v.y = Math.round(v.y);
    v.z = Math.round(v.z);
};
Tetris.Utils.equalsVector = function(u,v) {
    return ((u.x==v.x)&&(u.y==v.y)&&(u.z==v.z));
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
    ],
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
    ]
];
//shapes will be centered and inject in this array
Tetris.Block.shapes = [];

Tetris.Block.position = {};
Tetris.Block.generateBlockShapes = function() {

    Tetris.Block.Uncenteredshapes=[];

    for (var i = 0; i < 10; i++) {
        var tempShape=[];
        var a={x:0, y:0, z:0};
        tempShape.push(Tetris.Utils.cloneVector(a));
        for (var j = 0; j < 4; j++) {
            var b=Math.floor((Math.random()*4));
            switch(b){
                case 0:
                    break;
                case 1:
                    a.x+=1;
                    tempShape.push(Tetris.Utils.cloneVector(a));
                    break;
                case 2:
                    a.y+=1;
                    tempShape.push(Tetris.Utils.cloneVector(a));
                    break;
                case 3:
                    a.z+=1;
                    tempShape.push(Tetris.Utils.cloneVector(a));
                    break;
            }
            
        };
        Tetris.Block.Uncenteredshapes.push(tempShape);
    };
}
//center all shapes
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
//center a shape
Tetris.centerShape = function(shape){
    var tablex=[];
    var tabley=[];
    var tablez=[];
    for (i = 0; i < shape.length; i++) {
        tablex[i]=shape[i].x;
        tabley[i]=shape[i].y;
        tablez[i]=shape[i].z;
    }
    var xmin=Math.min.apply(null,tablex);
    var ymin=Math.min.apply(null,tabley);
    var zmin=Math.min.apply(null,tablez);
    for (i = 0; i < shape.length; i++) {
        shape[i].x=shape[i].x-xmin;
        shape[i].y=shape[i].y-ymin;
        shape[i].z=shape[i].z-zmin;
    }
};
function copyShape(shapei) {
    var shape=[];
    for (var i = 0; i <shapei.length; i++ ) {
        shape[i]=Tetris.Utils.cloneVector(shapei[i]);
    };
    return shape;
};
//generate a block
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
            tmpGeometry.position.z = Tetris.blockSize * Tetris.Block.shape[i].z;
            THREE.GeometryUtils.merge(geometry, tmpGeometry);//merges the differents cube with theyr positions to get the final geometry
    } 

    //we create a multimaterial object to see the lines
    Tetris.Block.mesh = THREE.SceneUtils.createMultiMaterialObject(geometry, [
        new THREE.MeshBasicMaterial({color:0xaaaaaa,vertexColors: THREE.FaceColors , shading:THREE.FlatShading, wireframe:true}),
        new THREE.MeshBasicMaterial({color:0xff0000,vertexColors: THREE.FaceColors , shading:THREE.FlatShading, transparent: true, opacity: 0.5 })
    ]);

    // initial position
    Tetris.Block.position = {x:Math.floor(Tetris.boundingBoxConfig.splitX / 2) - 1, y:Math.floor(Tetris.boundingBoxConfig.splitY / 2) - 1, z:Math.floor(Tetris.boundingBoxConfig.splitZ *3/ 4)-1};
    //if there is a collision game is over
    if (Tetris.Board.testCollision(true) === Tetris.Board.COLLISION.GROUND) {
        Tetris.gameOver = true;
        Tetris.pointsDOM.innerHTML = "GAME OVER";
    }

    Tetris.Block.mesh.position.x =(Tetris.Block.position.x - Tetris.boundingBoxConfig.splitX / 2) * Tetris.blockSize + Tetris.blockSize/2;
    Tetris.Block.mesh.position.y =(Tetris.Block.position.y - Tetris.boundingBoxConfig.splitY / 2) * Tetris.blockSize + Tetris.blockSize/2;
    Tetris.Block.mesh.position.z =(Tetris.Block.position.z - Tetris.boundingBoxConfig.splitZ / 2) * Tetris.blockSize - Tetris.blockSize/2;

    Tetris.Block.mesh.rotationMatrix=new THREE.Matrix4();
    Tetris.Block.mesh.overdraw = true;
    Tetris.scene.add(Tetris.Block.mesh);
};


Tetris.Block.rotate = function (x, y, z) {
    var axis = new THREE.Vector3(x,y,z);
    rotateAroundWorldAxis(Tetris.Block.mesh, axis, Math.PI/2);
    var matrix=new THREE.Matrix4().makeRotationAxis( axis, Math.PI/2 );
    for (var i = 0; i < Tetris.Block.shape.length; i++) {
        var v=Tetris.Utils.cloneVector(Tetris.Block.shape[i])
        var lastV=new THREE.Vector3(v.x,v.y,v.z);
        var newV=lastV.applyMatrix4(matrix);
        Tetris.Block.shape[i]={ x:newV.x , y:newV.y , z:newV.z }
        Tetris.Utils.roundVector(Tetris.Block.shape[i]);
    }

    if (Tetris.Board.testCollision(false) === Tetris.Board.COLLISION.WALL) {
        Tetris.Block.rotate(-x, -y, -z); // laziness FTW
    }

    Tetris.shadow();
};
Tetris.rotateShape = function (shape, x, y, z, ntimes) {
    var axis = new THREE.Vector3(x,y,z);
    var matrix=new THREE.Matrix4().makeRotationAxis( axis, ntimes*Math.PI/2 );
    var shapeF=[];
    for (var i = 0; i < shape.length; i++) {
        var v=Tetris.Utils.cloneVector(shape[i]);
        var lastV=new THREE.Vector3(v.x,v.y,v.z);
        var newV=lastV.applyMatrix4(matrix);
        shapeF[i]={ x:newV.x , y:newV.y , z:newV.z };
        Tetris.Utils.roundVector(shapeF[i]);
    }
    return shapeF;
};

function rotateAroundWorldAxis(object, axis, radians) {
    rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
    rotWorldMatrix.multiply(object.matrix);
    object.matrix = rotWorldMatrix;
    object.rotation.setFromRotationMatrix(object.matrix);
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
    Tetris.shadow();
};

Tetris.copyShapeArray=function(shapeArray){
    var shapeArrayNew=[];
    for (var i = 0; i < shapeArray.length; i++) {
        shapeArrayNew[i]=copyShape(shapeArray[i]);

    };
    return shapeArrayNew;
}
Tetris.Block.getBestPositonBlocks=function (){
    var array=[];
    array=Tetris.copyShapeArray(this.getAllRotations());
    var bestRated="nothing";
    var shape;
    var x=0,y=0,z=0;
    var rate;
    for (var i = 0; i < array.length; i++) {
        for (var j = 0; j < Tetris.Board.fields.length; j++) {
            for (var k = 0; k < Tetris.Board.fields[j].length; k++) {
                for (var l = 0; l < Tetris.Board.fields[j][k].length; l++) {
                    if(Tetris.Board.isPositionPossible(array[i],j,k,l)){
                        rate=Tetris.Block.rateCase(array[i],j,k,l);
                        if(bestRated==="nothing"||rate>bestRated){
                            x=j;
                            y=k;
                            z=l;
                            shape=copyShape(array[i]);
                            bestRated=rate;
                        }
                    }
                }
            }
        }
        
    }
    for (var i = 0; i < shape.length; i++) {
        Tetris.addBestBlocks(shape[i].x+x,shape[i].y+y,shape[i].z+z);
    }
    return "x = "+x+" y = "+y+" z = "+z;
};
Tetris.Block.rateCase = function (shape,x,y,z){
    
    var boardFields = copy(Tetris.Board.fields);
    for (var i = 0; i < shape.length; i++) {
        boardFields[shape[i].x+x][shape[i].y+y][shape[i].z+z]=Tetris.Board.FIELD.ACTIVE;
    };
    return (-Tetris.holesW)*Tetris.Board.holesAmount(boardFields)+Tetris.erosionW*Tetris.Board.erosion(boardFields)-Tetris.wellcellW*Tetris.Board.wellcell(boardFields)-Tetris.linW*Math.max(Tetris.Board.xlinTransition(boardFields),Tetris.Board.ylinTransition(boardFields))-Tetris.colW*Tetris.Board.colTransition(boardFields)-Tetris.heightW*Tetris.Board.arriveHeight(boardFields)-Tetris.endlinew*Tetris.Board.numberHolesMostCompleted(boardFields);
    
};

Tetris.shadow= function(){
    var positions=[];
    var beforeWhiteFaces=[];
    beforeWhiteFaces=Tetris.beforeWhiteFaces;
    Tetris.beforeWhiteFaces=[];
    var faces=[];

    positions=Tetris.Block.getPositions();
    for (var i = beforeWhiteFaces.length - 1; i >= 0; i--) {
        if(beforeWhiteFaces[i].hz!==undefined){
            beforeWhiteFaces[i].color.set(Tetris.zColors[beforeWhiteFaces[i].hz]);
        }else{
            beforeWhiteFaces[i].color.set(0xffffff );
        }
    };
    for (var i = positions.length - 1; i >= 0; i--) {
        faces=Tetris.getFacesProjectionOf(positions[i][0],positions[i][1],positions[i][2]);

        for (var j = faces.length - 1; j >= 0; j--) {
            Tetris.changeInWhite(faces[j],0x888);
            Tetris.beforeWhiteFaces.push(faces[j]);
        };
    };
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

Tetris.equalsShape = function(shape1,shape2){
    var s1=copyShape(shape1);
    var s2=copyShape(shape2);
    Tetris.centerShape(s1);
    Tetris.centerShape(s2);

    for (var i = s1.length - 1; i >= 0; i--) {
        for (var j= s2.length - 1; j >= 0; j--) {
            if(Tetris.Utils.equalsVector(s1[i],s2[j])){
                s1[i]=false;
                s2[j]=false;
            }
        };
        
    };
    var s=false;
    for (var i = 0; i < s1.length; i++) {
        s=s||s1[i]||s2[i];
    };
    return !s;
}

Tetris.pushIfNotContains=function(array, shape){
    var contains=false;
    for (var i = 0; i < array.length; i++) {
        if(Tetris.equalsShape(shape,array[i])){
            contains=true;
        }
    };
    if(!contains){
        array.push(shape);
    };
};

/**
* get an array of all kinds of rotation that are possible for the shape
*/
Tetris.Block.getAllRotations = function (shapei){
    var rotations=[];
    var initshape=shapei||copyShape(this.shape);
    rotations.push(initshape);
    for (var i = 4 - 1; i >= 0; i--) {
        for (var j = 4 - 1; j >= 0; j--) {
            Tetris.pushIfNotContains(rotations,Tetris.rotateShape(Tetris.rotateShape(initshape,1,0,0,i),0,0,1,j));
            if(i==1||i==3){
                Tetris.pushIfNotContains(rotations,Tetris.rotateShape(Tetris.rotateShape(initshape,0,1,0,i),0,0,1,j));
            }
        };
        
    };
    for (var i = 0; i < rotations.length; i++) {
        Tetris.centerShape(rotations[i]);
    };
    return rotations;
};

/*
* get the positions of the active cube
*/

Tetris.Block.getPositions= function(){
    var shape = Tetris.Block.shape;
    var tab=[];
    for (var i = 0; i < shape.length; i++) {
        tab[i]=[Tetris.Block.position.x + shape[i].x, Tetris.Block.position.y + shape[i].y, Tetris.Block.position.z-1 + shape[i].z]
    }
    return tab;
};
Tetris.Block.hitBottom = function () {
    Tetris.Block.petrify();
    Tetris.scene.remove(Tetris.Block.mesh);
    Tetris.Block.generate();
    Tetris.clearBest();
    Tetris.Block.getBestPositonBlocks();
    Tetris.Board.rate();

    Tetris.shadow();
};
