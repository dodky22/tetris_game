document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid"),
    scoreDisplay = document.querySelector("#score"),
    startBtn = document.querySelector("#start-button"),
    width = 10,
    //farby jednotlivych tetromin
    colors = [
      "url(imgs/peach_block.png)",
      "url(imgs/pink_block.png)",
      "url(imgs/purple_block.png)",
      "url(imgs/green_block.png)",
      "url(imgs/blue_block.png)",
      
    ];
  const modalScore = document.querySelector("#modal-score");
  const modalResult = document.querySelector("#modal-result");
  let leftControl = document.querySelector("#left");
  let rightControl = document.querySelector("#right");
  let upControl = document.querySelector("#up");
  let downControl = document.querySelector("#bot");
  let spacebar = document.querySelector("#spacebar");
  const easy = document.querySelector("#easy"),
    medium = document.querySelector("#medium"),
    hard = document.querySelector("#hard"),
    extreme = document.querySelector("#extreme");
  const closeTutBtn = document.getElementById("start-modal-close");
  const tut = document.getElementById("start-modal");
  const hamburger = document.getElementById("hamburger");
  let squares = Array.from(document.querySelectorAll(".grid div")),
    nextRandom = 0,
    timerId,
    score = 0;
  //jednotlive tvary width je 10 pretoze mame 10 divov v jednom riadku
  const lTetrominos = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ];

  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
  ];

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
  ];

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ];
  //pole poli
  const Tetrominoes = [
    lTetrominos,
    zTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
  ];

  //random vyber tetromina
  let random = Math.floor(Math.random() * Tetrominoes.length);
  //zacneme na pozicii 4 mozme neskor zmenit   ...teda v strede
  let currentPosition = 4,
    currentRotation = 0,
    //aktualne tetromino je tetromino random so zaciatocnou rotaciou
    current = Tetrominoes[random][currentRotation]; //prvy l tetromino

  //nakreslit prvu rotaaciu tetromina
  function draw() {
    //pre kazdy index z aktualneho tetromina pridam do divov s danym indexom class a bg
    current.forEach((index) => {
      squares[currentPosition + index].classList.add("tetromino");
      squares[currentPosition + index].style.backgroundImage = colors[random]
      
    });
  }
  //odkreslit tetromino...potrebne ked sa budeme chciet hybat atd lebo ho nakreslime na novom mieste
  function undraw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove("tetromino");
      squares[currentPosition + index].style.backgroundImage = "";
      squares[currentPosition + index].style.boxShadow= "none"
    });
  }

  //control ked stlacim sipky
  function control(e) {
    //lava sipka
    if (e.keyCode === 37) {   
      moveLeft();
      leftControl.classList.add("active")
      //hore sipka
    } else if (e.keyCode === 38) {
      rotate();
      upControl.classList.add("active")
      //prava sipka
    } else if (e.keyCode === 39) {
      moveRight();
      rightControl.classList.add("active")
      //dole sipka
    } else if (e.keyCode === 40) {
      moveDown();
      downControl.classList.add("active")
    }
  }

  //control na keyup aby zmazal classu active
  function controlUp(e) {
    //lava sipka
    if (e.keyCode === 37) {   
      leftControl.classList.remove("active")
      //hore sipka
    } else if (e.keyCode === 38) {
      upControl.classList.remove("active")
      //prava sipka
    } else if (e.keyCode === 39) {
      rightControl.classList.remove("active")

      //dole sipka
    } else if (e.keyCode === 40) {
      downControl.classList.remove("active")

    }
  }


  function clickControl (e) {
    let id = e.target.id;
    if (id === "left") {
      moveLeft();
    }else if (id === "right") {
      moveRight();
    }else if (id === "up") {
      rotate();
    }else if (id === "bot") {
      moveDown();
    }
    console.log(e.target.id);
  }


    
  
  //hybem sa dole... chcem najprv odkreslit a posunut dole teda o celu sirku a nakreslit
  function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    //zmrazi tetromino ak narazi na dolnu hranicu alebo ine tetromino
    freeze();
  }

  //zastavi tetromino na spodku alebo na inom tetromine
  function freeze() {
    //ak niektory z divov aktualneho tetromina + width (teda sledujeme jeden pohyb dolu do predu)
    //obsahuje class taken tak...
    if (
      current.some((index) =>
        squares[currentPosition + index + width].classList.contains("taken")
      )
    ) {
      //...tak pre kazdy div z aktualneho pridam class taken
      current.forEach((index) =>
        squares[currentPosition + index].classList.add("taken")
      );
      //next random je na zaciatku 0, viem predpovedat dalsie tetromino
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * Tetrominoes.length);
      //nastavim opet nove current tetromino a jeho position a nakreslim ho
      current = Tetrominoes[random][currentRotation];
      currentPosition = 4;
      draw();
      //zobrazi nasledujuce tetromino
      displayShape();
      //prida score
      addScore();
      //skonci hru
      gameOver();
    }
  }

  //phyb dolava pokym nesom na rohu alebo pri inom tetromine
  function moveLeft() {
    undraw(); // najprv odkreslim vsetko
    const isLeftEdge = current.some(
      (index) => (currentPosition + index) % width === 0
    ); //ak niektory z indexov tetromina % sirka = 0 tak sme na lavom okraji (10/10 = 0 , 20/20 = 0 and so on)

    if (!isLeftEdge) currentPosition -= 1; // ked nie som na left edge tak sa pohnem o 1 do lava
    if (
      current.some(
        (index) => squares[currentPosition + index].classList.contains("taken") //ak uz tam tetromino je ... ma class taken tak pohne sa o 1 do prava bude to vyzerat ako keby ostalo na mieste
      )
    ) {
      currentPosition += 1;
    }
    draw(); //nakreslim nove tetromino ktore sa pohlo / nepohlo do lava
  }

  //phyb doprava pokym nesom na rohu alebo pri inom tetromine
  function moveRight() {
    undraw(); // najprv odkreslim vsetko
    const isRightEdge = current.some(
      (index) => (currentPosition + index) % width === width - 1
    ); //ak niektory z indexov tetromina % sirka = 9 tak sme na lavom okraji (9/10 = zv 9 , 19/20 = 1 zv 9  and so on)

    if (!isRightEdge) currentPosition += 1; // ked nie som na right edge tak sa pohnem o 1 do prava
    if (
      current.some(
        (index) => squares[currentPosition + index].classList.contains("taken") //ak uz tam tetromino je ... ma class taken tak pohne sa o 1 do lava bude to vyzerat ako keby ostalo na mieste
      )
    ) {
      currentPosition -= 1;
    }
    draw(); //nakreslim nove tetromino ktore sa pohlo / nepohlo do prava
  }

  //rotovanie tetromina
  function rotate() {
    undraw();
    currentRotation++;

    if (currentRotation === current.length) {
      // ake je rotacia 4.. co je nas pocet rotacii tak spet na prvu rotaciu
      currentRotation = 0;
    }

    current = Tetrominoes[random][currentRotation]; //novu rotaciu pridam do current tetromina
    draw();
  }

  //ukaze dalsie nasledujuce tetromino
  const displaySquares = document.querySelectorAll(".mini-grid div"),
    displayWidth = 4, // mini grid je 4*4 preto width je 4
    displayIndex = 1; // na dive s indexom 1 sa zobrazi

  //tetromina bez rotacii lebo ako dalsie nebudem zobrazovat aj s rotaciami
  const nextTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2],
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],
    [1, displayWidth, displayWidth + 1, displayWidth + 2],
    [0, 1, displayWidth, displayWidth + 1],
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1],
  ];

  //display shape
  function displayShape() {
    //pre vsetky divi v mini gride odstranim class tetromino aby som zacal "odznova" a aj color
    displaySquares.forEach((square) => {
      square.classList.remove("tetromino");
      square.style.backgroundImage = "";
    });

    nextTetrominoes[nextRandom].forEach((index) => {
      displaySquares[displayIndex + index].classList.add("tetromino");
      displaySquares[displayIndex + index].style.backgroundImage =
        colors[nextRandom];
    });
  }

  //stop button
  startBtn.addEventListener("click",startGame);
  document.addEventListener("keydown", controlspace);
  document.addEventListener("keyup", controlspaceUp);
  spacebar.addEventListener("click", startGame)

  function startActive(){
    if (startBtn.classList.contains("active")) {
      startBtn.classList.remove("active")
    }else {
      startBtn.classList.add("active")
    }
  }

  function startGame() {
    startActive();
    //ak timer/interval ide tak ho zastavim a nastavim mu null
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
      document.removeEventListener("keydown", control);
      document.removeEventListener("keyup", controlUp);
      document.removeEventListener("click", clickControl);
    } else {
      document.addEventListener("keydown", control);
      document.addEventListener("keyup", controlUp);
      document.addEventListener("click", clickControl);
      if (easy.classList.contains("levels_active_easy")) {
        draw();
        timerId = setInterval(moveDown, 1000);
        displayShape();
      } else if (medium.classList.contains("levels_active_medium")) {
        draw();
        timerId = setInterval(moveDown, 750);
        displayShape();
      } else if (hard.classList.contains("levels_active_hard")) {
        draw();
        timerId = setInterval(moveDown, 500);
        displayShape();
      } else if (extreme.classList.contains("levels_active_extreme")) {
        draw();
        timerId = setInterval(moveDown, 250);
        displayShape();
      } else {
        easy.classList.add("levels_active_easy"); 
        draw();
        timerId = setInterval(moveDown, 500);
        displayShape();
      }
  }
}

function controlspaceUp(e){
  if (e.keyCode === 32) {
      spacebar.classList.remove("active");
  }
}
function controlspace(e){
  if (e.keyCode === 32) {
    startGame();
    spacebar.classList.add("active");
  }
}


  //add score
  function addScore() {
    //v gride je 200 divov s indexmi od 0 - 199, skontrolujem kazdy row
    for (let i = 0; i < 199; i += width) {
      const row = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9,
      ];
      //ak kazdy div v rowe ma class tetromino tak pripocitam skore a odstranim classy a bgcolor
      if (
        row.every((index) => squares[index].classList.contains("tetromino"))
      ) {
        score += 10;
        scoreDisplay.innerHTML = score;
        modalScore.innerHTML = score;
        row.forEach((index) => {
          squares[index].classList.remove("taken");
          squares[index].classList.remove("tetromino");
          squares[index].style.backgroundImage = "";
        });
        //vytvorim pole odstranenych divov
        const squaresRemoved = squares.splice(i, width);
        //pripojim ich na zaciatok squares
        squares = squaresRemoved.concat(squares);
        //a pripojene celly nakreslim do gridu
        squares.forEach((cell) => {
          grid.appendChild(cell);
        });
      }
    }
    //pocita kolko linov sme postavili
    if (score != 0) {
      const displayLines = document.querySelector("#lines");
      displayLines.innerHTML = score / 10;
    }
  }

  //game over
  function gameOver() {
    //ak niektory div aktualneho tetromina obsahuje class taken tak game over
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      modalResult.textContent = "Game Over";
      openModal();

      clearInterval(timerId);
      document.removeEventListener("keydown", control);
      myMusic.pause();
    }
  }

  //nastavenie levelov
  easy.addEventListener("click", () => {
    if (
      medium.classList.contains("levels_active_medium") ||
      hard.classList.contains("levels_active_hard") ||
      extreme.classList.contains("levels_active_extreme")
    ) {
      medium.classList.remove("levels_active_medium");
      hard.classList.remove("levels_active_hard");
      extreme.classList.remove("levels_active_extreme");
    }
    easy.classList.add("levels_active_easy");
    if (timerId) {
      clearInterval(timerId);
      timerId = setInterval(moveDown, 1000);
    }
  });

  medium.addEventListener("click", () => {
    if (
      easy.classList.contains("levels_active_easy") ||
      hard.classList.contains("levels_active_hard") ||
      extreme.classList.contains("levels_active_extreme")
    ) {
      easy.classList.remove("levels_active_easy");
      hard.classList.remove("levels_active_hard");
      extreme.classList.remove("levels_active_extreme");
    }
    medium.classList.add("levels_active_medium");

    if (timerId) {
      clearInterval(timerId);
      timerId = setInterval(moveDown, 750);
    }
  });

  hard.addEventListener("click", () => {
    if (
      medium.classList.contains("levels_active_medium") ||
      easy.classList.contains("levels_active_easy") ||
      extreme.classList.contains("levels_active_extreme")
    ) {
      medium.classList.remove("levels_active_medium");
      easy.classList.remove("levels_active_easy");
      extreme.classList.remove("levels_active_extreme");
    }
    hard.classList.add("levels_active_hard");

    if (timerId) {
      clearInterval(timerId);
      timerId = setInterval(moveDown, 500);
    }
  });

  extreme.addEventListener("click", () => {
    if (
      medium.classList.contains("levels_active_medium") ||
      hard.classList.contains("levels_active_hard") ||
      easy.classList.contains("levels_active_easy")
    ) {
      medium.classList.remove("levels_active_medium");
      hard.classList.remove("levels_active_hard");
      easy.classList.remove("levels_active_easy");
    }
    extreme.classList.add("levels_active_extreme");

    if (timerId) {
      clearInterval(timerId);
      timerId = setInterval(moveDown, 250);
    }
  });

  //hudba on / off
  const myMusic = document.querySelector("#music"),
    playBtn = document.querySelector("#play-music"),
    stopBtn = document.querySelector("#stop-music");

    stopBtn.style.display = "none";

  playBtn.addEventListener("click", () => {
    myMusic.play();
    playBtn.style.display = "none";
    stopBtn.style.display = "block";
  });
  stopBtn.addEventListener("click", () => {
    myMusic.pause();
    stopBtn.style.display = "none";
    playBtn.style.display = "block";
  });

  const closeBtn = document.querySelector(".close");
  const modal = document.querySelector("#my-modal");

  closeBtn.addEventListener("click", closeModal);

  function closeModal() {
    modal.style.display = "none";
  }

  function openModal() {
    modal.style.display = "block";
  }

  closeTutBtn.addEventListener("click", () => {
    tut.style.display = "none";
  })

  hamburger.addEventListener("click", () => {
    tut.style.display = "block";
  })

    });
