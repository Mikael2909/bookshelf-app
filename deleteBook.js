function deleteBook(id) {
    let confirmation = confirm("Apa kamu yakin akan menghapus buku ini?")

    if (confirmation == true) {
        const bookDataDetail = getData().filter(a => a.id == id);
        const bookData = getData().filter(a => a.id != id);
        localStorage.setItem(localStorageKey,JSON.stringify(bookData))
        showData(getData())
        alert(`Buku ${bookDataDetail[0].title} telah terhapus`)
    }else{
        return 0
    }
}