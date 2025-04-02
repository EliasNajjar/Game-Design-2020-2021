/*class GameObject extends PriorityDictionaryItem {
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
}*/
class Enemy extends GameObject{
    constructor()
    {
        super();
        this.hitBox = new Rectangle (200,200,40,60);
        this.enemyAnimation = new Animation ("billy",[new AnimationFrame(0,0,40,60),new AnimationFrame(40,0,40,60),new AnimationFrame(80,0,40,60),new AnimationFrame(120,0,40,60)])
    }
    toRender(draw)
    {
        drawAnimation(
            draw,
            this.hitBox.topLeft.x,
            this.hitBox.topLeft.y,
            this.enemyAnimation
        );        
    }
    toLogic(clockTick)
    {
        if (clockTick % 16 == 0)
        {
            this.enemyAnimation.forward();
        }
        this.hitPlayerProjectile();
    }
    hitPlayerProjectile()
    {
        let hb = this.hitBox
        this.actOnAll
        (
            function(subject)
            {
                if(subject instanceof PlayerProjectileGameObject)
                {
                    if(subject.hitBox.intersects(hb))
                    {
                        subject.removeSelf();
                    }
                }
            }
        )
    
    }
}

/*toRender(draw)
    {
        drawAnimation(
            draw,
            this.hitBox.topLeft.x,
            this.hitBox.topLeft.y,
            this.playerProjectileGameObjectAnimation
        );        
    }*/