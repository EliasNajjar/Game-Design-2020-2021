

class ImageGameObject extends GameObject {
    constructor(x, y, imageGameObjectAnimation)
    {
        super();
        this.topLeft = new Point2D(x,y);        
        this.imageGameObjectAnimation = imageGameObjectAnimation;        
    }
    toRender(draw)
    {
        drawAnimation(
            draw,
            this.topLeft.x, 
            this.topLeft.y, 
            this.imageGameObjectAnimation
        );
    }
}

class GameOver extends GameObject {
    constructor()
    {
        super();
    }
    checkPlayerExistance()
    {
        let playerExists = false;
        this.actOnAll(
            function(subject) {
                if(subject instanceof PlayerGameObject)
                {
                    playerExists = true;
                }
            }
        )
        return playerExists;
    }
    toLogic()
    {
        if(!this.checkPlayerExistance())
        {
            clear();
            print("Game Over!");
        }
    }
}

class EnemySpawnerGameObject extends GameObject {
    constructor(enemyGameObjectAnimation, x, y)
    {
        super();        
        this.hitBox = new Rectangle(x,y,80,80);
        this.enemyGameObjectAnimation = enemyGameObjectAnimation;
    }
    countEnemyGameObjects()
    {
        let count = 0;
        this.actOnAll(
            function(subject) {
                if(subject instanceof EnemyGameObject)
                {
                    count = count + 1;
                }
            }
        );
        return count;
    }

    toLogic(clockTick)
    {                        
        if(
            clockTick % 128 == 0 && 
            this.countEnemyGameObjects() < 3
        )
        {
            this.add(
                new EnemyGameObject(                    
                    this.enemyGameObjectAnimation, 
                    this.hitBox.topLeft.x, 
                    this.hitBox.topLeft.y
                ), 
                1
            );
        }
    }
}

class EnemyGameObject extends GameObject {
    constructor(enemyGameObjectAnimation, x, y)
    {
        super();        
        this.hitBox = new Rectangle(x,y,80,80);
        this.enemyGameObjectAnimation = enemyGameObjectAnimation;
    }
    findPlayerLocation()
    {
        let loc = new Point2D(0,0);
        this.actOnAll(
            function(subject)
            {
                if(subject instanceof PlayerGameObject)
                {
                    loc.x = subject.hitBox.topLeft.x;
                    loc.y = subject.hitBox.topLeft.y;
                }
            }
        )
        return loc;
    }
    checkPlayerHit()
    {
        let h = this.hitBox;
        this.actOnAll(
            function(subject){
                if(
                    subject instanceof PlayerGameObject && 
                    subject.hitBox.intersects(h)
                )
                {
                    subject.removeSelf();
                }
            }
        )
    }
    toLogic(clockTick)
    {
        this.checkPlayerHit();
        let twardsPlayer = this.hitBox.topLeft.directionToVector(this.findPlayerLocation());
        twardsPlayer.x += Math.floor(Math.random() * 11) -5;
        twardsPlayer.y += Math.floor(Math.random() * 11) -5;                
        let tempHitBox = this.hitBox.translationCopy(twardsPlayer);
        if(gameArea.contains(tempHitBox))
        {
            this.hitBox = tempHitBox;
        }
        
    }
    toRender(draw)
    {
        drawAnimation(
            draw,
            this.hitBox.topLeft.x, 
            this.hitBox.topLeft.y,
            this.enemyGameObjectAnimation
        )
    }
}

class PlayerProjectileGameObject extends GameObject {
    constructor(playerProjectileGameObjectAnimation, x, y, vx, vy)
    {
        super();        
        this.hitBox = new Rectangle(x,y,80,80);
        this.velocityVector = new Point2D(vx, vy);
        this.moveDistance = 10;
        this.playerProjectileGameObjectAnimation = playerProjectileGameObjectAnimation;
    }
    checkEnemyHit()
    {
        let h = this.hitBox;
        this.actOnAll(
            function(subject){
                if(
                    subject instanceof EnemyGameObject && 
                    subject.hitBox.intersects(h)
                )
                {
                    subject.removeSelf();
                }
            }
        )
    }
    toLogic(clockTick)
    {
        this.checkEnemyHit();
        if(clockTick % 32 == 0)
        {
            this.playerProjectileGameObjectAnimation.forward();            
        }
        
        this.hitBox = this.hitBox.translationCopy(this.velocityVector);
        if(!gameArea.contains(this.hitBox))
        {
            this.removeSelf();
        }
        
    }
    toRender(draw)
    {
        drawAnimation(
            draw,
            this.hitBox.topLeft.x,
            this.hitBox.topLeft.y,
            this.playerProjectileGameObjectAnimation
        );        
    }
}

class PlayerGameObject extends GameObject {
    constructor(playerGameObjectAnimation, playerProjectileGameObjectAnimation, x, y)
    {
        super();
        this.hitBox = new Rectangle(x,y,80,80);
        this.moveDistance = 10;
        this.playerGameObjectAnimation = playerGameObjectAnimation;
        this.playerProjectileGameObjectAnimation = playerProjectileGameObjectAnimation;
        this.projectileFireCooldown = 0;
    }
    countProjectiles()
    {
        let count = 0;
        this.actOnAll(
            function(subject) {
                if(subject instanceof PlayerProjectileGameObject)
                {
                    count = count + 1;
                }
            }
        );
        return count;
    }
    fireProjectile(vx,vy)
    {
        this.add(
            new PlayerProjectileGameObject(
                    this.playerProjectileGameObjectAnimation.copy(),
                    this.hitBox.topLeft.x,
                    this.hitBox.topLeft.y, 
                    vx, 
                    vy
                ), 
            1
        );
        this.projectileFireCooldown = 10;
    }

    toLogic(clockTick)
    {
        let playerProjectileCount = this.countProjectiles();
        if(this.projectileFireCooldown > 0)
        {
            this.projectileFireCooldown--;
        }
        if(this.projectileFireCooldown <=0 && playerProjectileCount < 3)
        {
            if(playerControler.a)
            {
                this.fireProjectile(0,10);
            }
            if(playerControler.b)
            {
                this.fireProjectile(10,0);
            }
            if(playerControler.y)
            {
                this.fireProjectile(0,-10);
            }
            if(playerControler.x)
            {
                this.fireProjectile(-10,0);
            }
        }



        let velocityVector = new Point2D(0,0);        
        if(playerControler.up)
        {
            velocityVector.y -= this.moveDistance;
        }
        if(playerControler.down)
        {
            velocityVector.y += this.moveDistance;
        }
        if(playerControler.left)
        {
            velocityVector.x -= this.moveDistance;
        }
        if(playerControler.right)
        {
            velocityVector.x += this.moveDistance;            
        }
        let tempHitBox = this.hitBox.translationCopy(velocityVector);
        if(gameArea.contains(tempHitBox))
        {
            this.hitBox = tempHitBox;
        }
        
        clear();
        print(playerControler.toString());
    }

    toRender(draw)
    {
        drawAnimation(
            draw,
            this.hitBox.topLeft.x,
            this.hitBox.topLeft.y,
            this.playerGameObjectAnimation
        );    
    }

}
