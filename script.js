let teeType = 0;
let currentId = 0;
let player1 = [];
let player2 = [];
let player3 = [];
let player4 = [];
let player1score = 0;
let player2score = 0;
let player3score = 0;
let player4score = 0;

function reloadCSS(){
    let linkTag = document.getElementById('link');
    linkTag.remove();
    document.getElementById('head').innerHTML += `<link id="link" rel="stylesheet" href="./styles.css">`
}

function print() {
    console.log(document.getElementById('column6'))
}

async function getCourses() {
    const response = fetch('https://golf-courses-api.herokuapp.com/courses')
    const data = await (await response).json();
    console.log(data)

    const courses = data.courses;
    let courseOptions = document.getElementById('select-course');
    let text = '';
    courses.forEach(current => {
        console.log(current.name)
        text += `<option value=${current.id}>${current.name}</option>`
    })

    courseOptions.innerHTML = text;
    document.getElementById('current-course').innerText = courses[0].name;
    getCourse(courses[0].id);
}

function updateScore(){
    document.getElementById('column22').innerText = 'Player 1: ' +player1score;
    document.getElementById('column22').innerText += 'Player 2: ' +player2score;
    document.getElementById('column22').innerText += 'Player 3: ' +player3score;
    document.getElementById('column22').innerText += 'Player 4: ' +player4score;
    console.log('1 ' +player1score)
    console.log('2 ' +player2score)
    console.log('3 ' +player3score)
    console.log('4 ' +player4score)
    
}

function addScore(value, player, holeNum){
    if(player == 1){
        player1[holeNum] = parseInt(value);
        player1score = 0;
        player1.forEach(elem => {
            player1score = player1score + elem;
        })
    } else if (player == 2){
        player2[holeNum] = parseInt(value);
        player2score = 0;
        player2.forEach(elem => {
            player2score += elem;
        })
    } else if (player == 3){
        player3[holeNum] = parseInt(value);
        player3score = 0;
        player3.forEach(elem => {
            player3score += elem;
        })
    } else if (player == 4){
        player4[holeNum] = parseInt(value);
        player4score = 0;
        player4.forEach(elem => {
            player4score += elem;
        })
    } 
    updateScore();
}

/* for(let i = 1; i<19; i++){
    document.getElementById('rowName').innerText += `<div id="column${i}">
    <div id="hole${i}"></div>
    <div id="par${i}"></div>
    <div id="yard$${i}"></div>
    <div id="handicap${i}></div>
    <div id="playerScore${i}"></div>
</div>`
} */
getCourses();


function updateType(type) {
 teeType = type;
 getCourse(currentId);
}



async function getCourse(value) {
    currentId = value;
    const response = fetch(`https://golf-courses-api.herokuapp.com/courses/${value}`)

    const obj = await (await response).json();
    const data = obj.data
    let parCount = 0;
    console.log(data);
    console.log(data.accomodations)
    console.log(data.holeCount);
    for(let i = 0; i < 18; i++){
        let currentColumn = document.getElementById(`column${i+1}`)
        currentColumn.innerHTML = '';

    }
    for(let i = 0; i < data.holeCount; i++){
        const holePar = data.holes[i].teeBoxes[teeType].par
        parCount += holePar;
        let j = 1;
        const yardage = data. holes[i].teeBoxes[teeType].yards
        const handicap = data. holes[i].teeBoxes[teeType].hcp
        let currentColumn =document.getElementById(`column${i+1}`)
                currentColumn.innerHTML += `<div id="hole${data.holes[i].hole}">hole: ${i+1}<div>`;
                currentColumn.innerHTML  += `<div id="par${i+1}">Par: ${holePar}<div>`;
                currentColumn.innerHTML  += `<div id="yardage${i+1}">Yards: ${yardage}</div>`
                currentColumn.innerHTML  += `<div id ="handicap${i+1}">Handicap: ${handicap}</div>`
                currentColumn.innerHTML += `<div id="player1Score${i+1}"><input id="scoreInput${i+1}" onchange="addScore(this.value, 1, ${i})" type="number"></div>`
                currentColumn.innerHTML += `<div id="player2Score${i+1}"><input id="scoreInput${i+1}" onchange="addScore(this.value, 1, ${i})" type="number"></div>`
                currentColumn.innerHTML += `<div id="player3Score${i+1}"><input id="scoreInput${i+1}" onchange="addScore(this.value, 3, ${i})" type="number"></div>`
                currentColumn.innerHTML += `<div id="player4Score${i+1}"><input id="scoreInput${i+1}" onchange="addScore(this.value, 4, ${i})" type="number"></div>`

                if(i == 17){
                    document.getElementById('parPar').innerHTML = `<div id='totalPar'>Total Par ${parCount}</div>`
       }
       
    }
reloadCSS();
}


print();