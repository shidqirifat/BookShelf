const submit = document.getElementById("form");
const searchInput = document.getElementById("search-keyword");
const searchForm = document.getElementById("search");
const btnCancelDelete = document.getElementById("btn-cancel");
const btnHandleDelete = document.getElementById("btn-delete");

document.addEventListener("DOMContentLoaded", function () {
    submit.addEventListener("submit", function (e) {
        e.preventDefault();
        addBook();

        this.title.value = "";
        this.year.value = "";
        this.author.value = "";
    })

    if (isStorageExist()) {
        loadDataFromStorage();
    }

});

document.addEventListener("ondataloaded", function () {
    refreshDataFromBookRead()
});

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    getBooksByKeyword(searchInput.value);
})

searchInput.addEventListener("input", function () {
    getBooksByKeyword(searchInput.value);
})

btnCancelDelete.addEventListener("click", function () {
    hideDeleteConfirm();
})

btnHandleDelete.addEventListener("click", function () {
    removeBookFromCompleted();
})