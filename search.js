let paginatedList = document.getElementById('paginated-list')
let listItems = paginatedList.querySelectorAll('p')
let nextButton = document.getElementById('next-button')
let prevButton = document.getElementById('prev-button')
let paginationNumbers = document.getElementById('pagination-numbers')

let paginationLimit = 10
let pageCount = Math.ceil(listItems.length / paginationLimit)
let currentPage = 1

let list = []
document.querySelector('#navButtonsDiv').style.display = 'none'

let beers = []

//fetching beers function
const fetchBeersFromApiByName = async searchedBeerName => {
  const getBeersByNameFromAPI = async () => {
    const url = `https://api.punkapi.com/v2/beers?beer_name=${searchedBeerName}`
    const response = await fetch(url)
    return await response.json()
  }
  await getBeersByNameFromAPI().then(function (beersFromApi) {
    console.log('beent', beersFromApi)
    beers.push(beersFromApi)
    return beers
  })
}

//----------------- FORM SUBMIT  ------------------------------
document.querySelector('form').addEventListener('submit', async e => {
  e.preventDefault()
  let serachedBeersList = []
  beers = []
  let searchedBeerName = document.querySelector('input').value

  const getBeersByNameFromAPI = async () => {
    try {
      const url = `https://api.punkapi.com/v2/beers?beer_name=${searchedBeerName}`
      const response = await fetch(url)
      return await response.json()
    } catch (err) {
      console.log(err)
    }
  }

  let getBeersInArray = async () => {
    await getBeersByNameFromAPI().then(beersFromApi => {
      beers = beers.concat(beersFromApi)
      console.log(beers, 'beersapi')
      return beers
    })
  }

  await getBeersInArray().then(beers => beers)

  beers.map(beer => {
    for (let key in beer) {
      if (key == 'name') {
        serachedBeersList.push(beer.name)
      }
    }
  })

  paginatedList.innerHTML = ''
  createLinkListHTML(serachedBeersList)
  localStorage.setItem('searchedBeersStorage', JSON.stringify(beers))
})

//----------------- CREATE LINKS AS HTML  ------------------------------
function createLinkListHTML (list) {
  document.getElementById('paginated-list').innerHTML = ''

  for (let item of list) {
    let link = document.createElement('a')
    link.innerHTML = item
    link.href = '#'
    let listItem = document.createElement('p')
    listItem.classList.add('listItemAsP')
    listItem.appendChild(link)
    document.getElementById('paginated-list').appendChild(listItem)
  }

  paginering()
}

//-----------------  PAGINERING   ------------------------------
function paginering () {
  listItems = paginatedList.querySelectorAll('p')
  pageCount = Math.ceil(listItems.length / paginationLimit)

  getPaginationNumbers(pageCount)

  //---- Set current page by buttons ----
  // 1) onload -> set current page
  setCurrentPage(1)

  // 2) on < and > buttons -> set current page
  prevButton.addEventListener('click', () => {
    setCurrentPage(currentPage - 1)
  })
  nextButton.addEventListener('click', () => {
    setCurrentPage(currentPage + 1)
  })

  // 3) on pagination number -> set current page
  document.querySelectorAll('.pagination-number').forEach(button => {
    //find clicked number index
    const pageIndex = Number(button.getAttribute('page-index'))
    if (pageIndex) {
      button.addEventListener('click', () => {
        setCurrentPage(pageIndex)
      })
    }
  })

  //---- Show/hide whole navigation bar according to list length ----
  if (list.length > 10) {
    document.querySelector('#navButtonsDiv').style.display = 'flex'
  } else {
    document.querySelector('#navButtonsDiv').style.display = 'none'
  }
}

//----------------- ALL SMALL PAGINERING FUNCTIONS  ------------------------------

//show pagination number HTML, set index for numbers
const getPaginationNumbers = pageCount => {
  paginationNumbers.innerHTML = ''
  for (let index = 1; index <= pageCount; index++) {
    const pageNumber = document.createElement('button')
    pageNumber.className = 'pagination-number'
    pageNumber.innerHTML = index
    pageNumber.setAttribute('page-index', index)
    paginationNumbers.appendChild(pageNumber)
  }
}

//enable/disable < and > and number buttons according to current page
const disableButton = b => {
  b.classList.add('disabled')
  b.setAttribute('disabled', true)
}

const enableButton = b => {
  b.classList.remove('disabled')
  b.removeAttribute('disabled')
}

const handlePageButtonsStatus = () => {
  //firs page
  if (currentPage === 1) {
    disableButton(prevButton)
  } else {
    enableButton(prevButton)
  }
  //last page
  if (pageCount === currentPage) {
    disableButton(nextButton)
  } else {
    enableButton(nextButton)
  }
}

//navigation numbers between < and > -> make/remove active
const handleActivePageNumber = () => {
  document.querySelectorAll('.pagination-number').forEach(button => {
    button.classList.remove('active')
    const pageIndex = Number(button.getAttribute('page-index'))
    if (pageIndex == currentPage) {
      button.classList.add('active')
    }
  })
}

//get index for list and show only limited number of items
const setCurrentPage = pageNum => {
  currentPage = pageNum
  //handle < and > buttons, navigation number
  handleActivePageNumber()
  handlePageButtonsStatus()
  //show/hide list items
  const prevRange = (pageNum - 1) * paginationLimit
  const currRange = pageNum * paginationLimit
  listItems.forEach((item, index) => {
    item.classList.add('hidden')
    if (index >= prevRange && index < currRange) {
      item.classList.remove('hidden')
    }
  })
}

//----------------- GO TO DETAILS.HTML  ------------------------------
document.querySelector('ul').addEventListener('click', e => {
  if (e.target.innerText !== null) {
    let searchedBeersFromStorage = JSON.parse(
      localStorage.getItem('searchedBeersStorage')
    )

    let searchedBeer = searchedBeersFromStorage.find(
      b => b.name == e.target.innerText
    )

    localStorage.setItem('searchedBeerId', searchedBeer.id)
    window.location = 'details.html'
  }
})

//----------------- GO TO ADVANCED SEARCH.HTML  ------------------------------
document.querySelector('#advancedSearchButton').addEventListener('click', e => {
  window.location = 'advancedSearch.html'
})

//----------------- GO TO INDEX.HTML  ------------------------------
document.querySelector('#backToIndexPage').addEventListener('click', e => {
  window.location = 'index.html'
})
