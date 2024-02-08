
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

//----------------- FORM SUBMIT  ------------------------------
document.querySelector('form').addEventListener('submit', e => {
  e.preventDefault()
  let searchedName = ''
  list = []

  searchedName = document.querySelector('input').value
  beers.map(beer => {
    for (let key in beer) {
      if (
        key == 'name' &&
        beer[key].toLowerCase().includes(searchedName.toLowerCase())
      ) {
        list.push(beer.name)
      }
    }
  })

  paginatedList.innerHTML = ''
  createLinkListHTML(list)
})

//----------------- CREATE LINKS AS HTML  ------------------------------
function createLinkListHTML (list) {
  document.getElementById('paginated-list').innerHTML = ''

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

document.querySelector('#advancedSearchButton').addEventListener('click', e => {
  window.location = 'advancedSearch.html'
})
