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
