window.onload = function() {
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/master/resources/Project%20Templates/Basic
    
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    "use strict";
    
    var game = new Phaser.Game( 1600, 400, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
        // Load an image and call it 'logo'.
        game.load.image( 'logo', 'assets/Dogsmall.png' );
		game.load.image( 'punch', 'assets/punch.png' );
		game.load.image( 'logo2', 'assets/Dogsmall2.png' );
		game.load.image( 'logoL', 'assets/DogsmallLeft.png' );
		game.load.image( 'logo2L', 'assets/Dogsmall2Left.png' );
		game.load.image( 'bg', 'assets/BG2.png' );
		game.load.audio('woof', 'assets/woof.ogg');
		game.load.audio('meow', 'assets/meow.ogg');
    }
    
    var doggy;
	var floor;
	var map;
	var cursors;
	var jump;
	var height = false;
	var jumping = false;
	var woof;
	var meow;
	var jumps = 0;
	var loop = 1;
	var doggy2;
	var punch;
    
    function create() {
	game.add.tileSprite(0, 0, 1600, 400, 'bg');
        // Create a sprite at the center of the screen using the 'logo' image.
        doggy = game.add.sprite( game.world.centerX, game.world.centerY, 'logo' );
		punch = game.add.sprite( game.world.centerX, game.world.centerY, 'punch');
		doggy.width = 200;
		doggy.height = 100;
		punch.width = 20;
		punch.height = 10;
        // so it will be truly centered.
		//doggy.animations.add('logo2', true);
		
        doggy.anchor.setTo( 20, -2 );
		punch.anchor.setTo( 20, -15 )
		
        // Turn on the arcade physics engine for this sprite.
        game.physics.enable( doggy, Phaser.Physics.ARCADE );
		game.physics.enable( punch, Phaser.Physics.ARCADE );
		
		// -----EXPERIMENT-----
		doggy2 = game.add.sprite( game.world.centerX, game.world.centerY, 'logoL' );
		game.physics.enable( doggy2, Phaser.Physics.ARCADE );
		doggy2.body.collideWorldBounds = true;
		doggy2.width = 200;
		doggy2.height = 100;
		doggy2.anchor.setTo( 0, -2 );
		doggy2.body.immovable = false;
		// -----EXPERIMENT OVER-----
		
		
        // Make it bounce off of the world bounds.
        doggy.body.collideWorldBounds = true;
		
		//adding in sound
		woof = game.add.audio('woof');
		woof.allowMultiple = true;
        woof.addMarker('woof1', 0, 1.0);
		meow = game.add.audio('meow');
		meow.allowMultiple = false;
        meow.addMarker('meow1', 0, 1.0);
		
		
        // Add some text using a CSS style.
        var style = { font: "25px Verdana", fill: "#ffffff", align: "center" };
        var text = game.add.text( 75, game.world.centerY, "Hello Dog", style );
		var style = { font: "25px Verdana", fill: "#000000", align: "center" };
		var text2 = game.add.text( 1250, game.world.centerY, "Goodbye Dog", style );
        text.anchor.setTo( 0.5, 0.0 );
		
		//game.camera.bounds = null;
		//game.camera.setSize(800, 400);
		game.camera.follow(doggy);
		
		
		cursors = game.input.keyboard.createCursorKeys();
		jump = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    }
    
    function update() {
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 250 pixels/second and moving no faster than 250 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
        //doggy.rotation = game.physics.arcade.accelerateToPointer( doggy, this.game.input.activePointer, 250, 250, 250 );
		// checking if dog has reached max height, then letting him fall
		if (punch.body.velocity.x == -1200){
			punch.body.velocity.x = doggy.body.velocity.x;
			}
		if(punch.body.velocity.x == 1200){
			punch.body.velocity.x = -1200;
			}
		
		if (doggy2.body.velocity.x = 150){
			doggy2.body.velocity.x = 150;
			}
		if (game.physics.arcade.collide(doggy2, punch)){
			doggy2.body.velocity.x = 150;
			//punch.body.velocity.x = 0;
			}
		doggy2.body.velocity.x = 0;
		if (game.physics.arcade.collide(doggy2, doggy)){
			if (meow.isPlaying == false){
			meow.play('meow1');
			}
			doggy.body.velocity.x = 0;
			doggy2.body.velocity.x = 0;
			}
		
		if (doggy.body.velocity.y == 500)
			{
				height = false;
				doggy.body.velocity.y = 0;
				doggy.loadTexture('logo')
			}
		if (height){
			doggy.body.velocity.y += 25;
			
		}
		// checking if dog is moving left or right, and if the player wants to accelerate
		//if (doggy.body.velocity.x < 0 && cursors.left.isDown && doggy.body.velocity.x > -1200){
		//	doggy.body.velocity.x *= 1.1;
		//	punch.body.velocity.x *= 1.1;
		//	if (doggy.body.velocity.y == 0){
		//	doggy.loadTexture('logoL');
		//	}
		//	}
		//if (doggy.body.velocity.x < 0 && !cursors.left.isDown){
		//	doggy.body.velocity.x *= 0.95;
		//	punch.body.velocity.x *= 0.95;
		//	if (doggy.body.velocity.y == 0){
		//	doggy.loadTexture('logoL');
		//	}
		//	}
		
		//if (doggy.body.velocity.x > 0 && cursors.right.isDown && doggy.body.velocity.x < 1200){
		//doggy.body.velocity.x *= 1.1;
		//punch.body.velocity.x *= 1.1;
		//if (doggy.body.velocity.y == 0){
		//doggy.loadTexture('logo');
		//}
		//}
		//if (doggy.body.velocity.x > 0 && !cursors.right.isDown){
		//	doggy.body.velocity.x *= 0.95;
		//	punch.body.velocity.x *= 0.95;
		//	if (doggy.body.velocity.y == 0){
		//	doggy.loadTexture('logo');
		//	}
		//	}
		if (jumping)
		{
			doggy.body.velocity.y += 25;
			if (doggy.body.velocity.y == 0)
			{
				height = true;
				jumping = false;
			}
		}
		if (cursors.left.isDown && doggy.body.velocity.x >= -50)
		{
			doggy.body.velocity.x =-175;
			punch.body.velocity.x = -175;
			doggy.loadTexture('logoL');
		}
		
		if (cursors.right.isDown && doggy.body.velocity.x <= 50)
		{
			doggy.body.velocity.x=175;
			punch.body.velocity.x = 175;
			doggy.loadTexture('logo');
		}
		// starting a jump
		if (jump.isDown && height == false && doggy.body.velocity.y == 0){
			doggy.body.velocity.y = -500;
			punch.body.velocity.x = 1200;
			jumping = true;
			jumps+= 1;
			//if (jumps%3 == 0){
			//meow.play('meow1');
			//}
			//else{
			woof.play('woof1');
			//}
			if (doggy.body.velocity.x < 0){
				doggy.loadTexture('logo2L');
				}
				else{
			doggy.loadTexture('logo2');
			}
			}
    }
};
