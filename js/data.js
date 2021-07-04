const STORAGE_KEY = "BOOK_APPS";

let bookRead = [];

function refreshDataFromBookRead() {
    const listUncompleted = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
    let listCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);
  
    for (book of bookRead){
        const newBook = makeNewBook(book.title, book.author, book.year, book.isCompleted);
        newBook[BOOK_ITEMID] = book.id;
        
        if(book.isCompleted){
            listCompleted.append(newBook);
        } else {
            listUncompleted.append(newBook);
        }
    }
}

function saveData() {
    const parsed = JSON.stringify(bookRead);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event("ondatasaved"));
}

function updateDataToStorage() {
    if(isStorageExist())
        saveData();
 }

function isStorageExist(){
    if(typeof(Storage) === undefined){
        alert("Browser kamu tidak mendukung local storage");
        return false
    }
    
    return true;
}

function findBook(bookId) {
    for(book of bookRead){
        if(book.id === bookId)
            return book;
    }
    return null;
 }
  
 function findBookIndex(bookId) {
    let index = 0
    for (book of bookRead) {
        if(book.id === bookId) return index;

        index++;
    }
  
    return -1;
 }

function composeTodoObject(title, author, year, isCompleted) {
    return {
        id: +new Date(),
        title,
        author,
        year,
        isCompleted
    };
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (serializedData !== null) bookRead = data;

    document.dispatchEvent(new Event("ondataloaded"));
}
