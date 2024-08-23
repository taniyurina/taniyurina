let startTime;
let stopTime = 0;
function startGame() {
    document.querySelector('.start-screen').style.display = 'none';
    document.querySelector('.game-screen').style.display = 'block';
  startTime = Date.now();
    loadScene(1); // 最初のシーンを読み込む
}

function loadScene(FROMy) {
    axios.get('https://m3h-tani-functionapi.azurewebsites.net/api/SELECT', {
        params: { FROMy: FROMy }
    })
    .then(response => {
        const data = response.data;
        // シーンのテキストを表示
        document.getElementById('scene-text').innerText = data.resultText;
      
      if(data.FROMy === 11){
        stopTime = (Date.now()- startTime) / 1000
        console.log('やったー！');
        const optionsContainer = document.getElementById('options');
        optionsContainer.innerHTML = ''; 
        const nameText = document.createElement('input');
        nameText.id = 'insert-name';
        nameText.className= 'option-button'
        nameText.type = 'text';
        optionsContainer.appendChild(nameText);
        const button = document.createElement('button');
        button.className = 'option-button';
        button.innerText = 'スコアを登録する';
        button.onclick = () => insertRecord();
        optionsContainer.appendChild(button);
      }else{
        // 選択肢のボタンを作成
        const optionsContainer = document.getElementById('options');
        optionsContainer.innerHTML = ''; // 以前の選択肢をクリア

        data.List.forEach(option => {
            const button = document.createElement('button');
            button.className = 'option-button';
            button.innerText = option.text;
            button.onclick = () => loadScene(option.TOMy);
            optionsContainer.appendChild(button);
        });
        
      }

        
    })
    .catch(error => {
        console.error('Error fetching the scene data:', error);
    });
}

function showRanking() {
    axios.get('https://m3h-tani-functionapi.azurewebsites.net/api/SELECTRankings')
        .then(response => {
            const rankings = response.data;
            displayRankings(rankings);
        })
        .catch(error => {
            console.error('Error fetching rankings:', error);
        });

    // ランキング表示部分を表示する
    document.querySelector('.start-screen').style.display = 'none';
    document.querySelector('.game-screen').style.display = 'none';
    document.querySelector('#rankingDisplay').style.display = 'block';
}

function displayRankings(rankings) {
    const rankingDisplay = document.getElementById('rankingDisplay');
    rankingDisplay.innerHTML = ''; // 既存のコンテンツをクリア

    const ul = document.createElement('ul');
    ul.className = 'ranking-list';

    rankings.forEach(ranking => {
        const li = document.createElement('li');
        li.textContent = `${ranking.userName}: ${ranking.timeResult.toFixed(2)} seconds`;
        ul.appendChild(li);
    });

    rankingDisplay.appendChild(ul);
}
  async function insertRecord() {
    const insertName = document.getElementById('insert-name').value;
    
    //POSTメソッドで送るパラメーターを作成
    const param = {
      userName : insertName,
      timeResult : stopTime
    };
    
    //INSERT用のAPIを呼び出し
    const response = await axios.post('https://m3h-tani-functionapi.azurewebsites.net/api/INSERTRanking',param);
    
    console.log(response.data);
    
}