// function fetchLogo(){
//     // let img = document.getElementById('Logo')
//     // const fetchPromise = fetch("https://cws.auckland.ac.nz/gas/api/Logo")
//     // const streamPromise = fetchPromise.then((response) => response.json())
//     document["Logo"].src = fetch("https://cws.auckland.ac.nz/gas/api/Logo")

// }

const user = null
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

            </div>
            `
            maindiv.appendChild(shopitem)
        }
    })

}

function getItemsByTerm(term){
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

            </div>
            `
            maindiv.appendChild(shopitem)
        }
    })
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
    document.getElementById("welcome").style.display='none'
}

function login(){
    let uname = document.getElementById('username').value
    let pass = document.getElementById('password').value
    user = {
        username:uname,
        password:pass
    }
    document.getElementById("welcome").style.display='block'
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


document.getElementById('input').addEventListener('keyup', function(){inputListener()});
show('Home');
getver();
getItems();