const localStorageKey = "BOOKS_DATA_APP"
const title = document.querySelector("#inputBookTitle")
const errorTitle = document.querySelector("#errorTitle")
const sectionTitle = document.querySelector("#sectionTitle")
const year = document.querySelector("#inputBookYear")
const errorYear = document.querySelector("#errorYear")
const sectionYear = document.querySelector("#sectionYear")
const readed = document.querySelector("#inputBookIsComplete")
const btnSubmit = document.querySelector("#bookSubmit")
const author = document.querySelector("#inputBookAuthor")
const errorAuthor = document.querySelector("#errorAuthor")
const sectionAuthor = document.querySelector("#sectionAuthor")
const searchValue = document.querySelector("#searchBookTitle")
const btnSearch = document.querySelector("#searchSubmit")

let checkInput = []
let checkTitle = null
let checkAuthor = null
let checkYear = null

window.addEventListener("load", function(){
    if (localStorage.getItem(localStorageKey) !== null) {    
        const booksData = getData()
        showData(booksData)
    }
})

btnSearch.addEventListener("click",function(e) {
    e.preventDefault();
    if (!searchValue.value.trim()) {
        return alert("Silakan masukkan kata kunci untuk pencarian");
    }
    if (localStorage.getItem(localStorageKey) == null) {    
        return alert("Tidak ada data buku")
    }else{
        const getByTitle = getData().filter(a => a.title.toLowerCase().includes(searchValue.value.trim().toLowerCase()));
        if (getByTitle.length == 0) {
            const getByAuthor = getData().filter(a => a.author.toLowerCase().includes(searchValue.value.trim().toLowerCase()));
            if (getByAuthor.length == 0) {
                const getByYear = getData().filter(a => a.year.toString().includes(searchValue.value.trim()));
                if (getByYear.length == 0) {
                    alert(`Tidak ditemukan data dengan kata kunci: ${searchValue.value}`)
                }else{
                    showSearchResult(getByYear);
                }
            }else{
                showSearchResult(getByAuthor);
            }
        }else{
            showSearchResult(getByTitle);
        }
    }

    searchValue.value = ''
})

function showSearchResult(books) {
    const searchResult = document.querySelector("#searchResult")

    searchResult.innerHTML = ''

    books.forEach(book => {
        let el = `
        <article class="book_item border border-white">
            <h3>${book.title}</h3>
            <p>Penulis: ${book.author}</p>
            <p>Tahun: ${book.year}</p>
            <p>${book.isCompleted ? 'Sudah dibaca' : 'Belum dibaca'}</p>
        </article>
        `

        searchResult.innerHTML += el
        
    });
}
function validation(check) {
    let resultCheck = []
    
    check.forEach((a,i) => {
        if (a == false) {
            if (i == 0) {
                title.classList.add("error")
                errorTitle.classList.remove("error-display")
                resultCheck.push(false)
            }else if (i == 1) {
                author.classList.add("error")
                errorAuthor.classList.remove("error-display")
                resultCheck.push(false)
            }else{
                year.classList.add("error")
                errorYear.classList.remove("error-display")
                resultCheck.push(false)
            }
        }
    });

    return resultCheck
}
function getData() {
    return JSON.parse(localStorage.getItem(localStorageKey)) || []
}
btnSubmit.addEventListener("click", function() {
    if (btnSubmit.value == "") {
        checkInput = []

        title.classList.remove("error")
        author.classList.remove("error")
        year.classList.remove("error")

        errorTitle.classList.add("error-display")
        errorAuthor.classList.add("error-display")
        errorYear.classList.add("error-display")

        if (title.value == "") {
            checkTitle = false
        }else{
            checkTitle = true
        }

        if (author.value == "") {
            checkAuthor = false
        }else{
            checkAuthor = true
        }

        if (year.value == "") {
            checkYear = false
        }else{
            checkYear = true
        }

        checkInput.push(checkTitle,checkAuthor,checkYear)
        let resultCheck = validation(checkInput)

        if (resultCheck.includes(false)) {
            return false
        }else{
            const newBook = {
                id: +new Date(),
                title: title.value.trim(),
                author: author.value.trim(),
                year: parseInt(year.value),
                isCompleted: readed.checked
            }
            insertData(newBook)

            title.value = ''
            author.value = ''
            year.value = ''
            readed.checked = false
        }    
    }else{
        const bookData = getData().filter(a => a.id != btnSubmit.value);
        localStorage.setItem(localStorageKey,JSON.stringify(bookData))

        const newBook = {
            id: btnSubmit.value,
            title: title.value.trim(),
            author: author.value.trim(),
            year: year.value,
            isCompleted: readed.checked
        }
        insertData(newBook)
        btnSubmit.innerHTML = "Masukkan Buku"
        btnSubmit.value = ''
        title.value = ''
        author.value = ''
        year.value = ''
        readed.checked = false
        alert("Buku berhasil diedit")
    }
})

function insertData(book) {
    let bookData = []


    if (localStorage.getItem(localStorageKey) === null) {
        localStorage.setItem(localStorageKey, 0);
    }else{
        bookData = JSON.parse(localStorage.getItem(localStorageKey))
    }

    bookData.unshift(book)   
    localStorage.setItem(localStorageKey,JSON.stringify(bookData))

    showData(getData())
}



function showData(books = []) {
    const notCompleted = document.querySelector("#incompleteBookshelfList")
    const completed = document.querySelector("#completeBookshelfList")

    notCompleted.innerHTML = ''
    completed.innerHTML = ''

    books.forEach(book => {
        if (book.isCompleted == false) {
            let el = `
            <article class="book_item border border-white mb-3">
            <h3 id="titlebook"> ${book.title}</h3>
            <p id="author">Penulis: ${book.author}</p>
             <p id="year">Tahun : ${book.year}</p>
          <div class="action">
              <button class="green btn btn-success green" onclick="readedBook('${book.id}')">Selesai di Baca</button>
              <button class="green btn btn-warning yellow" onclick="editBook('${book.id}')"><i class="bi bi-pencil"></i></button>
              <button class="red btn btn-danger red" onclick="deleteBook('${book.id}')"><i class="bi bi-trash"></i></button>
            </div>
           </article>
            `

            notCompleted.innerHTML += el
        }else{
            let el = `
            <article class="book_item border border-white mb-3">
            <h3 id="titlebook">${book.title}</h3>
            <p>Penulis: ${book.author}</p>
            <p>Tahun: ${book.year}</p>

            
             <div class="action">
             <button class="green btn btn-success green"  onclick="unreadedBook('${book.id}')">Belum Selesai di Baca</button>
             <button class="green btn btn-warning yellow" onclick="editBook('${book.id}')"><i class="bi bi-pencil"></i></button>
             <button class="red btn btn-danger red" onclick="deleteBook('${book.id}')"><i class="bi bi-trash"></i></button>
               </div>
              </article>
            `
            completed.innerHTML += el
        }
    });
}



function readedBook(id) {
    let confirmationPermission = confirm('Pindahkan ke selesai dibaca\n Apakah anda yakin?')

    if (confirmationPermission == true) {
        const bookDataDetail = getData().filter(a => a.id == id);
        const newBook = {
            id: bookDataDetail[0].id,
            title: bookDataDetail[0].title,
            author: bookDataDetail[0].author,
            year: bookDataDetail[0].year,
            isCompleted: true
        }

        const bookData = getData().filter(a => a.id != id);
        localStorage.setItem(localStorageKey,JSON.stringify(bookData))

        insertData(newBook)
    }else{
        return 0
    }
}


function unreadedBook(id) {
    let confirmation = confirm('Pindahkan ke belum selesai dibaca\n Apakah Anda yakin?')

    if (confirmation == true) {
        const bookDataDetail = getData().filter(a => a.id == id);
        const newBook = {
            id: bookDataDetail[0].id,
            title: bookDataDetail[0].title,
            author: bookDataDetail[0].author,
            year: bookDataDetail[0].year,
            isCompleted: false
        }

        const bookData = getData().filter(a => a.id != id);
        localStorage.setItem(localStorageKey,JSON.stringify(bookData))

        insertData(newBook)
    }else{
        return 0
    }
}


