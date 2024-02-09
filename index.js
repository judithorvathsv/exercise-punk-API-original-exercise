window.onload = () => {
  //show loader
  document.getElementById('loaderDiv').style.display = 'flex'

  let storedBeers = localStorage.getItem('beersStorage')
  if (storedBeers == 'undefined' || storedBeers == null) {
    fetchBeers()
  } else {
    let beers = JSON.parse(storedBeers)
    checkHasOneBeerAndGetBeer(beers)
  }
}

const fetchBeers = () => {
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
      checkHasOneBeerAndGetBeer(result)
    })
    .catch(err => console.log(err))
}

function getBeer (beers) {
  if (beers == null) beers = JSON.parse(localStorage.getItem('beersStorage'))
  let randomId = Math.floor(Math.random() * 25 + 1)
  let randomBeer = beers.find(b => b.id == randomId)
  document.getElementById('beerImage').src = randomBeer.image_url
  document.getElementById('beerName').innerText = randomBeer.name
  localStorage.setItem('beerId', randomBeer.id)
  //hide loader
  document.getElementById('loaderDiv').style.display = 'none'
  document.getElementById('card').style.opacity = 1
}

async function checkHasOneBeerAndGetBeer (beers) {
  let beerId = localStorage.getItem('beerId')
  if (typeof beerId == 'undefined' || beerId == null) {
    getBeer(beers)
  } else {
    let randomBeer = beers.find(b => b.id == beerId)
    document.getElementById('beerImage').src = randomBeer.image_url
    document.getElementById('beerName').innerText = randomBeer.name
    //hide loader
    document.getElementById('loaderDiv').style.display = 'none'
    document.getElementById('card').style.opacity = 1
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
