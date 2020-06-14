let teeType = 0;
let currentId = 0;
let parCount = 0;
let player1 = [];
let player2 = [];
let player3 = [];
let player4 = [];
let player1in = 0;
let player2in = 0;
let player3in = 0;
let player4in = 0;
let player1out=0;
let player2out=0;
let player3out = 0;
let player4out = 0;
let player1score = 0;
let player2score = 0;
let player3score = 0;
let player4score = 0;
let totalYards = 0;
let listOfNames = [];

function reloadCSS() {
    let linkTag = document.getElementById('link');
    linkTag.remove();
    document.getElementById('head').innerHTML += `<link id="link" rel="stylesheet" href="./styles.css">`
}

async function selectCourses() {
    const response = fetch('https://golf-courses-api.herokuapp.com/courses')
    const data = await (await response).json();

    const courses = data.courses;
    let courseOptions = document.getElementById('select-course');
    let text = '';
    courses.forEach(current => {
        text += `<option value=${current.id}>${current.name}</option>`
    })

    courseOptions.innerHTML = text;
    getCourse(courses[0].id);
}

async function getCourse(value) {
    currentId = value;
    clearScore();
    const response = fetch(`https://golf-courses-api.herokuapp.com/courses/${value}`)

    const obj = await (await response).json();
    const data = obj.data
    console.log(data);

    displayCourseTable(data);
    displayCourseInformation(data);
    reloadCSS();
}

function checkNames(name, input){
    name.toLowerCase();
   if(listOfNames == ''){listOfNames.push([name,input])}
   else{
       listOfNames.forEach(storedName => {
           if(name == storedName[0] && input != storedName[1]) {
                document.getElementById(input).value = '';
           }
       })
    }

}

function displayCourseTable(data) {
    clearColumnData()
    let parCount = 0;
    for (let i = 0; i < data.holeCount; i++) {
        const holePar = data.holes[i].teeBoxes[teeType].par
        const yardage = data.holes[i].teeBoxes[teeType].yards
        const handicap = data.holes[i].teeBoxes[teeType].hcp
        parCount += holePar;
        totalYards += yardage;
        let currentColumn = document.getElementById(`column${i + 1}`)
        currentColumn.innerHTML += `<div class="hole" id="hole${data.holes[i].hole}">Hole ${i + 1}<div>`;
        currentColumn.innerHTML += `<div class="par" id="par${i + 1}">Par ${holePar}<div>`;
        currentColumn.innerHTML += `<div class="yards" id="yardage${i + 1}">Yards ${yardage}</div>`
        currentColumn.innerHTML += `<div class="handicap" id ="handicap${i + 1}">Handicap ${handicap}</div>`
        currentColumn.innerHTML += `<div id="player2Score${i + 1}"><input id="scoreInput${i + 1}" onchange="addScore(this.value, 1, ${i})" maxlength="2" type="number"></div>`
        currentColumn.innerHTML += `<div id="player3Score${i + 1}"><input id="scoreInput${i + 1}" onchange="addScore(this.value, 2, ${i})" maxlength="2" size="2" type="number"></div>`
        currentColumn.innerHTML += `<div id="player1Score${i + 1}"><input id="scoreInput${i + 1}" onchange="addScore(this.value, 3, ${i})" maxlength="2" type="number"></div>`
        currentColumn.innerHTML += `<div id="player4Score${i + 1}"><input id="scoreInput${i + 1}" onchange="addScore(this.value, 4, ${i})" maxlength="2" size="2" type="number"></div>`

        if (i == 17) {
            document.getElementById('total-par').innerHTML = `<div id='totalPar'>Total Par ${parCount}</div>`
            document.getElementById('total-yards-area').innerHTML = `<div>${totalYards}<div>`
        }

    }
}

function displayCourseInformation(data) {
    document.getElementById('current-course').innerText = data.name;
    document.getElementById('course-address').innerText = data.addr1 ? data.addr1: data.addr2
    document.getElementById('course-city').innerText = data.city
    document.getElementById('state').innerText = data.stateOrProvince
    document.getElementById('course-phone').innerText = data.phone
    document.getElementById('image').innerHTML = `<img alt="Image of ${data.name}" src="${data.thumbnail}"></img>`
    document.getElementById('course-website').innerText = data.website

}

function updateType(type) {
    teeType = type;
    getCourse(currentId);
    clearScore();
}

function clearColumnData() {
    for (let i = 0; i < 18; i++) {
        let currentColumn = document.getElementById(`column${i + 1}`)
        currentColumn.innerHTML = '';
    }
}

function checkForGameEnd(arr, score) {
    let count = 0
    if(arr.length == 18) {
        arr.forEach(elem => {
            if(elem != 0) {
                count++;
            }
        })
        if(count == 18) {
            return [1, score]
        }else {
            return -1
        }
    }
}

function addScore(value, player, holeNum) {
    let check = 0;
    if (!value) {
        value = 0;
    }
    if (player == 1) {
        player1[holeNum] = parseInt(value);
        player1score = 0;
        player1.forEach(elem => {
            player1score = player1score + elem;
        })
        check = checkForGameEnd(player1, player1score);
    } else if (player == 2) {
        player2[holeNum] = parseInt(value);
        player2score = 0;
        player2.forEach(elem => {
            player2score += elem;
        })
        check = checkForGameEnd(player2, player2score);
    } else if (player == 3) {
        player3[holeNum] = parseInt(value);
        player3score = 0;
        player3.forEach(elem => {
            player3score += elem;
        })
        check = checkForGameEnd(player3, player3score);
    } else if (player == 4) {
        player4[holeNum] = parseInt(value);
        player4score = 0;
        player4.forEach(elem => {
            player4score += elem;
        })
        check = checkForGameEnd(player4, player4score);
    }
    if(check[0] == 1 && check[1] > parCount ) {
        document.getElementById('final-score').innerText = "Over par! Better luck next time"
    } else if(check[0] == 1 && check[1] < parCount) {
        document.getElementById('final-score').innerText = `Awesome, you scored ${check1 - parCount} under Par!`
    }else {
        document.getElementById('final-score').innerText = `Close one you scored on par` 
    }
    updateScore();
}

function inScore() {
    for(let i = 8; i < 18; i++){
        player1in += player1[i];
        player2in += player2[i];
        player3in += player3[i];
        player4in += player4[i];
    }
    document.getElementById('player-one-in').innerText = player1in;
    document.getElementById('player-two-in').innerText = player2in;
    document.getElementById('player-three-in').innerText = player3in;
    document.getElementById('player-four-in').innerText = player4in;
}

function outScore() {
    for(let i = 0; i < 9; i++){
        player1out += player1[i];
        player2out += player2[i];
        player3out += player3[i];
        player4out += player4[i];
    }
    document.getElementById('player-one-out').innerText = player1out;
    document.getElementById('player-two-out').innerText = player2out;
    document.getElementById('player-three-out').innerText = player3out;
    document.getElementById('player-four-out').innerText = player4out;   
}

function clearScore(){
    player1 = [];
    player2 = [];
    player3 = [];
    player4 = [];
    player1score = 0;
    player2score = 0;
    player3score = 0;
    player4score = 0;
    updateScore();
}


function updateScore() {
    document.getElementById('player1').innerText = 'Player 1: ' + player1score;
    document.getElementById('player2').innerText = 'Player 2: ' + player2score;
    document.getElementById('player3').innerText = 'Player 3: ' + player3score;
    document.getElementById('player4').innerText = 'Player 4: ' + player4score;
    inScore();
    outScore();
}


selectCourses();
