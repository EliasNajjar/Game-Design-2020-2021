let gameArea;

function gameSetUp()
{
    loadImages(
        [
            ["player", "images/player.png"],
            ["water", "images/water.png"],
            ["projectile", "images/projectile.png"],
            ["enemy", "images/enemy.png"]
        ]
    );
    gameArea = new Rectangle(0,0,1600,1200);
    
    print("game started");

    print("game stopped");
    gameObjects.add(new GameOver(), 0);
    gameObjects.add(
        new EnemySpawnerGameObject(
            new Animation(
                "enemy", 
                [
                    new AnimationFrame(0,0,80,80)
                ]
            ),
            800, 
            800
        ), 
        1
    );//enemy
    
    gameObjects.add(
        new ImageGameObject(
            0,
            0, 
            new Animation(
                "water", 
                [
                    new AnimationFrame(0,0,1600,1200)
                ]
            )
        ), 
        0
    );//background
    
    gameObjects.add(
        new PlayerGameObject(
            new Animation(
                "player", 
                [
                    new AnimationFrame(0,0,80,80)
                ]
            ),
            new Animation(
                "projectile", 
                [
                    new AnimationFrame(0,0,80,80),
                    new AnimationFrame(80,0,80,80)
                ]
            ),
            200,
            200
        ), 
        1
    );//player
    
    
}

