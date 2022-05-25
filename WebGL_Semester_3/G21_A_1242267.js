
/*****
/*
/* Beispielprogramm für die Lehrveranstaltung Computergraphik
/* HS RheinMain
/* Prof. Dr. Ralf Dörner
/*
/* basierend auf einem Programm von Edward Angel
/* http://www.cs.unm.edu/~angel/WebGL/
/*
/****/


/***   Deklaration globaler Variablen */

// Referenz auf Bereich, in den gezeichnet wird
var canvas;

// Referenz auf WebGL-Kontext, über die OpenGL Befehle ausgeführt werden
var gl;

// Referenz auf die Shaderprogramme
var program;

// Matrix für die Umrechnung Objektkoordinaten -> Weltkoordinaten
var model;

// Matrix für die Umrechnung Weltkoordinaten -> Kamerakoordinaten
var view; 

// Matrix für die Umrechnung Kamerakoordinaten -> Clippingkoordinaten
var projection;

// Matrix für die Umrechnung von Normalen aus Objektkoordinaten -> Viewkoordinaten
var normalMat;

// Flag, das angibt, ob eine Beleuchtungsrechnung durchgeführt wird (true)
// oder ob einfach die übergebenen Eckpunktfarben übernommen werden (false)
var lighting = true;

// Anzahl der Eckpunkte der zu zeichenden Objekte 
var numVertices  = 0;

// Array, in dem die Koordinaten der Eckpunkte der zu zeichnenden Objekte eingetragen werden
var vertices = [];

// Array, in dem die Farben der Eckpunkte der zu zeichnenden Objekte eingetragen werden
var vertices = [];

// Array, in dem die Eckpunktkoordinaten der zu zeichnenden Objekte eingetragen werden
var pointsArray = [];

// Array, in dem die Normale je Eckpunkt der zu zeichnenden Objekte eingetragen werden
var normalsArray = [];

// Array, in dem die Farbwerte je Eckpunkt der zu zeichnenden Objekte eingetragen werden
var colorsArray = [];

// Variablen für die Drehung des Würfels
var axis = 0;
var theta =[0, 0, 0];
var zDegree = 0.3; 

// Variablen, um die Anzahl der Frames pro Sekunde zu ermitteln
var then = Date.now() / 1000;
var elapsedTime = 0;
var counter = 0;
var fpsDegreeCounter = 0;

// OpenGL-Speicherobjekt f�r Farben
var cBuffer;

// OpenGL-Speicherobjekt f�r Vertices
var vBuffer;

// OpenGL-Speicherobjekt f�r Normalen
var nBuffer;

// Flag für die Animation 
var is_animated = false;

// Ambient-Variable
var globalAmbient = 0.0;

// Shininess-Variable
var shininess = 0.0;

// Variablen für die Texturierung
var texCoordsArray = [];
var colors;
var texCoord;
var isTextured = true;

// Variablen für den Cartoon-Shader
var cartoonOn = false;
var cartoonBoolInd = 0;
var cartoonThresh_1 = 50.0;

var cartoonThresh_2;

// Variablen für die Teekanne
var teapotNormalData = [];
var teapotVertexData = [];
var teapotIndexData = [];
var teapotVertexIndexBuffer;

//Push/Pop Methoden für die Schachtelung von Objekten wie in einem Szenengraphen (nicht verwendet)
var modelStack = [];
var normalStack = [];

function pushMatrix(stack, matrix){
    var m2 = matrix;
    stack.push(m2);
}

function popMatrix(stack){
    return stack.pop();

}

// Funkion, um Daten aus JSON auszulesen
function loadTeapot() {
    var request = new XMLHttpRequest();

    request.open("GET", "Teapot.json");

    request.overrideMimeType("application/json");

    request.onreadystatechange = function () {

        if (request.readyState == 4) {

            var teapotData = JSON.parse(request.responseText);

            var i = 0;

            while (i < teapotData.vertexNormals.length) {
                teapotNormalData.push(teapotData.vertexNormals[i]);
                i++;
            }

            i = 0;

            while (i < teapotData.vertexPositions.length) {
                teapotVertexData.push(teapotData.vertexPositions[i]);
                i++;
            }

            i = 0;

            while (i < teapotData.indices.length) {
                teapotIndexData.push(teapotData.indices[i]);
                i++;
            }
        }
    }
    request.send();
}



// ***** TEXTUREN *****

// Textur erstellen
function handleTextureLoaded(image) {
    texture = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}



/*** Hilfsfunktionen zum Zeichnen von Objekten */
//
// Funktion, die ein Quadrat in das pointsArray, colorsArray und normalsArray einträgt
// Das Quadrat wird dabei in zwei Dreiecke trianguliert, da OpenGL keine Vierecke 
// nativ zeichnen kann.
//
// Übergeben werden für Indices auf die vier Eckpunkte des Vierecks
//


function quad(a, b, c, d) {

     // zunächst wird die Normale des Vierecks berechnet. t1 ist der Vektor von Eckpunkt a zu Eckpunkt b
     // t2 ist der Vektor von Eckpunkt von Eckpunkt a zu Eckpunkt c. Die Normale ist dann das 
     // Kreuzprodukt von t1 und t2
     var t1 = subtract(vertices[b], vertices[a]);
     var t2 = subtract(vertices[c], vertices[a]);
     var normal = cross(t1, t2);
     normal = vec3(normal);

     // und hier kommt die Eintragung der Infos für jeden Eckpunkt (Koordinaten, Normale, Farbe) in die globalen Arrays
     // allen Eckpunkten wird die gleiche Farbe zugeordnet, dabei 
    
     // erstes Dreieck
    pointsArray.push(vertices[a]);
    normalsArray.push(normal);
    colorsArray.push(colors[a]);
    // Abfrage zur Texturierung und push der Texturkoordinaten in das entsprechende Array
    if (isTextured) {
        texCoordsArray.push(texCoord[0]);
    }
 

    pointsArray.push(vertices[b]); 
    normalsArray.push(normal);
    colorsArray.push(colors[a]);
    if (isTextured) {
        texCoordsArray.push(texCoord[1]);
    }

    pointsArray.push(vertices[c]); 
    normalsArray.push(normal);
    colorsArray.push(colors[a]);
    if (isTextured) {
        texCoordsArray.push(texCoord[2]);
    }
    
    // zweites Dreieck
    pointsArray.push(vertices[a]);  
    normalsArray.push(normal); 
    colorsArray.push(colors[a]);
    if (isTextured) {
        texCoordsArray.push(texCoord[0]);
    }
    
    pointsArray.push(vertices[c]); 
    normalsArray.push(normal); 
    colorsArray.push(colors[a]);
    if (isTextured) {
        texCoordsArray.push(texCoord[2]);
    }
    
    pointsArray.push(vertices[d]); 
    normalsArray.push(normal);
    colorsArray.push(colors[a]);
    if (isTextured) {
        texCoordsArray.push(texCoord[3]);
    }
	
    // durch die beiden Dreiecke wurden 6 Eckpunkte in die Array eingetragen
    numVertices += 6;    
}

// Dreiecksflächen erstellen analog zu quad()
function tris(a, b, c) {
    var t1 = subtract(vertices[b], vertices[a]);
    var t2 = subtract(vertices[c], vertices[a]);
    var normal = cross(t1, t2);
    normal = vec3(normal);

    // Dreieck
    pointsArray.push(vertices[a]); 
    normalsArray.push(normal);
    colorsArray.push(colors[a]);
   
    pointsArray.push(vertices[b]); 
    normalsArray.push(normal);
    colorsArray.push(colors[a]);
   
    pointsArray.push(vertices[c]); 
    normalsArray.push(normal);
    colorsArray.push(colors[a]);

    // Es werden für ein Dreieck nur noch 3 Eckpunkte in das Array übertragen
    numVertices += 3;  
}


// Funktion, die einen Würfel zeichnet (Mittelpunkt liegt im Ursprung, Kantenlänge beträgt 1)
function drawCube()
{

    // Texturkoordinaten für den Würfel werden festgelegt
    texCoord = [
        vec2(0, 0),
        vec2(0, 2),
        vec2(2, 2),
        vec2(2, 0)
    ];
    
    // zunächst werden die Koordinaten der 8 Eckpunkte des Würfels definiert
    vertices = [
        vec4( -0.5, -0.5,  0.5, 1.0 ), // 0
        vec4( -0.5,  0.5,  0.5, 1.0 ), // 1
        vec4( 0.5,  0.5,  0.5, 1.0 ),  // 2 
        vec4( 0.5, -0.5,  0.5, 1.0 ),  // 3
        vec4( -0.5, -0.5, -0.5, 1.0 ), // 4
        vec4( -0.5,  0.5, -0.5, 1.0 ), // 5
        vec4( 0.5,  0.5, -0.5, 1.0 ),  // 6
        vec4( 0.5, -0.5, -0.5, 1.0 )   // 7
    ];

    // hier werden verschiedene Farben definiert (je eine pro Eckpunkt)
    // Sie wurden so gewählt, dass bei ausgeschalteter Beleuchtung auf einem ansonsten komplett roten
    // Würfel zwei gegenüberliegende Seiten schwarz sind
    colors = [
        vec4(1.0, 0.0, 0.0, 1.0), 
	    vec4(0.0, 0.0, 0.0, 1.0),
        vec4(1.0, 0.0, 0.0, 1.0),
        vec4(1.0, 0.0, 0.0, 1.0),
	    vec4(0.0, 0.0, 0.0, 1.0),
	    vec4(1.0, 0.0, 0.0, 1.0),
        vec4(1.0, 0.0, 0.0, 1.0),
	    vec4(1.0, 0.0, 0.0, 1.0)
    ];
    
    // und hier werden die Daten der 6 Seiten des Würfels in die globalen Arrays 
    // eingetragen
    // jede Würfelseite erhält eine andere Farbe
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
    
    // die eingetragenen Werte werden an den Shader übergeben
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );
    
    var vNormal = gl.getAttribLocation( program, "vNormal" );
	gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
    
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );
    
    var cPosition = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(cPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(cPosition);

    // Texturierung
    var tBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);

    var vTexCoord = gl.getAttribLocation(program, "vTexCoord");
    gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTexCoord);
    
}

// Funktion, die eine Pyramide zeichnet
function drawPyramid() {

    vertices = [
        vec4( -2.0, 0.0,  -1.0, 1.0 ), // links hinten 0
        vec4( -2.0,  0.0,  1.0, 1.0 ), // links vorne 1
        vec4( 2.0,  0.0,  1.0, 1.0 ),  // rechts vorne 2 
        vec4( 2.0, 0.0,  -1.0, 1.0 ),  // rechts hinten 3
        vec4( 0.0, 4.0, 0.0, 1.0) // Spitze 4
    ];

    colors = [
        vec4(1.0, 0.0, 0.0, 1.0), 
	    vec4(1.0, 1.0, 0.0, 1.0),
        vec4(0.0, 1.0, 0.0, 1.0),
        vec4(0.0, 1.0, 1.0, 1.0),
	    vec4(0.0, 0.0, 1.0, 1.0)
    ];

    // Die Grundfläche wird über quad() erstellt, die restlichen Flächen über tris()
    quad(0,1,2,3);
    tris(0,1,4);
    tris(1,2,4);
    tris(2,3,4);
    tris(3,0,4);

    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );
    
    var vNormal = gl.getAttribLocation( program, "vNormal" );
	gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
    
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );
    
    var cPosition = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(cPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(cPosition);


}

// Teekessel zeichnen
function drawTeapot() {

    var teapotVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(teapotNormalData), gl.STATIC_DRAW);
    teapotVertexNormalBuffer.itemSize = 3;
    teapotVertexNormalBuffer.numItems = teapotNormalData.length / 3;

    var teapotVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(teapotVertexData), gl.STATIC_DRAW);
    teapotVertexPositionBuffer.itemSize = 3;
    teapotVertexPositionBuffer.numItems = teapotVertexData.length / 3;

    teapotVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, teapotVertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(teapotIndexData), gl.STATIC_DRAW);
    teapotVertexIndexBuffer.itemSize = 1;
    teapotVertexIndexBuffer.numItems = teapotIndexData.length;

    gl.enableVertexAttribArray(gl.getAttribLocation(program, "vPosition"));
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "vNormal"));

    gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexPositionBuffer);
    gl.vertexAttribPointer(gl.getAttribLocation(program, "vPosition"), teapotVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexNormalBuffer);
    gl.vertexAttribPointer(gl.getAttribLocation(program, "vNormal"), teapotVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, teapotVertexIndexBuffer);

    gl.disableVertexAttribArray(gl.getAttribLocation(program, "vColor"));
    gl.disableVertexAttribArray(gl.getAttribLocation(program, "vTexCoord"));

}




/*** Funktionen zum Aufbau der Szene */

//
// Funktion zum setzen der inneren und äußeren Parameter der Kamera
//

function setCamera()
{
  
    // es wird ermittelt, welches Element aus der Kameraauswahlliste aktiv ist
    var camIndex = document.getElementById("Cameralist").selectedIndex;


    // Punkt, an dem die Kamera steht  
	var eye;
  
    // Punkt, auf den die Kamera schaut
    var vrp;
  
    // Vektor, der nach oben zeigt  
    var upv;

	
    if (camIndex == 0){
        // hier wird die erste Kameraposition definiert
        eye = vec3(12.0,12.0,4.0);
        vrp = vec3(0.0,0.0,0.0);
        upv = vec3(0.0,1.0,0.0);
	} else if(camIndex == 1){
        // hier wird die zweite Kameraposition definiert
        eye = vec3(10.0,0.0,0.0);
        vrp = vec3(0.0,0.0,0.0);
        upv = vec3(0.0,1.0,0.0);
    } else if(camIndex == 2){
        // hier wird die dritte Kameraposition definiert
        eye = vec3(0.0,10.0,0.0);
        vrp = vec3(0.0,0.0,0.0);
        upv = vec3(1.0,0.0,0.0);
    } else if(camIndex == 3){
        // hier wird die vierte Kameraposition definiert
        eye = vec3(0.0,0.0,10.0);
        vrp = vec3(0.0,0.0,0.0);
        upv = vec3(0.0,1.0,0.0);
    } else if(camIndex == 4){
        // hier wird die Kameraposition für die Pyramidenspitze definiert
        eye = vec3(10.0,4.0,0.0);
        vrp = vec3(0.0,4.0,0.0);
        upv = vec3(0.0,1.0,0.0);
    }

    // hier wird die Viewmatrix unter Verwendung einer Hilfsfunktion berechnet,
    // die in einem externen Javascript (MV.js) definiert wird
    view = lookAt(eye, vrp, upv);  
    
    // die errechnete Viewmatrix wird an die Shader übergeben
    // die Funktion flatten löst dabei die eigentlichen Daten aus dem Javascript-Array-Objekt
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "viewMatrix"), false, flatten(view) );

    // nachdem die inneren Parameter gesetzt wurden, werden nun die äußeren Parameter gesetzt
    // dazu wird die Projektionmatrix mit einer Hilfsfunktion aus einem externen Javascript (MV.js)
    // definiert
    // der Field-of-View wird auf 60° gesetzt, das Seitenverhältnis ist 1:1 (d.h. das Bild ist quadratisch),
    // die near-Plane hat den Abstand 0.01 von der Kamera und die far-Plane den Abstand 100

    projection = perspective(60.0, 1.0, 0.01, 100.0);
    
    // die errechnete Viewmatrix wird an die Shader übergeben
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"), false, flatten(projection));
    
}


//
// die Funktion spezifiziert die Lichtquellen, führt schon einen Teil der Beleuchtungsrechnung durch
// und übergibt die Werte an den Shader
// 
// der Parameter materialDiffuse ist ein vec4 und gibt die Materialfarbe für die diffuse Reflektion an
//

function calculateLights( materialDiffuse)
{

    var amb = parseFloat(globalAmbient.value);
    var shine = parseFloat(shininess.value);
    // zunächst werden die Lichtquellen spezifiziert (bei uns gibt es eine Punktlichtquelle)
    
    // die Position der Lichtquelle (in Weltkoordinaten)
    var lightPosition = vec4(7.0, 7.0, 0.0, 1.0 );
    // die Farbe der Lichtquelle im diffusen Licht
    var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
    // ambientes Licht
    var ambientDiffuse = vec4( amb, amb, amb, 1.0 );
    // spekulares Licht
    var specularDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );

    // dann wird schon ein Teil der Beleuchtungsrechnung ausgeführt - das könnte man auch im Shader machen
    // aber dort würde diese Rechnung für jeden Eckpunkt (unnötigerweise) wiederholt werden. Hier rechnen wir
    // das Produkt aus lightDiffuse und materialDiffuse einmal aus und übergeben das Resultat. Zur Multiplikation
    // der beiden Vektoren nutzen wir die Funktion mult aus einem externen Javascript (MV.js)
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var ambientProduct = mult(lightDiffuse, ambientDiffuse);
    var specularProduct = mult(lightDiffuse, specularDiffuse);
        
    // die Werte für die Beleuchtungsrechnung werden an die Shader übergeben

    // Übergabe der Position der Lichtquelle
    // flatten ist eine Hilfsfunktion, welche die Daten aus dem Javascript - Objekt herauslöst
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition) );
    
    // Übergabe des diffuseProduct
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct) );
    // Übergabe des ambientProduct
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProduct) );
    // Übergabe des specularProduct
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(specularProduct) );
    // Shininess
    gl.uniform1f(gl.getUniformLocation(program, "shininess"),shine);
}

// HILFSFUNKTIONEN

// Hilffunktion mit Möglichkeit, Beleuchtung ein und auszuschalten
function lightingFunc(boolean, materialDiffuse ){
    var lighting = boolean; // Beleuchtungsrechnung wird durchgeführt
        
    // die Information über die Beleuchtungsrechnung wird an die Shader weitergegeben
    //gl.uniform1i(gl.getUniformLocation(program, "lighting"),lighting);
    
    if (lighting) {
        // es soll also eine Beleuchtungsrechnung durchgeführt werden
        // die Beleuchtung wird durchgeführt und das Ergebnis an den Shader übergeben
        calculateLights( materialDiffuse);
        
    } else {
        
        // es gibt keine Beleuchtungsrechnung, die vordefinierten Farben wurden bereits
        // in der Draw-Funktion übergeben
        ;

    };
    gl.uniform1i(gl.getUniformLocation(program, "lighting"),lighting);

}

// Shader-Hilfsfunktion
function calcMatrix(matrix){

    // die Model-Matrix ist fertig berechnet und wird an die Shader übergeben
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelMatrix"), false, flatten(matrix) );

    // jetzt wird noch die Matrix errechnet, welche die Normalen transformiert
    normalMat = mult( view, matrix );
    normalMat = inverse( normalMat );
    normalMat = transpose( normalMat );
    
    // die Normal-Matrix ist fertig berechnet und wird an die Shader ÃŒbergeben
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "normalMatrix"), false, flatten(normalMat) );

    // schließlich wird alles gezeichnet. Dabei wird der Vertex-Shader numVertices mal aufgerufen
    // und dabei die jeweiligen attribute - Variablen für jeden einzelnen Vertex gesetzt
    // außerdem wird OpenGL mitgeteilt, dass immer drei Vertices zu einem Dreieck im Rasterisierungsschritt
    // zusammengesetzt werden sollen
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );
};


function displayScene(){
    
    setCamera();

// Sämtliche Objekte wurden in Hilfsfunktionen gepackt, um die Datei übersichtlicher zu gestalten

    // Erster Würfel
    var cube1 = function() {
        numVertices = 0;
        pointsArray.length=0;
        colorsArray.length=0;
        normalsArray.length=0;

        // Cartoon-Shader setzen
        // Der Shader wird hier für alle nachfolgenden Objekte auf false gesetzt
        // und erst mit der Teekanne folgt das Setzen auf true oder false, damit
        // auch nur die Teekanne den Shader erhält
        gl.uniform1i(gl.getUniformLocation(program, "cartoonOn"), false);

        // Beleuchtung 
        // Farbe und Beleuchtungsboolean werden an die Hilfsfunktion übergeben
        var color = vec4(1.0, 0.8, 0.0, 1.0);
        lightingFunc(false, color);
        
        // es muss noch festgelegt werden, wo das Objekt sich in Weltkoordinaten befindet,
        // d.h. die Model-Matrix muss errechnet werden. Dazu werden wieder Hilfsfunktionen
        // für die Matrizenrechnung aus dem externen Javascript MV.js verwendet
    
        // Den Würfel zeichnen
        drawCube();

        // Initialisierung mit der Einheitsmatrix 
        model = mat4();    

        // Das Objekt wird am Ende noch um die x-Achse rotiert 
        model = mult(model, rotate(theta[0], [1, 0, 0] ));
            
        // Zuvor wird das Objekt um die y-Achse rotiert
        model = mult(model, rotate(theta[1], [0, 1, 0] ));
            
        // Als erstes wird das Objekt um die z-Achse rotiert 
        model = mult(model, rotate(theta[2], [0, 0, 1] ));

        // Das Objekt wird um 5 auf der x- und um 1 auf der z-Achse verschoben
        model = mult(model, translate(5.0, 0 ,1.0));

        // Das Objekt rotiert um so viel Grad um seine eigene z-Achse, dass es in etwa 10 Sekunden eine volle Drehung absolviert
        model = mult(model, rotate(zDegree, [0, 0, 1] ));

        // die Model-Matrix ist fertig berechnet und wird an die Shader-Hilfsfunktion übergeben 
        calcMatrix(model);
    }
    // Die gerade bestimmte Funktion für den ersten Würfel wird aufgerufen
    cube1();

    // Zweiter Würfel
    var cube2 = function() {
        numVertices = 0;
        pointsArray.length=0;
        colorsArray.length=0;
        normalsArray.length=0;

        // Textur
        // isTextured wird gesetzt und anschließend übergeben
        isTextured = true;
        gl.uniform1i(gl.getUniformLocation(program, "isTextured"), isTextured);

        // Beleuchtung 
        // Farbe und Beleuchtungsflag werden an die Hilfsfunktion übergeben
        var color = vec4(0.0, 1.0, 0.0, 1.0);
        lightingFunc(true, color);
        
        // Den Würfel zeichnen
        drawCube();

        // Initialisierung mit der Einheitsmatrix 
        model = mat4();    

        // Das Objekt wird am Ende noch um die x-Achse rotiert 
        model = mult(model, rotate(theta[0], [1, 0, 0] ));
            
        // Zuvor wird das Objekt um die y-Achse rotiert
        model = mult(model, rotate(theta[1], [0, 1, 0] ));
            
        // Als erstes wird das Objekt um die z-Achse rotiert 
        model = mult(model, rotate(theta[2], [0, 0, 1] ));

        // Das Objekt wird um 5 auf der x- und -3 auf der z-Achse verschoben
        model = mult(model, translate(5.0, 0 ,-3.0));

        // Das Objekt wird für so viel Grad um die x-Achse gedreht, dass es in etwa 10 Sekunden zwei volle Rotationen absolviert
        // Der Wert für die Rotationsgrad stammt aus der render() Funktion
        model = mult(model, rotate(2*zDegree, [1, 0, 0] ));

        // Das Objekt wird über alle Achsen um den Faktor 2 skaliert
        model = mult(model, scalem(2.0, 2.0, 2.0));

        // die Model-Matrix ist fertig berechnet und wird an die Shader-Hilfsfunktion übergeben 
        calcMatrix(model);

        // Texturierung wird wieder ausgeschaltet, damit die nachfolgenden Objekte nicht auch texturiert werden
        isTextured = false;
        gl.uniform1i(gl.getUniformLocation(program, "isTextured"), isTextured);
    }
    // Die gerade bestimmte Funktion für den zweiten Würfel wird aufgerufen
    cube2();

    // Untere Pyramide
    var pyramide1 = function() {
        numVertices = 0;
        pointsArray.length=0;
        colorsArray.length=0;
        normalsArray.length=0;

        // Beleuchtung 
        // Farbe und Beleuchtungsflag werden an die Hilfsfunktion übergeben
        var color = vec4(1.0, 0.8, 0.0, 1.0);
        lightingFunc(true, color);

        // Die Pyramide zeichnen
        drawPyramid();

        // Initialisierung mit der Einheitsmatrix
        model = mat4();
                                                
        // Das Objekt wird am Ende noch um die x-Achse rotiert 
        model = mult(model, rotate(theta[0], [1, 0, 0] ));
        
        // Zuvor wird das Objekt um die y-Achse rotiert
        model = mult(model, rotate(theta[1], [0, 1, 0] ));
        
        // Als erstes wird das Objekt um die z-Achse rotiert 
        model = mult(model, rotate(theta[2], [0, 0, 1] ));

        // die Model-Matrix ist fertig berechnet und wird an die Shader-Hilfsfunktion übergeben 
        calcMatrix(model);
    }
    // Die gerade bestimmte Funktion für die erste (unter) Pyramide wird aufgerufen
    pyramide1();

    // Obenere Pyramide
    var pyramide2 = function() {
        numVertices = 0;
        pointsArray.length=0;
        colorsArray.length=0;
        normalsArray.length=0;

        // Beleuchtung 
        // Farbe und Beleuchtungsflag werden an die Hilfsfunktion übergeben
        var color = vec4(1.0, 0.0, 0.0, 1.0);
        lightingFunc(true, color);

        // Die Pyramide zeichnen
        drawPyramid();

        model = mat4();

        // Das Objekt wird am Ende noch um die x-Achse rotiert 
        model = mult(model, rotate(theta[0], [1, 0, 0] ));
        
        // Zuvor wird das Objekt um die y-Achse rotiert
        model = mult(model, rotate(theta[1], [0, 1, 0] ));
        
        // Als erstes wird das Objekt um die z-Achse rotiert 
        model = mult(model, rotate(theta[2], [0, 0, 1] ));

        // Das Objekt wird um 8 auf der y-Achse verschoben
        model = mult(model, translate(0, 8 ,0));

        // Das Objekt wird um 180° Grad um die z-Achse gedreht
        model = mult(model, rotate(180, [0, 0, 1] ));

        // die Model-Matrix ist fertig berechnet und wird an die Shader-Hilfsfunktion übergeben
        calcMatrix(model);
    }
    // Die gerade bestimmte Funktion für die zweite (obere) Pyramide wird aufgerufen
    pyramide2();

    // Kleine Pyramide
    var pyramide3 = function() {
        numVertices = 0;
        pointsArray.length=0;
        colorsArray.length=0;
        normalsArray.length=0;

        // Beleuchtung 
        // Farbe und Beleuchtungsflag werden an die Hilfsfunktion übergeben
        var color = vec4(0.0, 0.0, 1.0, 1.0);
        lightingFunc(true, color);

        // Die Pyramide zeichnen
        drawPyramid();

        model = mat4();
        
        // Das Objekt wird am Ende noch um die x-Achse rotiert 
        model = mult(model, rotate(theta[0], [1, 0, 0] ));
        
        // Zuvor wird das Objekt um die y-Achse rotiert
        model = mult(model, rotate(theta[1], [0, 1, 0] ));
        
        // Als erstes wird das Objekt um die z-Achse rotiert 
        model = mult(model, rotate(theta[2], [0, 0, 1] ));

        // Das Objekt wird auf der y-Achse um 6.67 und auf der z-Achse um 0.667 verschoben
        model = mult(model, translate(0, 6.667, 0.667));

        // Das Objekt wird um die x-Achse 104° Grad gedreht
        model = mult(model, rotate(104, [1, 0, 0] ));
        
        // Das Objekt wir über alle Achsen um 0.4 skaliert
        model = mult(model, scalem(0.4,0.4,0.4)); 
       
        // die Model-Matrix ist fertig berechnet und wird an die Shader-Hilfsfunktion übergeben
        calcMatrix(model);
    }
    // Die gerade bestimmte Funktion für die kleine blaue Pyramide wird aufgerufen
    pyramide3();

    // Teekanne
    var teapot = function () {
        numVertices = 0;
        pointsArray.length = 0;
        colorsArray.length = 0;
        normalsArray.length = 0;

        // Cartoon-Shader setzen
        gl.uniform1i(gl.getUniformLocation(program, "cartoonOn"), cartoonOn);
        gl.uniform1f(gl.getUniformLocation(program, "cartoonThresh_1"), cartoonThresh_1.value/100);
        gl.uniform1f(gl.getUniformLocation(program, "cartoonThresh_2"), cartoonThresh_2.value/100);
    
        // Beleuchtung
        var color = vec4(0.0, 0.0, 1.0, 1.0);
        lightingFunc(true, color);
    
        // es muss noch festgelegt werden, wo das Objekt sich in Weltkoordinaten befindet,
        // d.h. die Model-Matrix muss errechnet werden. Dazu werden wieder Hilfsfunktionen
        // für die Matrizenrechnung aus dem externen Javascript MV.js verwendet
    
        model = mat4();
    
        // Das Objekt wird am Ende noch um die x-Achse rotiert
        model = mult(model, rotate(theta[0], [1, 0, 0]));
    
        // Zuvor wird das Objekt um die y-Achse rotiert
        model = mult(model, rotate(theta[1], [0, 1, 0]));
    
        // Als erstes wird das Objekt um die z-Achse rotiert
        model = mult(model, rotate(theta[2], [0, 0, 1]));
    
        model = mult(model, translate(-5,0,6));
        
        model = mult(model, rotate(zDegree, [0, 1, 0]));
        
        model = mult(model, scalem(0.3, 0.3, 0.3));
        
        drawTeapot();
    
        // die Model-Matrix ist fertig berechnet und wird an die Shader übergeben
        gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelMatrix"), false, flatten(model));

        // jetzt wird noch die Matrix errechnet, welche die Normalen transformiert
        normalMat = mat4();
        normalMat = mult(view, model);
        normalMat = inverse(normalMat);
        normalMat = transpose(normalMat);

        // die Normal-Matrix ist fertig berechnet und wird an die Shader übergeben
        gl.uniformMatrix4fv(gl.getUniformLocation(program, "normalMatrix"), false, flatten(normalMat));

        gl.drawElements(gl.TRIANGLES, teapotVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
    // Die gerade bestimmte Funktion für die Teekanne wird aufgerufen 
    teapot();
}

//
// hier wird eine namenslose Funktion definiert, die durch die Variable render zugegriffen werden kann.
// diese Funktion wird für jeden Frame aufgerufen
//

var render = function(){


    // den Framebuffer (hier wird das Bild hineingeschrieben) und den z-Buffer (wird für Verdeckungsrechnung benötigt)
    // initialisieren.
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    // Durchführung der Animation: der Würfel wird um 2° weiter gedreht und zwar um die aktuell ausgewählte Achse
    // Hier greift die Abfrage, ob eine Rotationsanimation der gesamten Szene durchgeführt werden soll
    // Ist die Animation ausgeschaltet, wird der Drehwinkel einfach auf 0 Grad gesetzt
    if(is_animated) {
        theta[axis] += 2.0;
    } else {
        theta[axis] += 0.0;
    }     

    // jetzt kann die Szene gezeichnet werden
    displayScene();

    // FPS berechnen
    var now = Date.now()/1000;
    counter++;
    elapsedTime += (now - then);
    //then = now;
    if(elapsedTime > 1){ // Erst wenn auch wirklich eine Sekunde vergangen ist, soll ein neuer FPS Wert gesetzt werden
        fps = counter;
        fpsDegreeCounter = counter;
        counter = 0;
        elapsedTime -= 1;
        // Der eigentliche FPS Wert, wie er auf der Seite angezeigt wird
        document.getElementById("fpsCounter").innerHTML = fps;
    }
 
    then = Date.now()/1000;

    
    // FPS zu Rotationsgrad
    // Minimum für die Grad an Rotation sind 0.3, damit ein schöner Übergang gewährleistet wird, 
    // da der Counter erst hochzählen muss und auch dann erst die Rechnung Sinn macht, wenn dieser
    // sein mögliches Maximum erreicht hat
    if(fpsDegreeCounter > 30) {
        zDegree += (36 / fpsDegreeCounter)
    };
    if(zDegree > 360) zDegree = 0.3;
    
    // der Frame fertig gezeichnet ist, wird veranlasst, dass der nächste Frame gezeichnet wird. Dazu wird wieder
    // die die Funktion aufgerufen, welche durch die Variable render spezifiziert wird
    requestAnimationFrame(render);
}

/*** Funktionen zur Ausführung von WebGL  */


//
// Diese Funktion wird beim Laden der HTML-Seite ausgeführt. Sie ist so etwas wie die "main"-Funktion
// Ziel ist es, WebGL zu initialisieren
//

window.onload = function init() {
    
    // die Referenz auf die Canvas, d.h. den Teil des Browserfensters, in den WebGL zeichnet, 
    // wird ermittelt (über den Bezeichner in der HTML-Seite)
    canvas = document.getElementById( "gl-canvas" );
    
    // über die Canvas kann man sich den WebGL-Kontext ermitteln, über den dann die OpenGL-Befehle
    // ausgeführt werden
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    // allgemeine Einstellungen für den Viewport (wo genau das Bild in der Canvas zu sehen ist und
    // wie groß das Bild ist)
    gl.viewport( 0, 0, canvas.width, canvas.height );
  
    // die Hintergrundfarbe wird festgelegt
    gl.clearColor( 0.9, 0.9, 1.0, 1.0 );
    
    // die Verdeckungsrechnung wird eingeschaltet: Objekte, die näher an der Kamera sind verdecken
    // Objekte, die weiter von der Kamera entfernt sind
    gl.enable(gl.DEPTH_TEST);

    // der Vertex-Shader und der Fragment-Shader werden initialisiert
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    
    // die über die Refenz "program" zugänglichen Shader werden aktiviert
    gl.useProgram( program );

	// OpenGL Speicherobjekte anlegen
    vBuffer = gl.createBuffer();
    nBuffer = gl.createBuffer();
    cBuffer = gl.createBuffer();

    // Tekanne auslesen
    loadTeapot();
    
    // die Callbacks für das Anklicken der Buttons wird festgelegt
    // je nachdem, ob man den x-Achsen, y-Achsen oder z-Achsen-Button klickt, hat
    // axis einen anderen Wert
    document.getElementById("ButtonX").onclick = function(){axis = 0;};
    document.getElementById("ButtonY").onclick = function(){axis = 1;};
    document.getElementById("ButtonZ").onclick = function(){axis = 2;};

    // Button, für das Ein- und Ausschalten der Rotation
    document.getElementById("ButtonT").onclick = function(){
        if(is_animated){
            is_animated = false;
            document.getElementById("fpsCounter").innerHTML = 0;

        } else {
            is_animated = true;
        }
    };

    // Textur laden und verarbeiten
    var image = document.getElementById("texImage");
    handleTextureLoaded( image );
    
    // Button zum Ein- und Ausschalten des Cartoon Shaders
    document.getElementById("cartoonButton").onclick = function(){
        cartoonOn = !cartoonOn;
        document.getElementById("cartoonBoolCheck").innerHTML = cartoonOn.toString();
    }

// SLIDER

    // ambient_slider
    globalAmbient = document.getElementById("ambientSlider");
    let updateAmbient = () => document.getElementById("ambientInt").innerHTML = parseFloat(globalAmbient.value) ;
    globalAmbient.addEventListener('input', updateAmbient);
    updateAmbient();

    // shininess slider
    shininess = document.getElementById("shininessSlider");
    let updateShine = () => document.getElementById("shineInt").innerHTML = parseFloat(shininess.value);
    shininess.addEventListener('input', updateShine);
    updateShine();
    
    // Cartoon Threshold Slider 1
    cartoonThresh_1 = document.getElementById("cartoonThreshSlider1");
    cartoonThresh_1.value = parseFloat(cartoonThresh_1.value);
    let updateThresh1 = () => document.getElementById("trhesh1Val").innerHTML = cartoonThresh_1.value;
    cartoonThresh_1.addEventListener('input', updateThresh1);
    updateThresh1();

    // Cartoon Threshold Slider 2
    cartoonThresh_2 = document.getElementById("cartoonThreshSlider2");
    cartoonThresh_2.value = parseFloat(cartoonThresh_2.value);
    let updateThresh2 = () => document.getElementById("trhesh2Val").innerHTML = cartoonThresh_2.value;
    cartoonThresh_2.addEventListener('input', updateThresh2);
    updateThresh2();
   	
// jetzt kann mit dem Rendern der Szene begonnen werden  
    render();
}