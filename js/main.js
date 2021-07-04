const submit = document.getElementById("form");

document.addEventListener("DOMContentLoaded", function () {
    submit.addEventListener("submit", function(e) {
        e.preventDefault();
        addBook();

        this.title.value = "";
        this.year.value = "";
        this.author.value = "";
    })

    if(isStorageExist()){
        loadDataFromStorage();
    }

});

document.addEventListener("ondatasaved", () => {
    console.log("Data berhasil disimpan.");
});


document.addEventListener("ondataloaded", () => {
    // refreshDataFromTodos();
    refreshDataFromBookRead()
});
