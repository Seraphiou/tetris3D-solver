    window.Tetris = window.Tetris || {};
Tetris.Board = {};

Tetris.Board.COLLISION = {NONE:0, WALL:1, GROUND:2};
Object.freeze(Tetris.Board.COLLISION);

Tetris.Board.FIELD = {EMPTY:0, ACTIVE:1, PETRIFIED:2};
Object.freeze(Tetris.Board.FIELD);

Tetris.Board.fields = [];
Tetris.Board.x;
Tetris.Board.y;
Tetris.Board.z;
Tetris.Board.init = function (_x, _y, _z) {
    Tetris.Board.x = _x;
    Tetris.Board.y = _y;
    Tetris.Board.z = _z;
    for (var x = 0; x < _x; x++) {
        Tetris.Board.fields[x] = [];
        for (var y = 0; y < _y; y++) {
            Tetris.Board.fields[x][y] = [];
            for (var z = 0; z < _z; z++) {
                Tetris.Board.fields[x][y][z] = Tetris.Board.FIELD.EMPTY;
            }
        }
    }
};
Tetris.Board.holesAmount = function (boardFields) {
    var holesAmount = 0;
    // if we not specify a parametre we take the current board
    boardFields = boardFields || copy(Tetris.Board.fields);
    for (var x = 0; x < boardFields.length; x++) {
        for (var y = 0; y < boardFields[0].length; y++) {
            for (var z = 0; z < boardFields[0][0].length; z++) {
                if(!Tetris.Board.fields[x][y][z]){
                    if(Tetris.Board.fields[x][y][z+1]===2){
                        holesAmount++;
                    }
                }
            }
        }
    }
    Tetris.holesDOM.innerHTML = "trous : "+holesAmount;
};
Tetris.Board.erosion = function (boardFields) {
    var amountLines=0;
    var amountNumberOfLastPieceDeleted=0;
    var expected = boardFields[0].length*boardFields.length;
    for (var z = 0; z < boardFields[0][0].length; z++) {
        sum=0;
        for (var y = 0; y < boardFields[0].length; y++) {
            for (var x = 0; x < boardFields.length; x++) {
                if(boardFields[x][y][z]){ sum++; }
            }
        }
        if(sum===expected){
            amountLines++;
            for (var y = 0; y < boardFields[0].length; y++) {
                for (var x = 0; x < boardFields.length; x++) {
                    if(boardFields[x][y][z]===1){ amountNumberOfLastPieceDeleted++; }
                }
            }
        }
    }
    return amountLines+'*'+amountNumberOfLastPieceDeleted+'='+amountNumberOfLastPieceDeleted*amountLines;

};
Tetris.Board.colTransition = function (boardFields) {
    var amountcolTransition=0;
    boardFields = boardFields || copy(Tetris.Board.fields);
    for (var x = 0; x < boardFields.length; x++) {
        for (var y = 0; y < boardFields[0].length; y++) {
            for (var z = 0; z < boardFields[0][0].length-1; z++) {
                if(Tetris.Board.fields[x][y][z]!=Tetris.Board.fields[x][y][z+1]){
                        amountcolTransition++;

                }
            }
        }
    }
    Tetris.ztDOM.innerHTML = "zt : "+amountcolTransition;
};

Tetris.Board.ylinTransition = function (boardFields) {
    var amountylTransition=0;
    boardFields = boardFields || copy(Tetris.Board.fields);
    for (var x = 0; x < boardFields.length; x++) {
        for (var z = 0; z < boardFields[0][0].length; z++) {
            for (var y = 0; y < boardFields[0].length-1; y++) {
                if(Tetris.Board.fields[x][y][z]!=Tetris.Board.fields[x][y+1][z]){
                        amountylTransition++;

                }
            }
        }
    }
    Tetris.ytDOM.innerHTML = "yt : "+amountylTransition;
};

Tetris.Board.xlinTransition = function (boardFields) {
    var amountxlTransition=0;
    boardFields = boardFields || copy(Tetris.Board.fields);
    for (var y = 0; y < boardFields[0].length; y++) {
        for (var z = 0; z < boardFields[0][0].length; z++) {
            for (var x = 0; x < boardFields.length-1; x++) {
                if(Tetris.Board.fields[x][y][z]!=Tetris.Board.fields[x+1][y][z]){
                        amountxlTransition++;

                }
            }
        }
    }
    Tetris.xtDOM.innerHTML = "xt : "+amountxlTransition;
};

Array.prototype.insert = function (index, item) {
        this.splice(index, 0, item);
};
intTable = function(alength,int) {
    return Array.apply(null, new Array(alength)).map(Number.prototype.valueOf,int);
}
strTable = function(alength,str) {
    return Array.apply(null, new Array(alength)).map(String.prototype.valueOf,str);
}

Tetris.Board.wellcell = function (boardFields) {
    var amountWellCell=0;
    var boardFields = boardFields || copy(Tetris.Board.fields);
    //fields with the edge
    var boardFieldsWithEdges = copy(boardFields);

    boardFieldsWithEdges.insert(0,[strTable(20,"*"),strTable(20,"*"),strTable(20,"*"),strTable(20,"*"),strTable(20,"*"),strTable(20,"*")]);//when x =0
    boardFieldsWithEdges.insert(boardFieldsWithEdges.length,[strTable(20,"*"),strTable(20,"*"),strTable(20,"*"),strTable(20,"*"),strTable(20,"*"),strTable(20,"*")]);//when x =8
    for (var x = 0; x < boardFieldsWithEdges.length; x++) {
        boardFieldsWithEdges[x].insert(0,strTable(20,"*"));
        boardFieldsWithEdges[x].insert(boardFieldsWithEdges[x].length,strTable(20,"*"));
    };
    for (var x = 0; x < boardFieldsWithEdges.length; x++) {
        for (var y = 0; y < boardFieldsWithEdges.length; y++) {
            boardFieldsWithEdges[x][y].insert(0,"*");
            boardFieldsWithEdges[x][y].insert(boardFieldsWithEdges[x][y].length,"*");
        };
    };

    for(var x=1; x<boardFieldsWithEdges.length-1;x++){
        for (var y = 1; y<boardFieldsWithEdges[0].length - 1; y++) {
            for (var z = 1; z<boardFieldsWithEdges[0][0].length-1; z++) {
                var n=0;
                while(boardFieldsWithEdges[x][y][z+n]===0&&boardFieldsWithEdges[x+1][y][z+n]&&boardFieldsWithEdges[x][y+1][z+n]&&boardFieldsWithEdges[x][y-1][z+n]&&boardFieldsWithEdges[x-1][y][z+n]){
                    n++;
                    amountWellCell++;

                }
            }
        }
    }
    return "nombre de puits "+amountWellCell;
};
Tetris.Board.rate = function (boardFields) {
    Tetris.Board.holesAmount();
    Tetris.Board.colTransition();
    Tetris.Board.xlinTransition();
    Tetris.Board.ylinTransition();
};
Tetris.Board.checkCompleted = function() {
        var x,y,z,x2,y2,z2, fields = Tetris.Board.fields;
        var rebuild = false;

        var sum, expected = fields[0].length*fields.length, bonus = 0;

        for(z = 0; z < fields[0][0].length; z++) {
                sum = 0;
                for(y = 0; y < fields[0].length; y++) {
                        for(x = 0; x < fields.length; x++) {
                                if(fields[x][y][z] === Tetris.Board.FIELD.PETRIFIED) sum++;
                        }
                }

                if(sum == expected) {
                        bonus += 1 + bonus; // 1, 3, 7, 15...

                        for(y2 = 0; y2 < fields[0].length; y2++) {
                                for(x2 = 0; x2 < fields.length; x2++) {
                                        for(z2 = z; z2 < fields[0][0].length-1; z2++) {
                                                Tetris.Board.fields[x2][y2][z2] = fields[x2][y2][z2+1];
                                        }
                                        Tetris.Board.fields[x2][y2][fields[0][0].length-1] = Tetris.Board.FIELD.EMPTY;
                                }
                        }
                        rebuild = true;
                        z--;
                }
        }
        if(bonus) {
                Tetris.addPoints(1000 * bonus);
        }
        if(rebuild) {
                for(var z = 0; z < fields[0][0].length-1; z++) {
                        for(var y = 0; y < fields[0].length; y++) {
                                for(var x = 0; x < fields.length; x++) {
                                        if(fields[x][y][z] === Tetris.Board.FIELD.PETRIFIED && !Tetris.staticBlocks[x][y][z]) {
                                                Tetris.addStaticBlock(x,y,z);
                                        }
                                        if(fields[x][y][z] == Tetris.Board.FIELD.EMPTY && Tetris.staticBlocks[x][y][z]) {
                                                Tetris.scene.removeObject(Tetris.staticBlocks[x][y][z]);
                                                Tetris.staticBlocks[x][y][z] = undefined;
                                        }
                                }
                        }
                }
        }
};
function copy(arr) {
    var new_arr = arr.slice(0);
    for(var i = new_arr.length; i--;)
        if(new_arr[i] instanceof Array)
            new_arr[i] = copy(new_arr[i]);
    return new_arr;
}
Tetris.Board.testCollision = function (ground_check) {
    var x, y, z, i;

    var fields = Tetris.Board.fields;
    var posx = Tetris.Block.position.x, posy = Tetris.Block.position.y, posz = Tetris.Block.position.z, shape = Tetris.Block.shape;

    for (i = 0; i < shape.length; i++) {
        if ((shape[i].x + posx) < 0 || (shape[i].y + posy) < 0 || (shape[i].x + posx) >= fields.length || (shape[i].y + posy) >= fields[0].length) {
            return Tetris.Board.COLLISION.WALL;
        }

        if (fields[shape[i].x + posx][shape[i].y + posy][shape[i].z + posz - 1] === Tetris.Board.FIELD.PETRIFIED) {
            return ground_check ? Tetris.Board.COLLISION.GROUND : Tetris.Board.COLLISION.WALL;
        }

        if((shape[i].z + posz) <= 0) {
            return Tetris.Board.COLLISION.GROUND;
        }
    }
};
