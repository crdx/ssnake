(function() {
   var BLOCK_WIDTH = 20; // size of each snake block
   var CANVAS_SIZE = 600; // size of the canvas
   var TIMER_DELAY = 50; // timer delay
   var GROW_BY = 10; // number of new blocks to add when snake grows

   var LEFT = 37;
   var RIGHT = 39;
   var DOWN = 40;
   var UP = 38;
   var MAX_BLOCKS = CANVAS_SIZE / BLOCK_WIDTH;

   // initial snake position
   var snakeX = [5, 6, 7, 8, 9, 10]; 
   var snakeY = [5, 5, 5, 5, 5, 5];

   // initial direction
   var chosenDirection = RIGHT; 
   
   // initial food position
   var foodX = 15; 
   var foodY = 12;

   var ctx;
   var currentDirection;
   var isPlaying = false;
   var gameOver = false;
   var blocksToAdd = 0;
   var currentScore = 0;

   window.addEventListener("load", init);
   
   function init() {
      var canvas = document.createElement("canvas");
      canvas.width = CANVAS_SIZE;
      canvas.height = CANVAS_SIZE;

      var game = document.getElementById("game");
      game.appendChild(canvas);

      ctx = canvas.getContext("2d");

      window.addEventListener("keydown", onKeyDown);
      
      showStats("Score: " + currentScore + ". Press an arrow key to begin.");
      
      drawCanvas();
   }

   function clearCanvas() {
      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
   }

   function addFood() {
      var success;

      // give up if we haven't got a new position after 300 tries
      var retry = 300; 

      do
      {
         var x = parseInt(Math.random() * MAX_BLOCKS) + 1;
         var y = parseInt(Math.random() * MAX_BLOCKS) + 1;

         success = true;

         for (var i = 0; i < snakeX.length; i++)
            if (snakeX[i] == x && snakeY[i] == y)
               success = false;

      } while (!success && --retry >= 0);

      foodX = x;
      foodY = y;

      drawBlock(foodX, foodY, getRandomColour());
   }

   function drawBlock(x, y, colour) {
      var rx = (x - 1) * BLOCK_WIDTH;
      var ry = (y - 1) * BLOCK_WIDTH;

      ctx.fillStyle = colour;
      ctx.fillRect(rx, ry, BLOCK_WIDTH, BLOCK_WIDTH);
   }

   function frameTimer() {
      if (isPlaying)
      {
         if (handleFrame())
         {
            setTimeout(frameTimer, TIMER_DELAY);
            clearCanvas();
            drawCanvas();
         }
         else
         {
            gameOver = true;
            showStats("Oops. Score: " + currentScore);
         }
      }
   }

   function hasCollided(x, y, ax, ay) {
      if (x < 1 || x > MAX_BLOCKS || y < 1 || y > MAX_BLOCKS)
         return true;

      for (var i = 0; i < ax.length - 1; i++)
         if (x == ax[i] && y == ay[i])
            return true;

      return false;
   }

   function handleFrame() {
      // if there are tails to be added on...
      if (blocksToAdd > 0)
      {
         snakeX.unshift(snakeX[0]);
         snakeY.unshift(snakeY[0]);
         blocksToAdd--;
      }

      for (var i = 0; i < snakeX.length; i++)
      {
         // update each position with the one before it
         if (i < snakeX.length - 1)
         {
            snakeX[i] = snakeX[i + 1];
            snakeY[i] = snakeY[i + 1];
         }
         // update the final block (front) which needs to go in the new direction
         else
         {
            if (chosenDirection == RIGHT)
            {
               if (currentDirection == LEFT)
                  snakeX[i]--;
               else
               {
                  snakeX[i]++;
                  currentDirection = chosenDirection;
               }
            }

            if (chosenDirection == LEFT)
            {
               if (currentDirection == RIGHT)
                  snakeX[i]++;
               else
               {
                  snakeX[i]--;
                  currentDirection = chosenDirection;
               }
            }

            if (chosenDirection == UP)
            {
               if (currentDirection == DOWN)
                  snakeY[i]++;
               else
               {
                  snakeY[i]--;
                  currentDirection = chosenDirection;
               }
            }

            if (chosenDirection == DOWN)
            {
               if (currentDirection == UP)
                  snakeY[i]--;
               else
               {
                  snakeY[i]++;
                  currentDirection = chosenDirection;
               }
            }

            // check if the new position collides with the snake or walls
            if (hasCollided(snakeX[i], snakeY[i], snakeX, snakeY)) 
               return 0;

            // see if we hit food
            if (snakeX[i] == foodX && snakeY[i] == foodY)
            {
               currentScore++;
               // add new snake blocks
               blocksToAdd = GROW_BY; 
               addFood();
            }

            showStats("Score: " + currentScore);
         }

      }
      return 1;
   }

   function getRandomColour() {
      return "#" + decToHex(parseInt(Math.random() * 255)) + decToHex(parseInt(Math.random() * 255)) + decToHex(parseInt(Math.random() * 255));
   }

   function decToHex(dec) {
      var hex = parseInt(dec, 10).toString(16);

      if (hex.length != 2)
         hex = "0" + hex;

      return hex;
   }

   function drawCanvas() {
      // draw the snake
      for (var i = 0; i < snakeX.length; i++)
         drawBlock(snakeX[i], snakeY[i], getRandomColour());

      // draw the food
      drawBlock(foodX, foodY, getRandomColour());
   }

   function onKeyDown(e) {
      if (isPlaying)
         chosenDirection = e.which;
      else if (!gameOver)
      {
         isPlaying = true;
         chosenDirection = (e.which == RIGHT || e.which == DOWN) ? e.which : RIGHT;
         frameTimer();
      }
   }

   function showStats(str) {
      document.getElementById("stats").innerHTML = str;
   }
})();
