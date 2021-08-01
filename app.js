const bookInput = document.querySelector(".book-input"),
    movieInput = document.querySelector(".movie-input"),
    bookDiv = document.querySelector(".book-div"),
    movieDiv = document.querySelector(".movie-div"),
    menuSpan = document.querySelector(".menu-span"),
    deleteBtn = document.querySelector(".delete-btn"),
    memoBtn = document.querySelector(".memo-btn"),
    memoDiv = document.querySelector(".memo-div"),
    memoMenu = document.querySelector(".memo-menu"),
    closeBtn = document.querySelector(".close-btn"),
    saveBtn = document.querySelector(".save-btn");

let bookList = [],
    movieList = [];

let targetImg;
let isClicked = false;
let id_num = 0;

function saveMemo() {
    
}

function closeMemo() {
    targetImg.classList.remove("clicked-img");
    isClicked = false;
    targetImg.parentNode.removeChild(menuSpan);
    memoDiv.classList.add("invisible");
}

function openMemo() {
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
        menuSpan.classList.add("invisible");
        isClicked = false;
        window.location.reload();
    }
}

function clickHandler(e) {
    if (isClicked && !e.target.classList.contains("clicked-img")) return; // 클릭 되어 있는 요소가 있으면 함수 종료
    if (e.target.classList.contains("clicked-img")) { // 클릭 되어 있는 요소를 클릭하면 클릭 해제
        e.target.classList.remove("clicked-img");
        isClicked = false;
        e.target.parentNode.removeChild(menuSpan);
        memoDiv.classList.add("invisible");
    } else {
        e.target.classList.add("clicked-img");
        targetImg = e.target;
        isClicked = true;
        e.target.parentNode.appendChild(menuSpan);
        menuSpan.classList.remove("invisible");
    }
}

function saveMovie() {
    localStorage.setItem("movie", JSON.stringify(movieList));
}
function saveBook() {
    localStorage.setItem("book", JSON.stringify(bookList));
}

function addMovie(img_url) {
    const newDiv = document.createElement("div");
    const newImg = document.createElement("img");
    newDiv.appendChild(newImg);
    newDiv.classList.add("img-div");
    newImg.id = ++id_num;
    newImg.src = img_url;
    newImg.classList.add("movie-img");
    newImg.addEventListener("click", clickHandler);
    obj = {
        id: id_num,
        data: img_url
    };
    movieList.push(obj);
    saveMovie();
    movieDiv.appendChild(newDiv);
}

function addBook(img_url) {
    const newDiv = document.createElement("div");
    const newImg = document.createElement("img");
    newDiv.appendChild(newImg);
    newDiv.classList.add("img-div");
    newImg.id = ++id_num;
    newImg.src = img_url;
    newImg.classList.add("book-img");
    newImg.addEventListener("click", clickHandler);
    obj = {
        id: id_num,
        data: img_url
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
            addBook(a.data);
        });
    }
    if (movie_data !== null) {
        movie_data.forEach(a => {
            addMovie(a.data);
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