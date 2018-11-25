//ENGINE
loadIncludes([
    "socket.io.js",
	"src/glMatrix-0.9.5.min.js",
    "src/tedge.js",
    "src/net.js",
    "src/dev.js",
    "src/shaders.js",
    "src/physics.js",
    "src/csg.js",
    "src/textures.js",
    "src/particles.js",
    "src/temp.js",
]);

//MAPS
loadIncludes([
    "src/maps/square/map.js",
]);

//SCREENS
loadIncludes([
    "src/screens/GSGame.js",
    "src/screens/GSLoadingScreen.js"
]);

//ENTITIES
loadIncludes([
    "src/entities/GSMap.js",		
    "src/entities/GSDynamicEntity.js",		
    "src/entities/GSBullet.js",		
    "src/entities/GSTofu.js",		
    "src/entities/GSPlayer.js",		
    "src/entities/GSNetPlayer.js",	
]);

//MESHES
loadIncludes([
    "src/meshes.js",
    "src/meshes/smg.js"
]);

/////////////////////////////////////////
//Script loading code beyond this point//
/////////////////////////////////////////

/**
 * Loads JavaScript files in dynamically
 * @param {string} file - path to the file
 */
function loadJS(file) {
    // DOM: Create the script element
    var jsElm = document.createElement("script");
    // set the type attribute
    jsElm.type = "application/javascript";
    // make the script element load file
    jsElm.src = file;
    // finally insert the element to the head element in order to load the script
    document.head.appendChild(jsElm);
}

/**
 * Loads an array of include strings
 * @param {Array<string>} includeArray - an array of strings with the paths for the include files
 */
function loadIncludes(includeArray){
    for (var i = 0; i < includeArray.length; i++){
        loadJS(includeArray[i]);
    }
}

