/*  
- The search form should contain relevant validation.
--> */

let storedBeers = localStorage.getItem('beersStorage')
let beers = JSON.parse(storedBeers)

let paginatedList = document.getElementById('paginated-list')
let listItems = paginatedList.querySelectorAll('p')
let nextButton = document.getElementById('next-button')
let prevButton = document.getElementById('prev-button')
let paginationNumbers = document.getElementById('pagination-numbers')

let paginationLimit = 10
let pageCount = Math.ceil(listItems.length / paginationLimit)
let currentPage = 1

let list = []
document.querySelector('nav').style.display = 'none'

function isEmptyOrSpaces (str) {
  return str === null || str.match(/^ *$/) !== null
}

let minDate = beers.reduce((a, b) =>
  getDateFormat(a.first_brewed) < getDateFormat(b.first_brewed) ? a : b
)

function getDateFormat (date) {
  return new Date(date.substring(3, 7), date.substring(0, 2), '01')
}

let maxAbv = beers.reduce((a, b) => (a.abv > b.abv ? a : b))

function onlyUnique (value, index, array) {
  return array.indexOf(value) === index
}

//----------------- FORM SUBMIT  ------------------------------

document.querySelector('form').addEventListener('submit', e => {
  e.preventDefault()

  //inputs
  let searchedName = ''
  searchedName = document.querySelector('#name').value
  let searchedHops = ''
  searchedHops = document.querySelector('#hops').value
  let searchedMalt = ''
  searchedMalt = document.querySelector('#malt').value

  let searchedBrewerDateFrom = minDate.first_brewed
  searchedBrewerDateFrom = document.querySelector('#brewersFrom').value
  let searchedBrewerDateFromAsDate = new Date(searchedBrewerDateFrom)

  let searchedBrewerDateTo = new Date()
  searchedBrewerDateTo = document.querySelector('#brewersTo').value
  let searchedBrewerDateToAsDate = new Date(searchedBrewerDateTo)

  let searchedMinAbv = 0
  searchedMinAbv = document.querySelector('#abvGreaterThan').value
  let searchedMaxAbv = maxAbv
  searchedMaxAbv = document.querySelector('#abvLessThan').value

  //lists
  let nameList = []
  let hopsList = []
  let maltList = []
  let brewFromList = []
  let brewToList = []
  let abvFromList = []
  let abvToList = []

  //get all searched item in its list:
  if (!isEmptyOrSpaces(searchedName)) {
    beers.map(beer => {
      for (let key in beer) {
        if (
          key == 'name' &&
          beer[key].toLowerCase().includes(searchedName.toLowerCase())
        ) {
          nameList.push(beer.name)
        }
      }
    })
  }

  if (!isEmptyOrSpaces(searchedHops)) {
    beers.map(beer => {
      for (let key in beer) {
        if (key == 'ingredients') {
          for (let hop in beer[key].hops) {
            if (
              beer[key].hops[hop].name
                .toLowerCase()
                .includes(searchedHops.toLowerCase())
            ) {
              hopsList.push(beer.name)
            }
          }
        }
      }
    })
  }

  if (!isEmptyOrSpaces(searchedMalt)) {
    beers.map(beer => {
      for (let key in beer) {
        if (key == 'ingredients') {
          for (let m in beer[key].malt) {
            if (
              beer[key].malt[m].name
                .toLowerCase()
                .includes(searchedMalt.toLowerCase())
            ) {
              maltList.push(beer.name)
            }
          }
        }
      }
    })
  }

  if (!isEmptyOrSpaces(searchedBrewerDateFrom)) {
    beers.map(beer => {
      for (let key in beer) {
        if (key == 'first_brewed') {
          let brewDate = new Date(
            beer[key].substring(3, 7),
            beer[key].substring(0, 2),
            '01'
          )
          if (brewDate >= searchedBrewerDateFromAsDate) {
            brewFromList.push(beer.name)
          }
        }
      }
    })
  }

  if (!isEmptyOrSpaces(searchedBrewerDateTo)) {
    beers.map(beer => {
      for (let key in beer) {
        if (key == 'first_brewed') {
          let brewDate = new Date(
            beer[key].substring(3, 7),
            beer[key].substring(0, 2),
            '01'
          )
          if (brewDate < searchedBrewerDateToAsDate) {
            brewToList.push(beer.name)
          }
        }
      }
    })
  }

  if (!isEmptyOrSpaces(searchedMinAbv)) {
    beers.map(beer => {
      for (let key in beer) {
        if (key == 'abv' && beer[key] > searchedMinAbv) {
          abvFromList.push(beer.name)
        }
      }
    })
  }
  if (!isEmptyOrSpaces(searchedMaxAbv)) {
    beers.map(beer => {
      for (let key in beer) {
        if (key == 'abv' && beer[key] < searchedMaxAbv) {
          abvToList.push(beer.name)
        }
      }
    })
  }

  //intersecion
  const intersection = (arr1, arr2) => {
    const res = []
    for (let i = 0; i < arr1.length; i++) {
      if (!arr2.includes(arr1[i])) {
        continue
      }
      res.push(arr1[i])
    }
    return res
  }

  const intersectMany = (...arrs) => {
    let res = arrs[0].slice()
    for (let i = 1; i < arrs.length; i++) {
      res = intersection(res, arrs[i])
    }
    return res
  }

  let allSearchedList = []

  if (nameList.length > 0) allSearchedList.push(nameList)
  if (hopsList.length > 0) allSearchedList.push(hopsList)
  if (maltList.length > 0) allSearchedList.push(maltList)
  if (brewFromList.length > 0) allSearchedList.push(brewFromList)
  if (brewToList.length > 0) allSearchedList.push(brewToList)
  if (abvFromList.length > 0) allSearchedList.push(abvFromList)
  if (abvToList.length > 0) allSearchedList.push(abvToList)

  //check if there is no match:
  if (
    (nameList.length == 0 && searchedName !== '') ||
    (hopsList.length == 0 && searchedHops !== '') ||
    (maltList.length == 0 && searchedMalt !== '') ||
    (brewFromList.length == 0 && searchedBrewerDateFrom !== '') ||
    (brewToList.length == 0 && searchedBrewerDateTo !== '') ||
    (abvFromList.length == 0 && searchedMinAbv !== '') ||
    (abvToList.length == 0 && searchedMaxAbv !== '')
  ) {
    allSearchedList = []
  }

  list = []

  if (allSearchedList.length > 0) {
    list = intersectMany(...allSearchedList)
  }

  paginatedList.innerHTML = ''
  createLinkListHTML(list)
})

//----------------- CREATE LINKS AS HTML  ------------------------------
function createLinkListHTML (list) {
  // document.getElementById('paginated-list').innerHTML = ''

  for (let item of list) {
    let link = document.createElement('a')
    link.innerHTML = item
    link.href = '#'
    let listItem = document.createElement('p')
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
    document.querySelector('nav').style.display = 'flex'
  } else {
    document.querySelector('nav').style.display = 'none'
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
    let searchedBeer = beers.find(b => b.name == e.target.innerText)
    localStorage.setItem('beerId', searchedBeer.id)
    window.location = 'details.html'
  }
})

//----------------- GO TO INDEX.HTML  ------------------------------
document.querySelector('#backToIndexPage').addEventListener('click', e => {
  window.location = 'index.html'
})
