const UNCOMPLETED_LIST_BOOK_ID = "read";
const COMPLETED_LIST_BOOK_ID = "done";
const BOOK_ITEMID = "itemId";


function makeNewBook(title, author, year, isCompleted) {
    const bookTitle = document.createElement("h3");
    bookTitle.innerText = title;

    const bookAuthor = document.createElement("h4");
    bookAuthor.innerText = "Penulis: " + author;

    const bookYear = document.createElement("p");
    bookYear.innerText = "Tahun: " + year;

    const bookContainer = document.createElement("div");
    bookContainer.classList.add("item");
    bookContainer.append(bookTitle, bookAuthor, bookYear);

    if(isCompleted){
        bookContainer.append(
            createUndoButton(),
            createTrashButton()
        );
    } else {
        bookContainer.append(
            createCheckButton(),
            createTrashButton()
        );
    }
    return bookContainer;
}

function createUndoButton() {
    return createButton("undo-button", function(event){
        undoBookFromCompleted(event.target.parentElement);
    });
}

function createTrashButton() {
    return createButton("trash-button", function(event){
        removeBookFromCompleted(event.target.parentElement);
    });
}

function createCheckButton() {
    return createButton("check-button", function(event){
        addBookToCompleted(event.target.parentElement);
    });
}

function createButton(buttonTypeClass, eventListener) {
    const button = document.createElement("button");
    button.classList.add(buttonTypeClass);
    button.addEventListener("click", function (event) {
        eventListener(event);
    });
    return button;
}

function addBook() {
    const uncompletedBookList = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const year = document.getElementById("year").value;

    const book = makeNewBook(title, author, year, false);
    const bookObject = composeTodoObject(title, author, year, false);
  
    book[BOOK_ITEMID] = bookObject.id;
    bookRead.push(bookObject);

    uncompletedBookList.append(book);
    updateDataToStorage();
}

function addBookToCompleted(taskElement) {
    const listCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);
    const bookTitle = taskElement.querySelector(".item h3").innerText;
    
    const bookAuthor = taskElement.querySelector(".item h4").innerText.substr(9);
    const bookYear = taskElement.querySelector(".item p").innerText.substr(7);

    const newBook = makeNewBook(bookTitle, bookAuthor, bookYear, true);
    const book = findBook(taskElement[BOOK_ITEMID]);
    book.isCompleted = true;
    newBook[BOOK_ITEMID] = book.id;

    listCompleted.append(newBook); 
    taskElement.remove();

    updateDataToStorage();
}

function removeBookFromCompleted(taskElement) {
    const bookPosition = findBookIndex(taskElement[BOOK_ITEMID]);
    bookRead.splice(bookPosition, 1);  

    taskElement.remove();

    updateDataToStorage();
}

function undoBookFromCompleted(taskElement){
    const listUncompleted = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
    const bookTitle = taskElement.querySelector(".item h3").innerText;
    const bookAuthor = taskElement.querySelector(".item h4").innerText.substr(9);
    const bookYear = taskElement.querySelector(".item p").innerText.substr(7);

    const newBook = makeNewBook(bookTitle, bookAuthor, bookYear, false);

    const book = findBook(taskElement[BOOK_ITEMID]);
    book.isCompleted = false;
    newBook[BOOK_ITEMID] = book.id;

    listUncompleted.append(newBook);
    taskElement.remove();

    updateDataToStorage();
}
