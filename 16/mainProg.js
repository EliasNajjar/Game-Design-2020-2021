const clockSpeed = 17;  
const screenWidth = 1600;
const screenHeight = 1200;
let consoleText = [];
let screenBuffer;
let globalClock = 0;
let allImages = {};
let areAllImagesLoaded = false;
let allKeys = {};
let gamePadConnected = false;
let allKeysBuffer = {};

let gameObjects;
let playerControler;


function main()
{
    gameObjects = new PriorityDictionary();
    playerControler = new GameController(
        [
            ["up", "ArrowUp"],
            ["down", "ArrowDown"],
            ["left", "ArrowLeft"],
            ["right", "ArrowRight"],
            ["a", "a"],
            ["b", "s"],
            ["x", "z"],
            ["y", "x"],
        ],
        // [GameControllerKey, GamePadsArraySlot, buttons/axes, buttonsIndex/axesIndex, axesRangeMin, axesRangeMax]
        [
            ["down", 0, "axes", 1,0.5,1],
            ["up", 0, "axes", 1,-1,-0.5],
            ["left", 0, "axes", 0,-1,-0.5],
            ["right", 0, "axes", 0,0.5,1],
            ["a", 0, "buttons", 0],
            ["b", 0, "buttons", 1],
            ["x", 0, "buttons", 2],
            ["y", 0, "buttons", 3]
        ]
    )
    setUp();
    //https://www.w3schools.com/jsref/met_win_setinterval.asp
    window.setInterval(logic, clockSpeed);    
    render();
}

function render()
{   
    uiLogic(); 
    //https://www.html5rocks.com/en/tutorials/canvas/performance/
    let draw = screenBuffer.getContext("2d");
    draw.fillStyle = "#0000FF";
    draw.fillRect(0, 0, screenBuffer.width, screenBuffer.height);
    //https://www.w3schools.com/tags/canvas_drawimage.asp
    if(areAllImagesLoaded)
    {
        gameObjects.actOnAll(
            function(subject) {
                if(subject instanceof GameObject)
                {
                    subject.toRender(draw);
                }
            }
        );
    }    
    
    draw.fillStyle = "#FFFFFF";
    draw.font = "28px Arial";
    for(let i = 0;i < consoleText.length;i++)
    {
        draw.fillText(consoleText[i], 50, 50 + (i * 28));
    }

    let screen = document.getElementById("screen");
    screen.width = window.innerWidth;
    screen.height = window.innerHeight
    let screenDraw = screen.getContext("2d");
    screenDraw.drawImage(screenBuffer,0,0, screenWidth, screenHeight, 0,0, screen.width, screen.height);
    //https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
    window.requestAnimationFrame(render);
}

function uiLogic()
{
    playerControler.clear();
    playerControler.mapFromKeyboard(allKeysBuffer);
    playerControler.mapFromGamepad();
}

function logic()
{
    gameObjects.actOnAll(
        function(subject) {
            if(subject instanceof GameObject)
            {
                subject.toLogic(globalClock);
            }
        }
    );
    
    globalClock++;
    if(globalClock >= 0xFFFF)
    {
        globalClock = 0;
    }

    allKeysBuffer = allKeys;

}

function setUp()
{
    
    //https://www.w3schools.com/jsref/prop_style_height.asp
    //https://www.w3schools.com/jsref/prop_win_innerheight.asp

    screenBuffer = document.createElement('canvas');
    screenBuffer.width = screenWidth;
    screenBuffer.height = screenHeight; 

    //https://developer.mozilla.org/en-US/docs/Web/API/Document/keydown_event
    //https://www.w3schools.com/jsref/event_onkeydown.asp
    //https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent
    //https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
    //https://gist.github.com/tylerbuchea/8011573
    //https://www.w3schools.com/jsref/jsref_fromcharcode.asp
    ////https://css-tricks.com/snippets/javascript/javascript-keycodes/

    window.onkeydown = function(event) 
    {
        //console.log(event.key);
        allKeys[event.key] = true;
        allKeysBuffer[event.key] = true;
    }
    
    window.onkeyup = function(event) 
    {
        allKeys[event.key] = false;
    }

    

    gameSetUp();   
}

function drawAnimation(draw, x, y, animationToDraw)
{
    if(animationToDraw instanceof Animation)
    {                
        draw.drawImage(
            allImages[animationToDraw.imageName],
            animationToDraw.currentFrame().x,
            animationToDraw.currentFrame().y,
            animationToDraw.currentFrame().w,
            animationToDraw.currentFrame().h,
            x,
            y,
            animationToDraw.currentFrame().w,
            animationToDraw.currentFrame().h,
        );
    }
}

function loadImages(list)
{
    //https://www.javascripttutorial.net/javascript-multidimensional-array/
    
    let allImagesCount = 0; // scope is expanded via closure
    let allImagesLoadedCount = 0; // scope is expanded via closure
    allImageCount = list.length;
    for(let i = 0;i < list.length;i++)
    {
        allImages[list[i][0]] = new Image();
        allImages[list[i][0]].src = list[i][1];
        allImages[list[i][0]].onload = function() {
            allImagesLoadedCount++;
            if(allImagesLoadedCount >= allImageCount)
            {
                areAllImagesLoaded = true;
            }
        }
        allImages[list[i][0]].onerror = function() {
            print("failed to load:" + list[i][1]);
        }
    }
}

function print(S)
{
    consoleText.push(S);
}

function clear()
{
    consoleText = [];
}