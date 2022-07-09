const UNCOMPLETED_LIST_BOOK_ID = "read";
const COMPLETED_LIST_BOOK_ID = "done";
const CONFIRMATION_CONTAINER = "message-confirmation";
const SHADOW_OVERLAY = "shadow-overlay";
const FEEDBACK = "feedback-action";
const BOOK_ITEMID = "itemId";
let temp_book_position = null;

function makeNewBook(title, author, year, isCompleted) {
    const bookTitle = document.createElement("h3");
    bookTitle.innerText = title;

    const bookAuthor = document.createElement("h4");
    bookAuthor.innerText = "Penulis: " + author;

    const bookYear = document.createElement("p");
    bookYear.innerText = "Tahun: " + year;

    const contentContainer = document.createElement("div");
    contentContainer.classList.add("content-wrapper")
    contentContainer.append(bookTitle, bookAuthor, bookYear)

    const bookContainer = document.createElement("div");
    bookContainer.classList.add("item");

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-wrapper")
    bookContainer.append(contentContainer, buttonContainer);


    if (isCompleted) {
        buttonContainer.append(
            createUndoButton(),
            createTrashButton()
        );
    } else {
        buttonContainer.append(
            createCheckButton(),
            createTrashButton()
        );
    }
    return bookContainer;
}

function renderDeleteConfirm(taskElement) {
    const bookPosition = findBookIndex(taskElement[BOOK_ITEMID]);
    const book = bookRead[bookPosition];
    temp_book_position = bookPosition;

    const shadwoOverlay = document.getElementById(SHADOW_OVERLAY);
    const confirmationContainer = document.getElementById(CONFIRMATION_CONTAINER);

    const textConfirm = confirmationContainer.getElementsByTagName("h2")[0];
    textConfirm.innerHTML = `Apakah anda yakin ingin menghapus buku <span id="book-delete">${book.title}</span> dari daftar?`

    confirmationContainer.classList.toggle("active");
    shadwoOverlay.classList.toggle("active");
}

function hideDeleteConfirm() {
    const shadwoOverlay = document.getElementById(SHADOW_OVERLAY);
    const confirmationContainer = document.getElementById(CONFIRMATION_CONTAINER);

    confirmationContainer.classList.remove("active");
    shadwoOverlay.classList.remove("active");
}

function createUndoButton() {
    return createButton("undo-button", function (event) {
        const buttonElement = event.target.parentElement;
        undoBookFromCompleted(buttonElement.parentElement);
    });
}

function createTrashButton() {
    return createButton("trash-button", function (event) {
        const buttonElement = event.target.parentElement;
        renderDeleteConfirm(buttonElement.parentElement);
    });
}

function createCheckButton() {
    return createButton("check-button", function (event) {
        const buttonElement = event.target.parentElement;
        addBookToCompleted(buttonElement.parentElement);
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

function resetListBook() {
    const uncompletedBookList = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
    const listCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);

    uncompletedBookList.innerHTML = "";
    listCompleted.innerHTML = "";
}

function viewSearchBook(searchBooks) {
    const uncompletedBookList = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
    const listCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);
    resetListBook();

    searchBooks.map((book) => {
        const bookElement = makeNewBook(book.title, book.author, book.year, book.isCompleted);
        book.isCompleted ? listCompleted.append(bookElement) : uncompletedBookList.append(bookElement);
    });
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
    generateFeedbackMessage(title, "add");
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

    const feedbackContainer = document.getElementById(FEEDBACK);
    const textFeedback = feedbackContainer.getElementsByTagName("h2")[0];
    textFeedback.innerHTML = `Buku <span id="book-feedback">${bookTitle}</span> dipindahkan ke daftar selesai dibaca`;

    generateFeedbackMessage(bookTitle, "completed");
}

function undoBookFromCompleted(taskElement) {
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
    generateFeedbackMessage(bookTitle, "uncompleted");
}

function removeBookFromCompleted() {
    const book = bookRead[temp_book_position];
    bookRead.splice(temp_book_position, 1);

    updateDataToStorage();
    loadDataFromStorage();
    hideDeleteConfirm();
    generateFeedbackMessage(book.title, "deleted");
}

function generateFeedbackMessage(book, action) {
    const feedbackContainer = document.getElementById(FEEDBACK);
    const textFeedback = feedbackContainer.getElementsByTagName("h2")[0];
    textFeedback.innerHTML = `Buku <span id="book-feedback">${book}</span> `

    switch (action) {
        case "deleted":
            textFeedback.innerHTML += `dihapus dari daftar`;
            break;
        case "uncompleted":
            textFeedback.innerHTML += `dipindahkan ke daftar belum selesai dibaca`;
            break;
        case "completed":
            textFeedback.innerHTML += `dipindahkan ke daftar telah selesai dibaca`;
            break;
        default:
            textFeedback.innerHTML += `berhasil ditambahkan ke daftar`;
            break;
    }

    toggleFeedbackMessage(action);
}

function toggleFeedbackMessage(action) {
    const feedbackContainer = document.getElementById(FEEDBACK);

    feedbackContainer.classList.add("active", action);
    setTimeout(function () {
        feedbackContainer.classList.remove("active", action);
    }, 3000);
}
