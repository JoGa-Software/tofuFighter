
K_KONAMI = false;
KONAMI_CODE = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

keysDown = {};
keysHit = {};
buttonsDown = {};
buttonsHit = {};
mouseX = 0;
mouseY = 0;
mouseMoveX = 0;
mouseMoveY = 0;
mouseLockEnabled = false;

lastKeys = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

K_CTL	= 17;
K_1		= 49;
K_W		= 87;
K_A		= 65;
K_S		= 83;
K_D		= 68;
K_DOWN  = 40;
K_RIGHT = 39;
K_UP	= 38;
K_LEFT  = 37;
K_SPACE = 32;

M_LEFT		= 0;
M_MIDDLE 	= 1;
M_RIGHT 	= 2;
    

function InputtingEntity(e)
{
    e.keyDown = function (key)
    {
        return ( (key in keysDown));
    }
    
    e.keyHit = function (key)
    {
        return ((key in keysHit));
    }
    
    e.mouseDown = function (button)
    {
        return ((button in buttonsDown));
    }
    
    e.mouseHit = function (button)
    {
        return ((button in buttonsHit));
    }
    
    e.mousePosition = function ()
    {
            return [mouseX/canvas.width, mouseY/canvas.height];
    }

    e.mouseMovement = function ()
    {
        return [
            mouseMoveX, 
            mouseMoveY
        ];
    }
    return e;
}

function onKeyDown(evt) 
{
    if (!evt) evt = window.event;
    
    keysDown[evt.keyCode] = true;
    keysHit[evt.keyCode] = true;

    lastKeys.push(evt.keyCode);
    lastKeys.splice(0, 1);
    K_KONAMI = true;
    for (var i = 0; i < 10; i++)
        if (lastKeys[i] != KONAMI_CODE[i])
            K_KONAMI = false;
}

function onKeyUp(evt) 
{
    if (!evt) evt = window.event;
    if (evt.keyCode in keysDown)
        delete keysDown[evt.keyCode];
    
    if (evt.keyCode == K_1)
        DEV_MODE = !DEV_MODE;
}

function onMouseDown(evt) 
{
    if (!evt) evt = window.event;
    buttonsDown[evt.button] = true;
    buttonsHit[evt.button] = true;

    //is pointer lock available ?
    var havePointerLock = 'pointerLockElement' in document ||
    'mozPointerLockElement' in document ||
    'webkitPointerLockElement' in document;
    
    if (!havePointerLock){
        console.log("your browser does not support pointer lock");
    }else{
        //request pointer lock 
        document.body.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
        document.body.requestPointerLock();

        //listen for pointer lock changes
        document.addEventListener('pointerlockchange', onPointerLockChange, false);
        document.addEventListener('mozpointerlockchange', onPointerLockChange, false);
        document.addEventListener('webkitpointerlockchange', onPointerLockChange, false);
    }

}

function onMouseUp(evt)
{
    if (!evt) evt = window.event;
    if (evt.button in buttonsDown)
        delete buttonsDown[evt.button];
}

function onMouseMove(evt)
{
    if (!evt) evt = window.event;
    mouseX = evt.clientX;
    mouseY = evt.clientY;

    mouseMoveX = (evt.movementX || evt.mozMovementX || evt.webkitMovementX || 0);
    mouseMoveY = (evt.movementY || evt.mozMovementY || evt.webkitMovementY || 0);
}

function onPointerLockChange()
{
    if (document.pointerLockElement != null)
        mouseLockEnabled = true;
    else
        mouseLockEnabled = false;
}
