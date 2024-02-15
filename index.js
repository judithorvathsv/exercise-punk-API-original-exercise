const fetchRandomBeerFromApi = () => {
  const getRandomBeerFromAPI = async () => {
    try {
      const response = await fetch('https://api.punkapi.com/v2/beers/random')
      return await response.json()
    } catch (err) {
      console.log(err)
    }
  }
  getRandomBeerFromAPI()
    .then(function (beer) {
      localStorage.setItem('randomBeerSorage', JSON.stringify(beer))
      showBeer(beer)
    })
    .catch(err => console.log(err))
}

function showBeer (randomBeer) {
  if (randomBeer[0].image_url !== null) {
    document.getElementById('beerImage').src = randomBeer[0].image_url
  }

  document.getElementById('beerName').innerText = randomBeer[0].name
}

const fetchBeerFromApiAndShow = async () => {
  //show loader
  document.getElementById('loaderDiv').style.display = 'flex'
  document.getElementById('card').style.opacity = 0

  let storedRandomBeer = localStorage.getItem('randomBeerSorage')

  if (storedRandomBeer == 'undefined' || storedRandomBeer == null) {
    fetchRandomBeerFromApi()
  } else {
    let previousSelectedBeer = window.localStorage.getItem('randomBeerSorage')
    let randomBeer = JSON.parse(previousSelectedBeer)
    showBeer(randomBeer)
  }
  //hide loader
  document.getElementById('loaderDiv').style.display = 'none'
  document.getElementById('card').style.opacity = 1
}

window.onload = () => {
  fetchBeerFromApiAndShow()
}

function setNewRandomBeer () {
  localStorage.removeItem('randomBeerSorage')
  fetchBeerFromApiAndShow()
}

document
  .getElementById('randomButton')
  .addEventListener('click', () => setNewRandomBeer())

document
  .getElementById('detailButton')
  .addEventListener('click', () => (window.location = 'details.html'))

document
  .getElementById('searchBeerButton')
  .addEventListener('click', () => (window.location = 'search.html'))

document
  .getElementById('advancedSearchBeerButton')
  .addEventListener('click', () => (window.location = 'advancedSearch.html'))
