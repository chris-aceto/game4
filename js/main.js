window.onload = function() {
    
    "use strict";
    
    var game = new Phaser.Game( 1200, 400, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
        // Load an image and call it 'carsprite'.
        game.load.spritesheet( 'carsprite', 'assets/caryou.png', 594, 400);
		game.load.image( 'carsprite2', 'assets/carOther.png' );
		game.load.image( 'carWrecked', 'assets/carOtherWrecked.png');
		game.load.image( 'bg', 'assets/BG.png' );
		game.load.audio('woof', 'assets/woof.ogg');
		game.load.audio('meow', 'assets/meow.ogg');
    }
    
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
	var third = 0;
	var seventh = 0;
    function create() {
	game.add.tileSprite(0, 0, 200600, 400, 'bg');
	 game.world.setBounds(0, 0, 200600, 400);
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
		
		car.animations.add('drive', [0,1,2],6,true);
		
		// creating npc cars
		car2 = game.add.sprite( car.body.x + 200, game.world.centerY, 'carsprite2' );
		game.physics.enable( car2, Phaser.Physics.ARCADE );
		car2.body.collideWorldBounds = true;
		car2.anchor.setTo( 0, -2 );
		car2.width = 200;
		car2.height = 100;
		
		car3 = game.add.sprite( car.body.x + 380, game.world.centerY, 'carsprite2' );
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
		
        car.body.collideWorldBounds = true;
		car2.body.collideWorldBounds = true;
		car3.body.collideWorldBounds = true;
		car4.body.collideWorldBounds = true;
		car5.body.collideWorldBounds = true;
		
		
		cursors = game.input.keyboard.createCursorKeys();
		jump = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    }
    
    function update() {
		carOn = false;
		if(car.body.y < 10){
			car.body.y = 20;
			}
		
		game.camera.x = car.body.x - 150;
		car2.body.velocity.x = 50 * (seventh +1);
		car3.body.velocity.x = 50 * (seventh +2);
		car4.body.velocity.x = 50 * (seventh +3);
		car5.body.velocity.x = 50 * (seventh +4);
		if (!carswitch){
			car4.body.velocity.y = -100;
			}
		if (car.body.x > car2.body.x + 1500){
			car2.loadTexture('carsprite2');
			car2.body.x = car.body.x + 1500;
			if (seventh == 7){
				car2.kill();
				}
			}
		if (car.body.x > car3.body.x + 1500){
		car3.loadTexture('carsprite2');
			car3.body.x = car.body.x + 1500 + ( 75 * seventh +1);;
			car3.body.velocity.x += 100;
			if (seventh == 7){
				car3.kill();
				}
			}
		if (car.body.x > car4.body.x + 1500){
		car4.loadTexture('carsprite2');
			car4.body.x = car.body.x + 1500 + ( 100 * seventh +1);
			third +=1;
			seventh+=1;
			if (third = 3){
				car4.body.y += 1000;
				car4.body.velocity.y -= 400;
			}
			if (seventh == 7){
				car4.kill();
				}
			carswitch = false;
			}
		if (car.body.x > car5.body.x + 1500){
		car5.loadTexture('carsprite2');
			car5.body.x = car5.body.x + 2500;
			car5.body.y -=250;
			car5.body.velocity.y += 200;
			if (seventh == 7){
				car5.kill();
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
		if (car.body.velocity.x < 0 && cursors.left.isDown && car.body.velocity.x > -1500){
			car.body.velocity.x *= 1.1;
			if (car.body.velocity.y == 0){
			}
			}
		if (car.body.velocity.x < 0 && !cursors.left.isDown){
			car.body.velocity.x *= 0.95;
			if (car.body.velocity.y == 0){
			}
			}
		
		if (car.body.velocity.x > 0 && cursors.right.isDown && car.body.velocity.x < 1500){
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
			carOn = true;
			}
		if (car3.body.touching.up){
			car3.loadTexture('carWrecked');
			carOn = true;
			}
		if (car5.body.touching.up){
			car5.loadTexture('carWrecked');
			carOn = true;
		}
		if (car4.body.touching.up){
			car4.loadTexture('carWrecked');
			carOn = true;
		}
		if (carOn){
			car.body.y -=10;
			}
			// starting a jump
		if (jump.isDown && car.body.onFloor() || jump.isDown && car.body.touching.down)
    {
        car.body.velocity.y = -950;
    }
		if (!car.body.onFloor()){
			car.body.velocity.y +=1;
			if (car.body.velocity.y > 0){
			car.body.velocity.y *= 1.1;}
			}
		}
    }
