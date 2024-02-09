let beersArray = []

const allBeers = async () => {
  try {
    const response = await fetch('https://api.punkapi.com/v2/beers/')
    return await response.json()
  } catch (err) {
    console.log(err)
  }
}

allBeers()
  .then(function (result) {
    localStorage.setItem('beersStorage', JSON.stringify(result))
  })
  .catch(err => console.log(err))

let storedBeers = localStorage.getItem('beersStorage')
let beers = JSON.parse(storedBeers)

function getBeer () {
  let randomId = Math.floor(Math.random() * 25)
  let randomBeer = beers.find(b => b.id == randomId)
  document.getElementById('beerImage').src = randomBeer.image_url
  document.getElementById('beerName').innerText = randomBeer.name
  localStorage.setItem('beerId', randomBeer.id)
}

window.onload = () => {
  let beerId = localStorage.getItem('beerId')

  if (typeof beerId == 'undefined' || beerId == null) {
    getBeer()
  } else {
    console.log(beerId)
    let randomBeer = beers.find(b => b.id == beerId)
    document.getElementById('beerImage').src = randomBeer.image_url
    document.getElementById('beerName').innerText = randomBeer.name
  }

  /*   function getRandomColor () {
    var letters = '0123456789ABCDEF'
    var color = '#'
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }

  const setBackgroundColor = () => {
    const randomColor = getRandomColor()
    localStorage.setItem('randomColor', randomColor)

    document.querySelector('.card').style.backgroundColor = randomColor
    document.querySelector('.card').style.color = 'black'
  }

  setBackgroundColor()
  let color = invertColor(background)
  document.querySelector('.card').style.color = color */
}

document
  .getElementById('randomButton')
  .addEventListener('click', () => getBeer())

document
  .getElementById('detailButton')
  .addEventListener('click', () => (window.location = 'details.html'))

document
  .getElementById('searchBeerButton')
  .addEventListener('click', () => (window.location = 'search.html'))

document
  .getElementById('advancedSearchBeerButton')
  .addEventListener('click', () => (window.location = 'advancedSearch.html'))

/* function invertColor (hex) {
  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1)
  }

  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  }
  if (hex.length !== 6) {
    throw new Error('Invalid HEX color.')
  }

  var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
    g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
    b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16)

  return '#' + padZero(r) + padZero(g) + padZero(b)
} */
