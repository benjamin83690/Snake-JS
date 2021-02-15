window.onload = () => {

	const canvasWidth = 900;
	const canvasHeight = 600;
	const centreX = canvasWidth / 2;
    const centreY = canvasHeight / 2;
	const blockSize = 30;	
	const delay = 100;
	const widthInBlocks = canvasWidth/blockSize;
	const heightInBlocks = canvasHeight/blockSize;
	const radius = blockSize / 2;
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	let snakee;
	let applee;
	let score = 0;
	let timeout;
	let isGameOver = false;
	// let isStarted = false;
	let isSwitchingDirection = false;
	let scoreP = document.getElementById('scoreP');
	let pseudo = "";
	let ecrirePseudo = document.getElementById('one');
	let result = JSON.parse(localStorage.getItem('score')) || [];
	window.setTimeout(function() {
	  	pseudo = prompt('entrez votre pseudo');
		  ecrirePseudo.className = 'white';
		  if (pseudo !== null) {
			ecrirePseudo.innerHTML = '<span class="vert">*</span>' + ' Bienvenue' + " " + pseudo + '<span class="vert"> *</span>';  
		  } else {
			  pseudo = "";
			ecrirePseudo.innerHTML = '<span class="vert">*</span>' + ' Bienvenue' + '<span class="vert"> *</span>'; 
		  }
	}, 500);


	const init = () => {

		canvas.width = canvasWidth;
		canvas.height = canvasHeight;
		canvas.style.border = "8px solid #444";
		canvas.style.display = "block";
		canvas.style.margin = "20px auto";
		canvas.style.backgroundColor = "#ddd";
		canvas.style.borderRadius = "10px";
		document.body.appendChild(canvas);
		ctx.textBaseline = "middle";
		ctx.fillStyle = "#fff";
		ctx.textAlign = "center";
		ctx.font = "bolder 100px sans-serif";
		ctx.strokeStyle = "#444";
		ctx.lineWidth = 10;
		ctx.strokeText("SNAKE GAME", centreX, centreY / 2);
		ctx.fillText("SNAKE GAME", centreX, centreY / 2);
		ctx.textBaseline = "middle";
		ctx.fillStyle = "gray";
		ctx.font = "bolder 50px sans-serif";
		ctx.strokeStyle = "#444";
		ctx.lineWidth = 6;
		ctx.strokeText("Appuyez sur espace pour jouer!", centreX, centreY);
		ctx.fillText("Appuyez sur espace pour jouer!", centreX, centreY);
		ctx.fillStyle = "#FF3333";		
		ctx.fillRect(180, canvasHeight - 120, 300, 30);
		ctx.fillStyle = "#33CC33";
		ctx.strokeStyle = "green";
		ctx.lineWidth = 2;
		radius;
		ctx.arc(550, canvasHeight - 105, radius, 0, Math.PI * 2, true);
		ctx.stroke();
		ctx.fill();
		snakee = new Snake([[6,4], [5,4], [4,4]], "right");
		applee = new Apple([10, 10]);
		ctx.restore();
	}

	const refreshCanvas = () => {

		snakee.advance();
		if (snakee.chechCollision()) {

			gameOver();

		} else {

			if (snakee.isEatingApple(applee)) {
				
				snakee.ateApple = true;
				score +=10;

				do{
					applee.setNewposition();
				} while(applee.isOnSnake(snakee))
			};
			
			ctx.clearRect(0, 0, canvasWidth, canvasHeight);
			drawScore();
			snakee.draw();
			snakee.drawB();
			applee.draw();		
			timeout = setTimeout(refreshCanvas, delay);
			isSwitchingDirection = false;		
			scoreP.className = 'hidden';
			ecrirePseudo.className = 'hidden';
		};
	}

	const gameOver = () => {

		ctx.save();
		isGameOver = true;
		ctx.font = 'bold 65px serif';
		ctx.fillStyle = "#444";
		ctx.textAlign = 'center';
		ctx.strokeStyle = "white";
		ctx.lineWidth = 3;
		ctx.strokeText("Game Over !", centreX , centreY - 80)
		ctx.fillText("Game Over !", centreX , centreY - 80);
		ctx.font = '40px serif';
		ctx.strokeText("Appuyer sur la touche espace pour rejouer", centreX , centreY - 35);
		ctx.fillText("Appuyer sur la touche espace pour rejouer", centreX , centreY - 35);
		drawScore();	
		document.body.appendChild(scoreP);
		if (score > 0 && score <= 100) {
			ecrirePseudo.className = 'active';
			ecrirePseudo.className = 'white';
			ecrirePseudo.innerHTML = "Peu mieux faire.. " + pseudo + " !";
			scoreP.className = 'active';
		} else if (score > 100 && score <= 500) {
			ecrirePseudo.className = 'active';
			ecrirePseudo.className = 'white';
			ecrirePseudo.innerHTML = "Pas mal " + pseudo + " !";
			scoreP.className = 'active';
		} else if (score > 500 && score <= 1000) {
			ecrirePseudo.className = 'active';
			ecrirePseudo.className = 'white';
			ecrirePseudo.innerHTML = "T'es un vrai chef " + pseudo + " !";
			scoreP.className = 'active';
		} else if (score > 1000) {
			ecrirePseudo.className = 'active';
			ecrirePseudo.className = 'white';
			ecrirePseudo.innerHTML = "Tu es imbattable " + pseudo + " !";
			scoreP.className = 'active';
		} else{
			scoreP.className = 'hidden';
			ecrirePseudo.className = 'active';
			ecrirePseudo.className = 'white';
			ecrirePseudo.innerHTML = "C'est décevant... " + pseudo + " !";
		}
		scoreP.innerHTML = "Your Best Score =" + " " + score + " pts";
		saveScore();
		ctx.restore();				
	}

	const saveScore = () => {
		result.push(score);
		localStorage.setItem('score', JSON.stringify(result));
		let ref =  result[0];		
		for (let i = 1; i < result.length; i++) {
			if (ref > result[i]) {
				scoreP.innerHTML = "Your Best Score =" + " " + ref + " pts";
				if (ref > score) {
					result.pop();
				}							
			} else {
				ref = result[i];
				scoreP.innerHTML = "Your Best Score =" + " " + result[i] + " pts";
				let indexResult = result.indexOf(ref);
				result = result.slice(indexResult);							
			}			
		}
	}

	const restart = () => {
		score = 0;
		isGameOver = false;
		snakee = new Snake([[6,4], [5,4], [4,4]], "right");
		applee = new Apple([10, 10]);			
		clearTimeout(timeout);
		refreshCanvas();		
	}

	const drawScore = () => {
		ctx.save();
		if (isGameOver) {
			ctx.fillStyle = "#ddd";
			ctx.fillRect(0, canvasHeight - 43, canvasWidth, 60);
			ctx.font = 'bold 70px serif';
			ctx.fillStyle = "gray";
			ctx.strokeStyle = "white";
			ctx.lineWidth = 2;
			ctx.strokeText("Score =" + " " + " " + score, centreX , centreY + 160);
			ctx.fillText("Score =" + " " + " " + score, centreX , centreY + 160);
		} else {
			ctx.textAlign = "left";
			ctx.font = "bold 25px serif";
			ctx.fillStyle = "#DDD";
			ctx.strokeStyle = "white";
			ctx.textBaseline = "middle";
			ctx.fillStyle = "gray";
			ctx.lineWidth = 2;
			ctx.strokeText(score + " pts", 15, canvasHeight - 30);
			ctx.fillText(score + " pts", 15, canvasHeight - 30);
		}		
		ctx.restore();
	}

	const drawBlock = (ctx, position) => {

		let x = position[0] * blockSize;
		let y = position[1] * blockSize;
		ctx.fillRect(x, y, blockSize, blockSize);
		ctx.fillStyle = "#333";
	}

	const drawBorder = (ctx, position) => {

		let x = position[0] * blockSize;
		let y = position[1] * blockSize;
		ctx.strokeRect(x, y, blockSize, blockSize);
		ctx.strokeStyle = "#fff";
	}

	class Snake {

		constructor(body, direction){
			this.body = body;
			this.direction = direction;
			this.ateApple = false;
		}
		
		draw() {
			ctx.save();
			ctx.fillStyle = "#ff3333";
			ctx.strokeStyle = "#ddd";
			ctx.lineWidth = 1;
			ctx.shadowColor = '#999';
			ctx.shadowBlur = 2;						
			for (let i = 0; i < this.body.length; i++) {
				drawBlock(ctx, this.body[i]);
				drawBorder(ctx, this.body[i]);
			};
			ctx.restore();
		};

		drawB() {
			ctx.save();
			ctx.strokeStyle = "#ddd";
			ctx.lineWidth = 1;
			ctx.shadowColor = '#444';
			ctx.shadowBlur = 2;
			for (let i = 0; i < this.body.length; i++) {		
				drawBorder(ctx, this.body[i]);
			};
			ctx.restore();
		};

		advance() {

			const nextPosition = this.body[0].slice();
			switch(this.direction) {
				case "left":
					nextPosition[0] --;
					break;

				case "right":
					nextPosition[0] ++;
					break;

				case "down":
					nextPosition[1] ++;
					break;

				case "up":
					nextPosition[1] --;
					break;

				default:
					throw("invalid direction");
			}
			this.body.unshift(nextPosition);
			if (!this.ateApple)
				this.body.pop();
			else
				this.ateApple = false;
		};

		setDirection(newDirection) {
			
			let allowedDirections;
			switch(this.direction) {
				case "left":
				case "right":
					allowedDirections = ["up", "down"];
					isSwitchingDirection = true;
					break;

				case "down":
				case "up":
					allowedDirections = ["left", "right"];
					isSwitchingDirection = true;
					break;

				default:
					isSwitchingDirection = false;
					throw("invalid direction");
			};

			if (allowedDirections.indexOf(newDirection) > -1) {

				this.direction = newDirection;
			};
		};

		chechCollision() {

			let wallCollision = false;
			let snakeCollision = false;
			const head = this.body[0];
			const rest = this.body.slice(1);
			const snakeX = head[0];
			const snakeY = head[1];
			const minX = 0;
			const minY = 0;
			const maxX = widthInBlocks - 1;
			const maxY = heightInBlocks - 1;
			const isNotbetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
			const isNotbetweenVerticalWalls = snakeY < minY || snakeY > maxY;

			if (isNotbetweenHorizontalWalls || isNotbetweenVerticalWalls) {

				wallCollision = true;
			};

			for (let i = 0; i < rest.length; i++) {
				if (snakeX === rest[i][0] && snakeY === rest[i][1]) {

					snakeCollision = true;
				};
			};
			return wallCollision || snakeCollision;
		};

		isEatingApple(appleToEat) {

			const head = this.body[0];
			if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
				return true;
			else
				return false;			
		};

	}

	class Apple {

		constructor(position) {
			this.position = position;
		};
		
		draw() {

			ctx.save();
			ctx.fillStyle = "#33cc33";
			ctx.strokeStyle = "green";
			ctx.lineWidth = 1;
			ctx.shadowColor = '#999';
			ctx.shadowBlur = 5;
			ctx.beginPath();
			radius;
			let x = this.position [0] * blockSize + radius;
			let y = this.position [1] * blockSize + radius;
			ctx.arc(x, y, radius, 0, Math.PI*2, true);
			ctx.fill();
			ctx.stroke();
			ctx.restore();			
		};

		setNewposition() {

			let newX = Math.round(Math.random() * (widthInBlocks -1));
			let newY = Math.round(Math.random() * (heightInBlocks -1));
			this.position = [newX, newY];
		};

		isOnSnake(snakeToCheck) {

			let isOnSnake = false;
			for (let i = 0; i < snakeToCheck.body.length; i++) {				
				if (this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]) {
					isOnSnake = true;
				};
			};
			return isOnSnake;
		};
	}

	document.onkeydown = (e) => {

		const key = e.keyCode;
		let newDirection;
		switch(key) {

			case 81:
			case 37:
				newDirection = "left";
				break;

			case 90:
			case 38:
				newDirection = "up";
				break;

			case 68:
			case 39:
				newDirection = "right";
				break;

			case 83:
			case 40:
				newDirection = "down";
				break;
			case 32:
				restart();
			    // if (!isStarted) {
			    //     refreshCanvas();
			    //     isStarted = true;
			    // } else {
			    //     restart();
			    //     return;
			    // }			    
			default:
			    return;
		};
		if (!isSwitchingDirection) {
			snakee.setDirection(newDirection);
		}
	}
	init();
}