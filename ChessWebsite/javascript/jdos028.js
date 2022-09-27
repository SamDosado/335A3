// function fetchLogo(){
//     // let img = document.getElementById('Logo')
//     // const fetchPromise = fetch("https://cws.auckland.ac.nz/gas/api/Logo")
//     // const streamPromise = fetchPromise.then((response) => response.json())
//     document["Logo"].src = fetch("https://cws.auckland.ac.nz/gas/api/Logo")

// }
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
            console.log(data[i])
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

function getItemsByTerm(){
    let term = document.getElementById('input').value;
    console.log("Begin searching by term",term)
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
            console.log(data[i])
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

function itemDisplay() {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
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