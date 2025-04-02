function isNumber(N)
{
    return (!Number.isNaN(N)) && Number.isFinite(N);
}

class GameController {
    constructor(keyboardMapping, gamepadMapping)
    {
        this.keyboardMapping = keyboardMapping;
        this.gamepadMapping = gamepadMapping;
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
        this.a = false;
        this.b = false;
        this.x = false;
        this.y = false;
    }
    mapFromKeyboard(keyboardObject)
    {        
        for(let i = 0;i < this.keyboardMapping.length;i++)
        {
            if(keyboardObject[this.keyboardMapping[i][1]] == true || keyboardObject[this.keyboardMapping[i][1]] == false)
            {
                this[this.keyboardMapping[i][0]] = (this[this.keyboardMapping[i][0]] || keyboardObject[this.keyboardMapping[i][1]]);
            }
            
        }
    }
    //https://www.javascripture.com/Gamepad
    //https://www.w3.org/TR/gamepad/

    mapFromGamepad()
    {
        // [GameControllerKey, GamePadsArraySlot, buttons/axes, buttonsIndex/axesIndex, axesRangeMin, axesRangeMax]
        let gamepadReading = navigator.getGamepads();
        let axesPos;        
        for(let i = 0;i < this.gamepadMapping.length;i++)
        {
            if(gamepadReading[this.gamepadMapping[i][1]] instanceof Gamepad)
            {
                
                if(
                    this.gamepadMapping[i][2] == "buttons" &&
                    (
                        gamepadReading[this.gamepadMapping[i][1]].buttons[this.gamepadMapping[i][3]].pressed == true ||
                        gamepadReading[this.gamepadMapping[i][1]].buttons[this.gamepadMapping[i][3]].pressed == false
                    )
                )
                {                    
                    this[this.gamepadMapping[i][0]] = (this[this.gamepadMapping[i][0]] || gamepadReading[this.gamepadMapping[i][1]].buttons[this.gamepadMapping[i][3]].pressed);
                }
                else if(this.gamepadMapping[i][2] == "axes")
                {
                    axesPos = gamepadReading[this.gamepadMapping[i][1]].axes[this.gamepadMapping[i][3]];
                    if(axesPos >= this.gamepadMapping[i][4] && axesPos <= this.gamepadMapping[i][5])
                    {
                        
                        this[this.gamepadMapping[i][0]] = (this[this.gamepadMapping[i][0]] || true);
                    }
                    else
                    {
                        this[this.gamepadMapping[i][0]] = (this[this.gamepadMapping[i][0]] || false);
                    }
                }
            }
        }
    }
    clear()
    {
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
        this.a = false;
        this.b = false;
        this.x = false;
        this.y = false;
    }
    toString()
    {
        let S = "";
        S += " up:" + this.up + " ";
        S += " down:" + this.down + " ";
        S += " left:" + this.left + " ";
        S += " right:" + this.right + " ";
        S += " a:" + this.a + " ";
        S += " b:" + this.b + " ";
        S += " x:" + this.x + " ";
        S += " y:" + this.y + " ";
        return S;
    }
}

class PriorityDictionary {
    constructor()
    {
        this.list = [];
    }

    actOnAll(action)
    {
        let listNodeKeys;
        for(let i = 0;i < this.list.length;i++)
        {
            if(this.list[i] instanceof PriorityDictionaryNode)
            {
                listNodeKeys = Object.getOwnPropertySymbols(this.list[i]);
                for(let j = 0;j < listNodeKeys.length;j++)
                {
                    if((this.list[i])[listNodeKeys[j]] instanceof PriorityDictionaryItem)
                    {                        
                        action((this.list[i])[listNodeKeys[j]]);
                    }
                }
            }
        }
    }

    add(item, priority)
    {
        if(item instanceof PriorityDictionaryItem && Number.isInteger(priority) && priority >= 0)
        {            
            if (!(this.list[priority] instanceof PriorityDictionaryNode))
            {
                this.list[priority] = new PriorityDictionaryNode();
            }            
            (this.list[priority])[item.indexId] = item;
            item.joinList(this);
        }
    }

    remove(indexId)
    {
        for(let i = 0;i < this.list.length;i++)
        {
            if(this.list[i] instanceof PriorityDictionaryNode)
            {
                delete (this.list[i])[indexId];
            }            
        }
    }

}

class PriorityDictionaryNode {
    constructor()
    {

    }
}

class PriorityDictionaryItem {
    constructor()
    {
        this.indexId = Symbol();
        this.membershipList = null;
    }

    joinList(listToJoin)
    {
        if(listToJoin instanceof PriorityDictionary)
        {
            this.membershipList = listToJoin;
        }
    }

    removeSelf()
    {
        if(this.membershipList instanceof PriorityDictionary)
        {
            this.membershipList.remove(this.indexId);
        }        
    }

    actOnAll(action)
    {
        if(this.membershipList instanceof PriorityDictionary)
        {
            this.membershipList.actOnAll(action);
        }
    }

    add(item, priority)
    {
        if(this.membershipList instanceof PriorityDictionary)
        {
            this.membershipList.add(item, priority);
        }
    }

}

class GameObject extends PriorityDictionaryItem {
    constructor()
    {
        super();
    }
    toLogic(clockTick)
    {

    }
    toRender(draw)
    {

    }
}

class AnimationFrame {
    constructor(x, y, w, h)
    {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;        
    }
}

class Animation {
    constructor(imageName, animationFrames)
    {
        this.imageName = imageName;
        this.animationFrames = animationFrames;
        this.frameCounter = 0;
    }
    currentFrame()
    {
        return this.animationFrames[this.frameCounter];
    }
    forward()
    {
        this.frameCounter++;
        if(this.frameCounter > (this.animationFrames.length -1))
        {
            this.restart();
        }
    }
    back()
    {
        this.frameCounter--;
        if(this.frameCounter < 0)
        {
            this.frameCounter = (this.animationFrames.length -1);
        }
    }
    restart()
    {
        this.frameCounter = 0;
    }
    copy()
    {
        return new Animation(this.imageName, this.animationFrames);
    }
}



class Collidable {
    constructor()
    {

    }
    contains(geometry)
    {
        return true;
    }
    intersects(geometry)
    {
        return ture;
    }
    translationCopy(p)
    {
        return new Collidable();
    }

}

class Point2D extends Collidable {
    constructor(x,y)
    {
        super();
        this.x = x;
        this.y = y;
    }    
    distance(p)
    {
        if(p instanceof Point2D)
        {
            return Math.sqrt(Math.pow((this.x - p.x),2) + Math.pow((this.y - p.y),2));
        }
    }
    directionToVector(p)
    {        
        if(p instanceof Point2D)
        {
            let v = new Point2D(0,0);
            if(p.x > this.x)
            {
                v.x = 1;
            }
            else if(p.x < this.x)
            {
                v.x = -1;
            }
            if(p.y > this.y)
            {
                v.y = 1;
            }
            else if(p.y < this.y)
            {
                v.y = -1;
            }            
            return v;
        }
    }
    contains(geometry)
    {   
        //Point2Ds lack a width and a height thus can't contain anything.
        return false;        
    }
    intersects(geometry)
    {        
        if(geometry instanceof Point2D)
        {
            return this.x == geometry.x && this.y == geometry.y;            
        }
        else if(geometry instanceof Rectangle)
        {
    //consider, the point in the rectangle is the same as the rectangle being around the point.
            return geometry.intersects(this); 
        }
        else if(geometry instanceof Circle)
        {
            return geometry.intersects(this);
        }
        else if (geometry instanceof Collidable)
        {
            return true;
        }
    }
    translationCopy(p)
    {
        if(p instanceof Point2D)
        {
            return new Point2D(this.x + p.x, this.y + p.y);
        }
    }
}
// https://happycoding.io/tutorials/processing/collision-detection
class Rectangle extends Collidable {
    constructor(x,y,w,h)
    {
        super();
        this.topLeft = new Point2D(x,y);
        this.w = w;
        this.h = h;
    }    
    contains(geometry)
    {
        if(geometry instanceof Point2D)
        {
            return this.intersects(geometry);
        }
        else if (geometry instanceof Rectangle)
        {        
            return this.contains(geometry.topLeft) && this.contains(geometry.topLeft.translationCopy(new Point2D(geometry.w,geometry.h)))
        }
        //todo: add Circle logic
    }

    intersects(geometry)
    {
        if(geometry instanceof Point2D)
        {
            if (this.topLeft.x + this.w > geometry.x && this.topLeft.x < geometry.x && this.topLeft.y + this.h > geometry.y && this.topLeft.y < geometry.y)
            {
                return true;
            }
            else 
            {
                return false;
            }
        }
        else if (geometry instanceof Rectangle)
        {
            if (this.topLeft.x + this.w > geometry.topLeft.x && this.topLeft.x < geometry.topLeft.x + geometry.w && this.topLeft.y + this.h > geometry.topLeft.y && this.topLeft.y < geometry.topLeft.y + geometry.h)
            {
                return true;
            }
            else 
            {
                return false;
            }
        }
        else if(geometry instanceof Circle)
        {
            let test = new Point2D(geometry.center.x, geometry.center.y);

            if (geometry.center.x < this.topLeft.x)
            {
                test.x = this.topLeft.x;
            }
            else if (geometry.center.x > this.topLeft.x + this.w) 
            {
                test.x = this.topLeft.x + this.w; 
            }
                
            if (geometry.center.y < this.topLeft.y)
            {
                test.y = this.topLeft.y;
            }                
            else if (geometry.center.y > this.topLeft.y + this.h) 
            {
                test.y = this.topLeft.y + this.h;
            }
            
            if(test.distance(geometry.center) <= geometry.r)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        else if (geometry instanceof Collidable)
        {
            return true;
        }     
    }
    translationCopy(p)
    {
        if(p instanceof Point2D)
        {
            return new Rectangle(this.topLeft.x + p.x, this.topLeft.y + p.y, this.w, this.h);
        }
        
    }
    area()
    {
        return this.w * this.h;
    }
    scale(scaleFactor)
    {
        this.w *= scaleFactor;
        this.h *= scaleFactor;
    }
}

class Circle extends Collidable {
    constructor(x,y,r)
    {
        super();
        this.center = new Point2D(x,y);
        this.r = r;
    }

    intersects(geometry)
    {
        if(geometry instanceof Point2D)
        {
            return (this.r) <= this.center.distance(geometry);
        }
        else if (geometry instanceof Circle)
        {
            return (this.r + geometry.r) <= this.center.distance(geometry.center);
        }
        else if (geometry instanceof Rectangle)
        {
            let test = new Point2D(this.center.x, this.center.y);

            if (this.center.x < geometry.topLeft.x)
            {
                test.x = geometry.topLeft.x;
            }
            else if (this.center.x > geometry.topLeft.x + geometry.w) 
            {
                test.x = geometry.topLeft.x + geometry.w; 
            }
                
            if (this.center.y < geometry.topLeft.y)
            {
                test.y = geometry.topLeft.y;
            }                
            else if (this.center.y > geometry.topLeft.y + geometry.h) 
            {
                test.y = geometry.topLeft.y + geometry.h;
            }
            
            if(test.distance(this.center) <= this.r)
            {
                return true;
            }
            else
            {
                return false;
            }            
        }
        else if (geometry instanceof Collidable)
        {
            return true;
        }
    }
    translationCopy(p)
    {
        if(p instanceof Point2D)
        {
            return new Circle(this.center.x + p.x, this.center.y + p.y, this.r);
        }        
    }
    area()
    {
        return Math.PI * Math.pow(this.r,2);
    }

    scale(scaleFactor)
    {
        this.r *= scaleFactor;
    }
}
