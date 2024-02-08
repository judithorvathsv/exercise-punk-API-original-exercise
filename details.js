window.onload = () => {
  showBeer()
}

function showBeer () {
  let storedBeers = localStorage.getItem('beersStorage')
  let beers = JSON.parse(storedBeers)
  let beerId = localStorage.getItem('beerId')

  let beer = beers.find(b => b.id == beerId)

  document.getElementById('title').innerText = beer.name
  document.getElementById('description').innerText = beer.description
  document.getElementById('beerImageDetailPage').src = beer.image_url
  document.getElementById(
    'alcoholVolume'
  ).innerHTML = `<h3>Alcohol by volume:</h3> ${beer.abv} %`
  document.getElementById(
    'volume'
  ).innerHTML = `<h3>Volume:</h3> ${beer.volume.value} liter`

  //get ingredients items as array
  let thisInfo = []
  function printNestedObjectExample (obj, indent = 0) {
    for (let value in obj) {
      if (typeof obj[value] === 'object') {
        let infoPart1 = `${' '.repeat(indent)}${value}:`
        thisInfo.push(infoPart1)
        printNestedObjectExample(obj[value], indent + 2)
      } else {
        let infoPart2 = `${' '.repeat(indent)}${value}: ${obj[value]}`
        thisInfo.push(infoPart2)
      }
    }
  }

  printNestedObjectExample(beer.ingredients)

  //modify ingredients items  and show as html
  function isNumeric (value) {
    return /^-?\d+$/.test(value)
  }

  for (let item of thisInfo) {
    let clearInfo = item.replaceAll(' ', '').slice(0, -1)
    if (isNumeric(clearInfo)) {
      thisInfo = thisInfo.filter(e => e == item)
    } else {
      let li = document.createElement('li')
      li.innerHTML = item.replace(/\s/g, '&nbsp;')
      li.style.listStyleType = 'none'
      document.getElementById('ingredientsUl').appendChild(li)

      if (item[0] !== ' ') {
        li.style.listStyleType = 'none'
        li.style.fontWeight = 'bold'
        li.classList.add('ingredients')
      }
    }
  }

  for (let item of beer.food_pairing) {
    let li = document.createElement('li')
    li.innerText = item
    document.getElementById('foodPairingUl').appendChild(li)
  }

  document.getElementById('brewersTips').innerText = beer.brewers_tips
}

document.querySelector('#backToIndexPage').addEventListener('click', e => {
  window.location = 'index.html'
})
