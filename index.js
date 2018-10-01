//Html Variables
const speedDash = document.querySelector('.speedDash');
const scoreDash = document.querySelector('.scoreDash');
const lifeDash = document.querySelector('.lifeDash');
const container = document.getElementById('container');
const btnStart = document.querySelector('.btnStart');
//Event Listeners
btnStart.addEventListener('click', startGame);
document.addEventListener('keydown', pressKeyOn);
document.addEventListener('keyup', pressKeyOff);
//Game Variables
let animationGame;
let gamePlay = false;
let player;
let keys = {
    ArrowUp:false,
    ArrowDown:false,
    ArrowLeft: false,
    ArrowRight: false,
};

function collide(a, b) {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();
    return!(
        (aRect.bottom < bRect.top) || (aRect.top > bRect.bottom) ||
        (aRect.right < bRect.left) || (aRect.left > bRect.right)
    )

}

function gameOver() {
    let div = document.createElement('div')
    div.setAttribute('class','road');
    div.style.top = '0px';
    div.style.width = '250px';
    div.style.backgroundColor = 'red';
    div.innerHTML = 'FINISH';
    div.style.fontSize = '3em';
    container.appendChild(div);
    player.game_end_count = 12;
    player.speed = 0;
}

function moveRoad() {
    let tempRoad = document.querySelectorAll('.road');
    //console.log(tempRoad);
    let previousRoad = tempRoad[0].offsetLeft;
    let previousWidth = tempRoad[0].offsetWidth;
    for (let x = 0; x < tempRoad.length; x++){
        let num = tempRoad[x].offsetTop + player.speed;
        if(num > 600){
            num = (num - 655);
            let mover = previousRoad +
                (Math.floor(Math.random() * 6) - 3);
            let roadWidth = (Math.floor(Math.random() * 11) - 5) + previousWidth;
            if(roadWidth < 200){
                roadWidth = 200;
            }
            if (roadWidth > 400){
                roadWidth = 400;
            }
            if (mover < 100){
                mover = 100;
            }
            if (mover > 600){
                mover = 600;
            }
            tempRoad[x].style.left = mover + 'px';
            tempRoad[x].style.top = roadWidth + 'px';
            previousRoad = tempRoad[x].offsetLeft;
            previousWidth = tempRoad[x].offsetWidth;
        }
        tempRoad[x].style.top = num + 'px';
    }
    return {
        'width' : previousWidth,
        'left' : previousRoad,
    };
}

function makeOtherCars(e) {
    let tempRoad = document.querySelector('.road');
    e.style.left = tempRoad.offsetLeft +
        Math.ceil(Math.random() * tempRoad.offsetWidth) - 30 + 'px';
    e.style.top = Math.ceil(Math.random() * - 400) + 'px';
    e.style.backgroundColor = randomColor();
    e.speed = Math.ceil(Math.random() * 17 ) + 2;
}

function moveOtherCars() {
    let tempOtherCar = document.querySelectorAll ('.otherCars')
    for (let x = 0; x < tempOtherCar.length; x++){
        for (let xx = 0; xx < tempOtherCar.length; xx++){
            if (x != xx && collide(tempOtherCar[x],tempOtherCar[xx])){
                tempOtherCar[xx].style.top = (tempOtherCar[xx].offsetTop + 50) + 'px';
                tempOtherCar[x].style.top = (tempOtherCar[x].offsetTop - 50) + 'px';
                tempOtherCar[xx].style.left = (tempOtherCar[xx].offsetLeft - 50) + 'px';
                tempOtherCar[x].style.left = (tempOtherCar[x].offsetLeft + 50) + 'px';
            }
        }
        let y = tempOtherCar[x].offsetTop + player.speed - tempOtherCar[x].speed;
        if(y > 2000 || y < -2000){
            //Reset car
            if (y > 2000){
                player.score++;
                if (player.score > player.car_to_pass) {
                    gameOver();
                }
            }
            makeOtherCars(tempOtherCar[x]);
        }else{
            tempOtherCar[x].style.top = y + 'px';
            let hitCar = collide(tempOtherCar[x],player.element)
            //console.log(hitCar);
            if(hitCar){
                player.speed = 0;
                player.lives--;
                if(player.lives < 1){
                    player.game_end_count = 1;
                }
                makeOtherCars(tempOtherCar[x]);
            }

        }
    }
}

function playGame() {

    //console.log("Starting Game");
    //console.log(gamePlay);
    if(gamePlay){
        updateDash();
        //Movement
        let road = moveRoad();
        moveOtherCars();
        if (keys.ArrowUp){
            //console.log(player.element.y);
            if (player.element.y > 400) {
                player.element.y -= 1;
            }
            player.speed = player.speed < 20 ? (player.speed + 0.05) : 20;
        }
        if (keys.ArrowDown) {
            //console.log(player.element.y);
            if (player.element.y < 500) {
                player.element.y += 1;
            }
            player.speed = player.speed > 0 ? (player.speed - 0.15) : 0;

        }
        if (keys.ArrowLeft) {
            console.log(player.element.x);
            player.element.x -= (player.speed / 4);
        }
        if (keys.ArrowRight) {
            console.log(player.element.x);
            player.element.x += (player.speed / 4);
        }
        if((player.element.x + 20) < road.left ||
            (player.element.x > (road.left + road.width) - 20)) {
            if (player.element.y < 500){
                player.element.y += 1;
            }
            player.speed = player.speed > 0 ? (player.speed - 0.075) : 3;
        }
        //Move Car
        player.element.style.top = player.element.y + 'px';
        player.element.style.left = player.element.x + 'px';
        if(player.game_end_count > 0){
            player.game_end_count--;
            player.y = (player.y > 60) ? player.y -30 : 60;
            if (player.game_end_count == 0){
                gamePlay = false;
                cancelAnimationFrame(animationGame)
                btnStart.style.display = 'block';
            }
        }

    }
    animationGame = requestAnimationFrame(playGame);
}

function pressKeyOff() {
    event.preventDefault();
    //console.log(keys);
    keys[event.key] = false;
}

function pressKeyOn(event) {
    event.preventDefault();
    //console.log(keys);
    keys[event.key] = true;
}

function randomColor() {
    function cnum() {
        let hex = Math.floor(Math.random() * 255).toString(16);
        return ('0' + String(hex)).substr(-2);
    }
    return "#" + cnum()+cnum()+cnum();
}

function setupCars(number) {
    for (let x =0; x < number; x++) {
        let tempCar = 'Car' + (x + 1);
        let div = document.createElement('div');
        div.setAttribute('class', 'otherCars');
        div.setAttribute('id', tempCar);
        makeOtherCars(div);
        container.appendChild(div);
    }
}

function startBoard() {
    for (let x= 0; x < 13; x++){
        let div = document.createElement('div');
        div.setAttribute('class', 'road');
        div.style.top = (x * 50) +'px';
        div.style.width = player.road_width + 'px';
        container.appendChild(div);
    }
}

function startGame() {
    //console.log(gamePlay);
    container.innerHTML = '';
    var div = document.createElement('div');
    btnStart.style.display='none';
    div.setAttribute('class','playerCar');
    div.x = 250;
    div.y = 500;
    container.appendChild(div);
    gamePlay = true;
    animationGame = requestAnimationFrame(playGame);
    player = {
        element: div,
        speed: 0,
        lives: 3,
        game_score: 0,
        car_to_pass: 10,
        score: 0,
        road_width: 250,
        game_end_count: 0,
    };
    startBoard();
    setupCars(10);
}

function updateDash() {
    //console.log(player);
    scoreDash.innerHTML = player.score;
    lifeDash.innerHTML = player.lives;
    speedDash.innerHTML = Math.round(player.speed * 9);
}
