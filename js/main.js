window.onload = function() {
    
    "use strict";
    
    var game = new Phaser.Game( 1200, 800, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
        // Load an image and call it 'carsprite'.
        game.load.spritesheet( 'carsprite', 'assets/caryou.png', 594, 400);
		game.load.image( 'carsprite2', 'assets/carOther2.png' );
		game.load.image( 'carWrecked', 'assets/carOtherWrecked.png');
		game.load.image( 'bg', 'assets/BG3.png' );
		game.load.image( 'road', 'assets/clouds.png' )
		game.load.audio('clunk', 'assets/clunk.ogg');
		game.load.audio('music', 'assets/music.ogg');
		game.load.audio('vroom', 'assets/vroom.ogg');
		game.load.audio('victory', 'assets/victory.ogg');
		game.load.audio('lose', 'assets/lose.ogg');
		game.load.image( 'hired', 'assets/BGcarwin.png');
		game.load.audio('meow','assets/meow.ogg');
		game.load.spritesheet('cats', 'assets/catsheet3.png', 362, 400);
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
	var cooldown = 0;
	var meow;
    function create() {
		bg = game.add.tileSprite(0, 0, 1200, 50000, 'bg');
		bg.fixedToCamera=true;
		road = game.add.tileSprite(0, 0, 1200, 50000, 'road');
		game.world.setBounds(0, 0, 1200, 50000);
        // Create a sprite at the center of the screen using the 'carsprite' image.
        car = game.add.sprite( game.world.centerX , 50000, 'cats' );
		car.width = 170;
		car.height = 170;
        // so it will be truly centered.
		//car.animations.add('carsprite2', true);
		
        car.anchor.setTo( 0, -2 );
		game.physics.arcade.gravity.y = 1050;
        // Turn on the arcade physics engine for this sprite.
        game.physics.enable( car, Phaser.Physics.ARCADE );
		
		car.animations.add('fly', [0,1,2],7,true);
		car.animations.add('boost',[3,4],7, true);
		car.animations.add('boost2',[4],7, true);
		
		
		// creating npc cars
		car2 = game.add.sprite( car.body.x - 1000, 50000, 'carsprite2' );
		game.physics.enable( car2, Phaser.Physics.ARCADE );
		car2.body.collideWorldBounds = true;
		car2.anchor.setTo( 0, -2 );
		car2.width = 200;
		car2.height = 100;
		
		car3 = game.add.sprite( car.body.x + 1000, 50000, 'carsprite2' );
		game.physics.enable( car3, Phaser.Physics.ARCADE );
		car3.body.collideWorldBounds = true;
		car3.anchor.setTo( 0, -2 );
		car3.width = 200;
		car3.height = 100;
		
		car4 = game.add.sprite( car.body.x + 500, 50000, 'carsprite2' );
		game.physics.enable( car4, Phaser.Physics.ARCADE );
		car4.body.collideWorldBounds = true;
		car4.anchor.setTo( 0, -2 );
		car4.width = 200;
		car4.height = 100;
		
		car5 = game.add.sprite( car.body.x - 500, 50000, 'carsprite2' );
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
		meow = game.add.audio('meow');
		music.play();
		cursors = game.input.keyboard.createCursorKeys();
		jump = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		//game.camera.follow(car);
    }
    
    function update() {
	//	bug fix
		carOn = false;
		if(car.body.y < 10){
			car.body.y = 20;
			}
		if (car.body.y < 500 && !win.isPlaying){
			win.play();
			}
		game.camera.y = car.body.y - 550;
		if (car.onFloor){
			car.kill();}
		//controlling different speeds
		car2.body.velocity.y = -500 * (tenth +1);
		car3.body.velocity.y = -500 * (tenth +2);
		car4.body.velocity.y = -500 * (tenth +3);
		car5.body.velocity.y = -700 * (tenth +4);
		car2.body.velocity.x = 250 * (tenth +1);
		car3.body.velocity.x = -250 * (tenth +2);
		car4.body.velocity.x = 250 * (tenth +3);
		car5.body.velocity.x = -270 * (tenth +4);
		
		// wall scrolling
		if ( car2.body.x > 900){
			car2.body.x = 0;
			}
		if ( car3.body.x < 200){
			car3.body.x = 1100;
			}
		if ( car4.body.x > 900){
			car4.body.x = 0;
			}
		if ( car5.body.x < 200){
			car5.body.x = 1100;
			}
		//kill cars at height
		if (car2.body.y < 500){
			car2.kill();
			}
		if (car3.body.y < 500){
			car3.kill();
			}
		if (car4.body.y < 500){
			car4.kill();
			}
		if (car5.body.y < 500){
			car5.kill();
			}
		//reuse cars
		if (car.body.y < car2.body.y - 1500){
			car2.loadTexture('carsprite2');
			car2.body.y = car.body.y - 1500;
			if (tenth == 10){
				car2.kill();
				}
			}
		if (car.body.y > car3.body.y - 1500){
		car3.loadTexture('carsprite2');
			car3.body.y = car.body.y - 1500 + ( 75 * tenth +1);
			car3.body.velocity.y += 100;
			
			if (tenth == 10){
				car3.kill();
				}
			}
		if (car.body.y > car4.body.y + 1500){
		car4.loadTexture('carsprite2');
			car4.body.y = car.body.y + 1500 + ( 50 * tenth +1);
			count +=1;
			tenth+=1;
			
			if (tenth == 10){
				car4.kill();
				}
			
			}
		if (car.body.y > car5.body.y + 1500){
		car5.loadTexture('carsprite2');
			car5.body.y = car5.body.y + 2000;
			
			if (tenth == 10){
				car5.kill();
				//win condition
				win.play();
				//bg = game.add.sprite(0, 0, 'hired');
				game.camera.follow(bg);
				}
			}
		
		car.animations.play('fly');
       
		game.physics.arcade.collide(car2, car);
		game.physics.arcade.collide(car3, car);
		game.physics.arcade.collide(car5, car);
		game.physics.arcade.collide(car4, car);
		game.physics.arcade.collide(car3, car4);
		game.physics.arcade.collide(car5, car4);
		
		
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
		if (jump.isDown && cooldown == 0){ //&& car.body.onFloor() || jump.isDown && car.body.touching.down){
        car.body.velocity.y = -550;
		if(!vroom.isPlaying){
		//vroom.play();
		}
		doublejump = true;
    }
		if (cooldown != 0){
			
			if (car.body.velocity.y < -2000){
				car.animations.play('boost');
				}
			else{
				car.animations.play('boost2');
				}
			cooldown -= 1;
			if (cooldown < 10){
				car.body.velocity.y = -550;
				}
			}
		else{
			car.animations.play('fly');
			}
		if (doublejump && cursors.up.isDown && cooldown == 0){
			car.body.velocity.y *= 5;
			car.body.velocity.x *= 1.3;
			cooldown = 45;
			doublejump = false;
			vroom.play();
		}
		if (doublejump && cursors.down.isDown && cooldown == 0){
			car.body.velocity.y *= 9;
			car.body.velocity.x *= 2;
			cooldown = 100;
			doublejump = false;
			meow.play();
		}
		
		}
}