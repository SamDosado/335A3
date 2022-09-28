// function fetchLogo(){
//     // let img = document.getElementById('Logo')
//     // const fetchPromise = fetch("https://cws.auckland.ac.nz/gas/api/Logo")
//     // const streamPromise = fetchPromise.then((response) => response.json())
//     document["Logo"].src = fetch("https://cws.auckland.ac.nz/gas/api/Logo")

// }

let user = null
function getver(){
    const fetchPromise = fetch('https://cws.auckland.ac.nz/gas/api/Version', {
        headers : {
            "Accept":"text/plain"
        }
    });
    const streamPromise = fetchPromise.then((response) => response.text())
    streamPromise.then((data) => document.getElementById("version").textContent=`Version ${data}`)

}

function getItems(){
    console.log('GETTING ITEMS')
    let string = 'display:none'
    if(isLoggedIn()){
        console.log('- Logged in')
        string = ''
    } else{
        console.log('- not logged in')
    }
    const fetchPromise = fetch('https://cws.auckland.ac.nz/gas/api/AllItems',
    {
        headers: {
            "Accept":"text/plain"
        }
    });
    const maindiv = document.getElementById('Shop-List')
    const streamPromise = fetchPromise.then((response) => response.json())
    streamPromise.then((data) => {
        for (let i = 0; i < data.length; i++){
            const shopitem = document.createElement('div');
            // console.log(data[i])
            shopitem.innerHTML = `
            <div class='shop-item' >
                <div class='item-img'> <img class='img-item' src='https://cws.auckland.ac.nz/gas/api/ItemPhoto/${data[i].id}' style='width:25%'></div>
                <div class='item-name'><h1>${data[i].name}</h1></div>
                <div class='item-desc'><p>${data[i].description}</p></div>
                <div class='item-price'><p>Price:$${data[i].price}</p></div>
                <button style='${string}' onclick='purchase(${data[i].id})'>Buy</button>
            </div>
            `
            maindiv.appendChild(shopitem)
        }
    })

}

function getItemsByTerm(term){
    console.log("Getting items by term")
    let string = 'display:none'
    if(isLoggedIn()){
        console.log('- Logged in')
        string = ''
    } else{
        console.log('- not logged in')
    }
    // let term = document.getElementById('input').value;
    // console.log("Begin searching by term",term)
    const fetchPromise = fetch('https://cws.auckland.ac.nz/gas/api/Items/'+term,
    {
        headers: {
            "Accept":"text/plain"
        }
    });
    const maindiv = document.getElementById('Shop-List')
    const streamPromise = fetchPromise.then((response) => response.json())
 while (maindiv.lastChild){
    maindiv.removeChild(maindiv.lastChild)
 }
    streamPromise.then((data) => {
        for (let i = 0; i < data.length; i++){
            const shopitem = document.createElement('div');
            // console.log(data[i])
            shopitem.innerHTML = `
            <div class='shop-item' >
                <div class='item-img'> <img class='img-item' src='https://cws.auckland.ac.nz/gas/api/ItemPhoto/${data[i].id}' style='width:25%'></div>
                <div class='item-name'><h1>${data[i].name}</h1></div>
                <div class='item-desc'><p>${data[i].description}</p></div>
                <div class='item-price'><p>Price:$${data[i].price}</p></div>
                <button style='${string}' onclick='purchase(${data[i].id})'>Buy</button>
            </div>
            `
            // add purchase
            maindiv.appendChild(shopitem)
        }
    })
}

function purchase(id){
    if(!isLoggedIn()){
        alert("Not logged in. How'd you do this?")
    } else{
        const auth = user;
        const fetchPromise = fetch("https://cws.auckland.ac.nz/gas/api/PurchaseItem/"+id, {
        headers:{'Authorization':'Basic '+btoa(auth), 'Accept':'text/plain'
        },
        method:'GET',
        body:``
    })
    }
}

function inputListener(){
    let term = document.getElementById('input').value
    console.log("Searching by term",term)
    if (term == ''){
        getItems();
    } else{
        getItemsByTerm(term);
    }
}


function isLoggedIn(){
    if (user == null){
        return false;
    } else{
        return true;
    }
}

function logout(){
    user = null
    location.reload();
    let pages = document.getElementsByClassName('logged-in')
    for(var i = 0; i < pages.length; i++){
        pages[i].style.display="none"
    }
    let pages2 = document.getElementsByClassName('logged-out')
    for(var j = 0; j < pages2.length; j++){
        pages2[j].style.display = 'block'
    }
}

function login(){
    console.log('Begin login')
    let uname = document.getElementById('username').value
    let pass = document.getElementById('password').value
    
    const auth = uname +":"+pass;
    console.log(auth)
    const fetchPromise = fetch("https://cws.auckland.ac.nz/gas/api/VersionA", {
        headers:{'Authorization':'Basic '+btoa(auth), 'Accept':'text/plain'
        },
        method:'GET'
    })
    console.log("Fetching")
    console.log(fetchPromise.headers)
    const streamPromise = fetchPromise.then((response) => {
        if(response.status == 401)
        {
            user = null
        } else{
            user = auth
        }
    })
    // console.log(response)
    let pages = document.getElementsByClassName('logged-in')
    for(var i = 0; i < pages.length; i++){
        pages[i].style.display="block"
    }
    let pages2 = document.getElementsByClassName('logged-out')
    for(var j = 0; j < pages2.length; j++){
        pages2[j].style.display = 'none'
    }
    document.getElementById('username').value = ''
    document.getElementById('password').value = ''
    // user = null
    // document.getElementById("welcome").style.display='block'
}

function register(){
    if(isLoggedIn()){
        alert("Cannot register already logged in")
        return null
    } 
    let uname = document.getElementById('reg-uname').value
    let pass = document.getElementById('reg-pass').value
    let addr = document.getElementById('reg-addr').value
    const fetchPromise = fetch('https://cws.auckland.ac.nz/gas/api/Version', {
        headers : {
            "Accept":"text/plain"
        },
        body:`{
            'username':${uname},
            'password':${pass},
            'address':${addr}
        }`,
        method:'POST'
    });
    document.getElementById('reg-uname').value = ''
    document.getElementById('reg-pass').value = ''
    document.getElementById('reg-addr').value = ''

}


function show(shown){
    var pages = document.getElementsByClassName("Page");
    for(var counter = 0; counter < pages.length; counter++ ){
        pages[counter].style.display='none';
        document.getElementById(pages[counter].id + "-button").style.backgroundColor='#E9E9ED'
    }
    document.getElementById(shown).style.display='block';
    document.getElementById(shown+"-button").style.backgroundColor='darkgray';
    console.log("Shown ", shown)
    return false;
}

function getComments(){
    console.log("getting comments");
    let fetchPromise = fetch('https://cws.auckland.ac.nz/gas/api/Comments',{
        headers:{
            'Accept':'*/*'
        }
    });
    let streamPromise =  fetchPromise.then((response) => response.text());
    streamPromise.then((data) => {
        document.getElementById('comments').innerHTML = data;
    });
}

function postComment(){
    console.log('posting comment')
    let inputtext = document.getElementById('comment-text').value
    let inputname = document.getElementById("comment-name").value
    let obj = JSON.parse(`{"comment":"${inputtext}","name":"${inputname}"}`)
    console.log("comment made");
    console.log(`|${obj.comment}|`);
    let fetchPromise = fetch('https://cws.auckland.ac.nz/gas/api/Comment', 
    {
        headers:{
            'Content-Type':'application/json'
        },
        method:'POST',
        body:`{"comment":"${inputtext}","name":"${inputname}"}`
    });
    document.getElementById('comment-text').value = ''
    document.getElementById("comment-name").value = ''
    // location.reload();
    // show('Book');
}
function generateChessboard(){
    console.log('Generating Chessboard')
    let table = document.createElement('table');
    for (let i = 0; i < 8; i++){
        let row = document.createElement('tr');
        for(let j = 0; j < 8; j++){
            let col = document.createElement('td');
            let colImg = ''
            if((i + j) % 2 == 0 ){
                col.setAttribute('class', 'white-cell cell');
            } else{
                col.setAttribute('class','black-cell cell')
            }
            col.setAttribute('id', `${i},${j}`)
            row.appendChild(col)
            if(i == 1 || i == 6){
                colImg = `P`
            } else if(i == 0 || i ==7){
                console.log('Setting row', i)
                switch(j){
                    case 0:
                    case 7:
                        colImg ='R'
                        break;
                    case 1:
                    case 6:
                        colImg='N'
                        break;
                    case 2:
                    case 5:
                        colImg='B'
                        break;
                    case 3:
                        colImg='Q'
                        break;
                    case 4:
                        colImg='K'
                        break;
                }
            }

            if (i == 0 || i == 1){
                colImg = `<img src="https://cws.auckland.ac.nz/gas/images/${colImg}b.svg"`
            } else if(i == 0 || i == 1){
                colImg = `<img src="https://cws.auckland.ac.nz/gas/images/${colImg}w.svg"`
            }
            col.innerHTML = colImg
        }
        table.appendChild(row)
    }
    document.getElementById("ChessTable").appendChild(table);
    table.setAttribute('cellspacing', '0');
    table.setAttribute('width', '270px');
    console.log("Finished Generation")
}
document.getElementById('input').addEventListener('keyup', function(){inputListener()});
show('Home');
