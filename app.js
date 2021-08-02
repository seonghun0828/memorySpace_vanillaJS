const bookInput = document.querySelector(".book-input"),
    movieInput = document.querySelector(".movie-input"),
    bookDiv = document.querySelector(".book-div"),
    movieDiv = document.querySelector(".movie-div"),
    editMenu = document.querySelector(".edit-menu"),
    deleteBtn = document.querySelector(".delete-btn"),
    memoBtn = document.querySelector(".memo-btn"),
    memoDiv = document.querySelector(".memo-div"),
    memoMenu = document.querySelector(".memo-menu"),
    memoSpace = document.querySelector(".memo-space textarea"),
    closeBtn = document.querySelector(".close-btn"),
    saveBtn = document.querySelector(".save-btn");

let bookList = [],
    movieList = [];

let targetImg;
let isClicked = false;
let id_num = 0;

function removeAlarm() {
    memoMenu.removeChild(memoMenu.lastChild);
}
function addAlarm() {
    const alarm = document.createElement("span");
    alarm.classList.add("save-alarm");
    alarm.innerText = "저장되었습니다";
    memoMenu.appendChild(alarm);
    setTimeout(removeAlarm, 2000);
}
function saveMemo() {
    const book_data = JSON.parse(localStorage.getItem("book"));
    const movie_data = JSON.parse(localStorage.getItem("movie"));
    if(targetImg.parentNode.parentNode.classList.contains("book-div")){
        const index = Object.keys(book_data).find(key => book_data[key].id === parseInt(targetImg.id));
        book_data[index].memo = memoSpace.value;
        bookList = book_data;
        saveBook();
    }
    else {
        const index = Object.keys(movie_data).find(key => movie_data[key].id === parseInt(targetImg.id));
        movie_data[index].memo = memoSpace.value;
        movieList = movie_data;
        saveMovie();
    }
    addAlarm();
}

function closeMemo() {
    targetImg.classList.remove("clicked-img");
    isClicked = false;
    targetImg.parentNode.removeChild(editMenu);
    memoDiv.classList.add("invisible");
}

function openMemo() {
    const book_data = JSON.parse(localStorage.getItem("book")),
        movie_data = JSON.parse(localStorage.getItem("movie"));
    if(targetImg.parentNode.parentNode.classList.contains("book-div")){
        const index = Object.keys(book_data).find(key => book_data[key].id === parseInt(targetImg.id));
        memoSpace.value = book_data[index].memo;
    }
    else {
        const index = Object.keys(movie_data).find(key => movie_data[key].id === parseInt(targetImg.id));
        memoSpace.value = movie_data[index].memo;
    }
    memoDiv.classList.remove("invisible");
    closeBtn.addEventListener("click", closeMemo);
    saveBtn.addEventListener("click", saveMemo);

}

function deleteImg() {
    if (!isClicked) window.alert("삭제할 컨텐츠를 클릭해주세요.");
    else if (confirm("삭제하시겠습니까?")) {
        const parent = targetImg.parentNode;
        if (parent.parentNode.classList.contains("book-div")) {
            const data = JSON.parse(localStorage.getItem("book"));
            parent.removeChild(targetImg);
            bookList = data.filter(a => a.id !== parseInt(targetImg.id));
            saveBook();
        } else {
            const data = JSON.parse(localStorage.getItem("movie"));
            parent.removeChild(targetImg);
            movieList = data.filter(a => a.id !== parseInt(targetImg.id));
            saveMovie();
        }
        editMenu.classList.add("invisible");
        isClicked = false;
        window.location.reload();
    }
}

function clickHandler(e) {
    if (isClicked && !e.target.classList.contains("clicked-img")) return; // 클릭 되어 있는 요소가 있으면 함수 종료
    if (e.target.classList.contains("clicked-img")) { // 클릭 되어 있는 요소를 클릭하면 클릭 해제
        e.target.classList.remove("clicked-img");
        isClicked = false;
        e.target.parentNode.removeChild(editMenu);
        memoDiv.classList.add("invisible");
    } else {
        e.target.classList.add("clicked-img");
        targetImg = e.target;
        isClicked = true;
        e.target.parentNode.appendChild(editMenu);
        editMenu.classList.remove("invisible");
    }
}

function saveMovie() {
    localStorage.setItem("movie", JSON.stringify(movieList));
}
function saveBook() {
    localStorage.setItem("book", JSON.stringify(bookList));
}

function addMovie(img_url, img_memo) {
    const newDiv = document.createElement("div");
    const newImg = document.createElement("img");
    newDiv.appendChild(newImg);
    newDiv.classList.add("img-div");
    newImg.id = ++id_num;
    newImg.src = img_url;
    newImg.classList.add("movie-img");
    newImg.addEventListener("click", clickHandler);
    if(typeof img_memo === "undefined") img_memo = "";
    obj = {
        id: id_num,
        data: img_url,
        memo: img_memo
    };
    movieList.push(obj);
    saveMovie();
    movieDiv.appendChild(newDiv);
}

function addBook(img_url, img_memo) {
    const newDiv = document.createElement("div");
    const newImg = document.createElement("img");
    newDiv.appendChild(newImg);
    newDiv.classList.add("img-div");
    newImg.id = ++id_num;
    newImg.src = img_url;
    newImg.classList.add("book-img");
    newImg.addEventListener("click", clickHandler);
    if(typeof img_memo === "undefined") img_memo = "";
    obj = {
        id: id_num,
        data: img_url,
        memo: img_memo
    };
    bookList.push(obj);
    saveBook();
    bookDiv.appendChild(newDiv);
}

function readMovieFile() {
    const file = movieInput.files[0];
    if (!file.type.startsWith('image/')) window.alert("이미지 파일만 선택해주십시오.");
    else {
        const reader = new FileReader();
        reader.onload = function () {
            addMovie(reader.result);
        };
        reader.readAsDataURL(file);
    }
}
function readBookFile() {
    const file = bookInput.files[0];
    if (!file.type.startsWith('image/') && file !== null) window.alert("이미지 파일만 선택해주십시오.");
    else {
        const reader = new FileReader();
        reader.onload = function () {
            addBook(reader.result);
        };
        reader.readAsDataURL(file);
    }
}

function loadImg() {
    // if(localStorage.getItem("book") !== null || localStorage.getItem("movie") !== null) 
    const book_data = JSON.parse(localStorage.getItem("book")),
        movie_data = JSON.parse(localStorage.getItem("movie"));
    if (book_data !== null) {
        book_data.forEach(a => {
            addBook(a.data, a.memo);
        });
    }
    if (movie_data !== null) {
        movie_data.forEach(a => {
            addMovie(a.data, a.memo);
        });
    }
    memoBtn.addEventListener("click", openMemo);
    deleteBtn.addEventListener("click", deleteImg);
}

function init() {
    loadImg();
    bookInput.addEventListener("change", readBookFile);
    movieInput.addEventListener("change", readMovieFile);
}

init();