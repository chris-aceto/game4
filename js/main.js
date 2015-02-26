window.onload = function() {
    
    "use strict";
    
    var game = new Phaser.Game( 1200, 400, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
        // Load an image and call it 'carsprite'.
        game.load.spritesheet( 'carsprite', 'assets/caryou.png', 594, 400);
		game.load.image( 'carsprite2', 'assets/carOther2.png' );
		game.load.image( 'carWrecked', 'assets/carOtherWrecked.png');
		game.load.image( 'bg', 'assets/BGcar.png' );
		game.load.image( 'road', 'assets/road.png' )
		game.load.audio('clunk', 'assets/clunk.ogg');
		game.load.audio('music', 'assets/music.ogg');
		game.load.audio('vroom', 'assets/vroom.ogg');
		game.load.audio('victory', 'assets/victory.ogg');
		game.load.audio('lose', 'assets/lose.ogg');
		game.load.image( 'hired', 'assets/BGcarwin.png');
    }
    
	var win;
	var music;
	var vroom;
    var car;
	var carOn = false;
	var floor;
	var map;
	var cursors;
	var jump;
	var height = false;
	var jumping = false;
	var jumps = 0;
	var loop = 1;
	var car2;
	var car3;
	var car4;
	var car5;
	var carswitch = true;
	var currentPos;
	var count = 0;
	var tenth = 0;
	var clunk;
	var doublejump = false;
	var bg;
	var road;
	var lose;
    function create() {
		bg = game.add.tileSprite(0, 0, 1200, 400, 'bg');
		bg.fixedToCamera=true;
		road = game.add.tileSprite(0, 0, 100600, 400, 'road');
		game.world.setBounds(0, 0, 100600, 400);
        // Create a sprite at the center of the screen using the 'carsprite' image.
        car = game.add.sprite( game.world.centerX - 3000, game.world.centerY, 'carsprite' );
		car.width = 200;
		car.height = 100;
        // so it will be truly centered.
		//car.animations.add('carsprite2', true);
		
        car.anchor.setTo( 0, -2 );
		game.physics.arcade.gravity.y = 2250;
        // Turn on the arcade physics engine for this sprite.
        game.physics.enable( car, Phaser.Physics.ARCADE );
		
		car.animations.add('drive', [0,1,2],7,true);
		
		
		// creating npc cars
		car2 = game.add.sprite( car.body.x + 200, game.world.centerY, 'carsprite2' );
		game.physics.enable( car2, Phaser.Physics.ARCADE );
		car2.body.collideWorldBounds = true;
		car2.anchor.setTo( 0, -2 );
		car2.width = 200;
		car2.height = 100;
		
		car3 = game.add.sprite( car.body.x + 350, game.world.centerY, 'carsprite2' );
		game.physics.enable( car3, Phaser.Physics.ARCADE );
		car3.body.collideWorldBounds = true;
		car3.anchor.setTo( 0, -2 );
		car3.width = 200;
		car3.height = 100;
		
		car4 = game.add.sprite( car.body.x + 580, game.world.centerY, 'carsprite2' );
		game.physics.enable( car4, Phaser.Physics.ARCADE );
		car4.body.collideWorldBounds = true;
		car4.anchor.setTo( 0, -2 );
		car4.width = 200;
		car4.height = 100;
		
		car5 = game.add.sprite( car.body.x + 780, game.world.centerY, 'carsprite2' );
		game.physics.enable( car5, Phaser.Physics.ARCADE );
		car5.body.collideWorldBounds = true;
		car5.anchor.setTo( 0, -2 );
		car5.width = 200;
		car5.height = 100;
		//car5.body.gravity = 200;
		
        car.body.collideWorldBounds = true;
		car2.body.collideWorldBounds = true;
		car3.body.collideWorldBounds = true;
		car4.body.collideWorldBounds = true;
		//car5.body.collideWorldBounds = true;
		
		car2.body.immovable= true;
		car3.body.immovable= true;
		car4.body.immovable= true;
		car5.body.immovable= true;
		
		clunk = game.add.audio('clunk');
		vroom = game.add.audio('vroom');
		music = game.add.audio('music');
		win = game.add.audio('victory',3);
		lose = game.add.audio('lose');
		music.play();
		cursors = game.input.keyboard.createCursorKeys();
		jump = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    }
    
    function update() {
	//	bug fix
		carOn = false;
		if(car.body.y < 10){
			car.body.y = 20;
			}
		
		game.camera.x = car.body.x - 150;
		//controlling different speeds
		car2.body.velocity.x = 50 * (tenth +1);
		car3.body.velocity.x = 50 * (tenth +2);
		car4.body.velocity.x = 50 * (tenth +3);
		car5.body.velocity.x = 70 * (tenth +4);
		
		//flying car physics
		if (!car5.body.onFloor()){
			car5.body.velocity.y = 120;
			if(game.physics.arcade.collide(car5,car)){
				car5.body.velocity.y = -910;
				car5.body.velocity.x = 310;
				}
			}
		if (!car4.body.onFloor()){
			if(game.physics.arcade.collide(car4,car)){
				car4.body.velocity.y = -910;
				car4.body.velocity.x = 310;
				}
			}
		
		if (!carswitch){
			car4.body.velocity.y = -100;
			
			}
		//reuse cars
		if (car.body.x > car2.body.x + 1500){
			car2.loadTexture('carsprite2');
			car2.body.x = car.body.x + 1500;
			if (tenth == 10){
				car2.kill();
				}
			}
		if (car.body.x > car3.body.x + 1500){
		car3.loadTexture('carsprite2');
			car3.body.x = car.body.x + 1500 + ( 75 * tenth +1);;
			car3.body.velocity.x += 100;
			if (count > 5){
			//carswitch = false;
				car3.body.y += 1000;
				car3.body.velocity.y -= 400;
			}
			if (tenth == 10){
				car3.kill();
				}
			}
		if (car.body.x > car4.body.x + 1500){
		car4.loadTexture('carsprite2');
			car4.body.x = car.body.x + 1500 + ( 50 * tenth +1);
			count +=1;
			tenth+=1;
			if (count > 2){
			carswitch = false;
				car4.body.y += 1000;
				car4.body.velocity.y -= 400;
			}
			if (tenth == 10){
				car4.kill();
				}
			
			}
		if (car.body.x > car5.body.x + 1500){
		car5.loadTexture('carsprite2');
			car5.body.x = car5.body.x + 2000;
			if (count > 4){
				car5.body.y =20;
				car5.body.velocity.y = 300;
				}
			if (tenth == 10){
				car5.kill();
				//win condition
				win.play();
				bg = game.add.sprite(0, 0, 'hired');
				game.camera.follow(bg);
				}
			}
		
		car.animations.play('drive');
       
		game.physics.arcade.collide(car2, car);
		game.physics.arcade.collide(car3, car);
		game.physics.arcade.collide(car5, car);
		game.physics.arcade.collide(car4, car);
		game.physics.arcade.collide(car3, car4);
		game.physics.arcade.collide(car5, car4);
		
		if (car.body.velocity.y == 500)
			{
				height = false;
				car.body.velocity.y = 0;
			}
		if (height){
			car.body.velocity.y += 25;
			
		}
		// checking if car is moving left or right, and if the player wants to accellerate
		if (car.body.velocity.x < 0 && cursors.left.isDown && car.body.velocity.x > -1800){
			car.body.velocity.x *= 1.1;
			if (car.body.velocity.y == 0){
			}
			}
		if (car.body.velocity.x < 0 && !cursors.left.isDown){
			car.body.velocity.x *= 0.95;
			if (car.body.velocity.y == 0){
			}
			}
		
		if (car.body.velocity.x > 0 && cursors.right.isDown && car.body.velocity.x < 1800){
		car.body.velocity.x *= 1.1;
		if (car.body.velocity.y == 0){
		}
		}
		if (car.body.velocity.x > 0 && !cursors.right.isDown){
			car.body.velocity.x *= 0.95;
			if (car.body.velocity.y == 0){
			}
			}
		
		if (cursors.left.isDown && car.body.velocity.x >= -50)
		{
			car.body.velocity.x =-175;
		}
		
		if (cursors.right.isDown && car.body.velocity.x <= 50)
		{
			car.body.velocity.x=175;
		}
		
		if (car2.body.touching.up){
			car2.loadTexture('carWrecked');
			//carOn = true;
			if(!clunk.isPlaying){
				clunk.play();
				}
			}
		if (car3.body.touching.up){
			car3.loadTexture('carWrecked');
			if(!clunk.isPlaying){
				clunk.play();
				}
			carOn = true;
			}
		if (car5.body.touching.up){
			car5.loadTexture('carWrecked');
			if(!clunk.isPlaying){
				clunk.play();
				}
			carOn = true;
		}
		if (car4.body.touching.up){
			car4.loadTexture('carWrecked');
			if(!clunk.isPlaying){
				clunk.play();
				};
			carOn = true;
		}
		if (carOn){
			car.body.y -=10;
			}
			// starting a jump
		if (jump.isDown && car.body.onFloor() || jump.isDown && car.body.touching.down)
    {
        car.body.velocity.y = -750;
		doublejump = true;
		vroom.play();
    }
		if (doublejump && cursors.up.isDown){
			car.body.velocity.y = -550;
			doublejump = false;
			vroom.play();
		}
		if (!car.body.onFloor()){
			car.body.velocity.y +=1;
			if (car.body.velocity.y > 0){
			car.body.velocity.y *= 1.1;}
			}
		}
    }
