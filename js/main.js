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
    
    var game = new Phaser.Game( 1200, 600, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update} );
    
    function preload() {
        // Load an image and call it 'kitty'.
        //game.load.image( 'kitty', 'assets/Dogsmall.png' );
		game.load.image( 'punch', 'assets/punch2.png' );
		game.load.spritesheet('cats', 'assets/catsheet2.png', 362, 400);
		game.load.image( 'logo2', 'assets/Dogsmall2.png' );
		game.load.image( 'logoL', 'assets/DogsmallLeft.png' );
		game.load.image( 'logo2L', 'assets/Dogsmall2Left.png' );
		game.load.image( 'bg', 'assets/cfkbg.png' );
		game.load.audio('woof', 'assets/woof.ogg');
		game.load.audio('fight', 'assets/Super Mario World Ending.ogg');
		game.load.audio('victory', 'assets/win.ogg');
		game.load.audio('loss', 'assets/lose.ogg');
		game.load.audio('meow', 'assets/meow.ogg');
		game.load.image('kitty', 'assets/cat.png');
		game.load.image('kitty2', 'assets/cat2.png');
		game.load.image('kittyG', 'assets/catguard.png');
		game.load.spritesheet('dogs', 'assets/DogsmallLeftsheet.png', 82, 68);
    }
    
	var text;
	var music;
	var punchstart = 0;
    var kitty;
	var floor;
	var map;
	var cursors;
	var out;
	var punching;
	var height = false;
	var jumping = false;
	var woof;
	var meow;
	var jumps = 0;
	var loop = 1;
	var doggy2;
	var punch;
	var knockback = 0;
	var kitty;
	var currentxpos;
	var blocking = false;
	var canBlock = true;
	var hit = false;
	var blocked = false;
	var win;
	var lose;
	var winfight = false;
	var losefight= false;
	
	var recede = 0;
	var health = 5;
	var healthE = 2;
	var stamina = 5;
	var cooldown = 0;
    
    function create() {
		game.add.tileSprite(0, 0, 1600, 600, 'bg');
        // Create a sprite at the center of the screen using the 'kitty' image.
		 game.world.setBounds(0, 0, 1600, 600);
		 music = game.add.audio('fight',0.3,true);
		 win = game.add.audio('victory');
		 lose = game.add.audio('loss');

		music.play();
        kitty = game.add.sprite( game.world.centerX, game.world.centerY, 'cats' );
		punch = game.add.sprite( game.world.centerX, game.world.centerY);
		//kitty.body.collideWorldBounds = true;
		kitty.width = 300;
		
		kitty.height = 300;
		punch.width = 300;
		
		punch.height = 300;
		kitty.animations.add('walk', [0,1,2],6,true);
		kitty.animations.add('guard', [3],10,true);
		kitty.animations.add('punch', [2,1,4],7,true);
		kitty.animations.add('stand', [0],1,true);
		kitty.animations.play('walk');
		//kitty.body.width = 200;
        // so it will be truly centered.
		//kitty.animations.add('logo2', true);
		
        kitty.anchor.setTo( 20, -6 );
		punch.anchor.setTo( 20, -25 );
		
		
        // Turn on the arcade physics engine for this sprite.
        game.physics.enable( kitty, Phaser.Physics.ARCADE );
		game.physics.enable( punch, Phaser.Physics.ARCADE );
		
		// -----EXPERIMENT-----
		doggy2 = game.add.sprite( game.world.centerX, game.world.centerY, 'dogs' );
		game.physics.enable( doggy2, Phaser.Physics.ARCADE );
		doggy2.body.collideWorldBounds = true;
		doggy2.width = 400;
		doggy2.height = 200;
		doggy2.anchor.setTo( -2, -2 );
		doggy2.body.immovable = false;
		doggy2.animations.add('walkd', [0,1, 2], 4,true);
		// -----EXPERIMENT OVER-----
		
		
        // Make it bounce off of the world bounds.
        kitty.body.collideWorldBounds = true;
		punch.body.collideWorldBounds = true;
		
		//adding in sound
		woof = game.add.audio('woof');
		woof.allowMultiple = true;
        woof.addMarker('woof1', 0, 1.0);
		meow = game.add.audio('meow');
		meow.allowMultiple = false;
        meow.addMarker('meow1', 0, 1.0);
		
		
        // Add some text using a CSS style.
        var style = { font: "35px Verdana", fill: "#aaaaaa", align: "center" };
        
		text = game.add.text( 25, 25, "Health:" + health +"\n" + "Stamina:" + stamina, style );
		text.fixedToCamera = true;
		text.inputEnabled = true;
		var controlsText = game.add.text( 900, 25, "Down: block \n Space: Punch", style );
		text.fixedToCamera = true;
		text.inputEnabled = true;
		
		
		cursors = game.input.keyboard.createCursorKeys();
		out = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		punching = 0;
		doggy2.animations.play('walkd');
    }
	
    
    function update() {
		
		if (punching > 0){
			kitty.body.x += 5;
			punch.body.x += 5;
		}
		else if (cooldown > 0){
			kitty.body.x -= 5;
			punch.body.x -= 5;
		}
		if (punching == 0 && cursors.down.isDown == false && kitty.body.velocity.x !=0){
			kitty.animations.play('walk');
		}
		else if(punching == 0 && cursors.down.isDown == false && kitty.body.velocity.x ==0){
			kitty.animations.play('stand');
			}
		game.camera.focusOnXY(kitty.body.x +400, kitty.body.y);
		//text.setText ("Health:" + health +"\n" + "Stamina:" + stamina);
		updateText();
		// HIT DETECTION
		if (cooldown > 0){
			cooldown-=1;
		}
		if ( punching > 0 && game.physics.arcade.collide(punch, doggy2)){
			healthE +=1;
			if(healthE == 8){
				doggy2.kill();
				win.play();
				winfight = true;
			}
			doggy2.body.immovable = false;
			hit = true;
			if (woof.isPlaying == false){
				woof.play('woof1');
			}
			knockback += 1;
		}
		if (knockback > 0){
			if (knockback != 5){
			//punch.body.velocity.x = 1000;
				knockback +=1;
				}
			else {
				knockback = 0;
				doggy2.body.velocity.x = 0;
				}
			}
		
			//if cat successfully hit dog
		if (blocking == false && game.physics.arcade.collide(kitty, doggy2)){
			health -=1;
			if (health <1){
				kitty.kill();
				punch.kill();
				lose.play();
				losefight = true;
			}
			kitty.body.x -=120 * healthE;
			punch.body.x -=120 * healthE;
		}
		
		if (hit){
				doggy2.body.velocity.x = 2000;
				recede +=1;
			if (recede == 15){
				hit = false;
				recede = 0;
			}
		}
		else{
			doggy2.body.velocity.x = -150 * healthE;
			}
		// BLOCKING
		if (cursors.down.isDown && punching == 0 && stamina > 0){
			kitty.animations.play('guard');
			blocking = true;
			kitty.body.velocity.x = 0;
			punch.body.x = kitty.body.x;
			}
			// block hit
		if ( blocking && game.physics.arcade.collide(punch, doggy2)){
			kitty.body.x -= 50 * healthE;
			punch.body.x -= 50 * healthE;
			if (stamina < 1){
				health -= 1;
				}
			stamina -=1;
			//kitty.loadTexture('kitty');
			blocked = true;
			}
		if (kitty.body.velocity.x != 0 ) {
			blocking = false;
			}
		if (punching > 0){
			doggy2.body.immovable = false;
			kitty.body.velocity.x = 0;
			}
		
		
		if (cursors.down.isDown == false){
			//kitty.animations.play('cats');
			//kitty.loadTexture('kitty');
			if (cursors.left.isDown && punching == 0){
				kitty.body.velocity.x  =-200;
				punch.body.velocity.x  =-200;
				}
				
				
			else if (cursors.right.isDown && punching == 0){
				kitty.body.velocity.x = 800;
				punch.body.velocity.x = 800;
				}
				else{
				kitty.body.velocity.x = 0;
				punch.body.velocity.x = 0;
				}
			}
			
			// PUNCHING
			if (out.isDown && punching ==0 && cooldown == 0){
				blocking = false;
				punch.body.velocity.x += 500;
				punching +=1;
				if (meow.isPlaying == false){
					meow.play('meow1');
				}
				
			}
		
			if (punching>0){
			//kitty.loadTexture('kitty2',false);
			kitty.animations.play('punch',false);
			punching += 1;
				if (punching == 25){
					punching = 0;
					punch.body.velocity.x = 0;
					punch.body.x = kitty.body.x;
					//kitty.loadTexture('kitty');
					cooldown = 20;
					}
				else{
					//punching +=1;
					//currentxpos = kitty.body.x;
					//kitty.body.width = 250;
					//kitty.loadTexture('kitty2');
					//kitty.body.x = currentxpos;
					}
				}
			
		}
		function updateText(){
			text.setText ("Health:" + health +"\n" + "Stamina:" + stamina);
			if (winfight || losefight){
				text.setText("KO");
				text.height += 25;
				text.width += 25;
				}
			
			}
		
	}