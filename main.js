// ! Ay Dizisi
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "Octobar",
  "Noverber",
  "December",
];

// ! Html' den Js' e elemanların çekilmesi

const addBox = document.querySelector(".add-box");
const popupBox = document.querySelector(".popup-box");
const popup = document.querySelector(".popup");
const closeBtn = document.querySelector("header i");
const form = document.querySelector("form");
const wrapper = document.querySelector(".wrapper");
const popupTitle = document.querySelector("#popup-title");
const popupButton = document.querySelector("#form-btn");

// ! Global scope' a sahip değişkenler

let notes = JSON.parse(localStorage.getItem("notes")) || []; //? Eğer localstorage' da notes key'ine sahip bir eleman varsa jason.parse ile dönüştür ve notes'a ata ama eğer yoksa notes dizisini boş bie dizi olarak ata

let isUpdate = false; // Güncellenme modunda mı?
let updateId = null; // Güncellenecek elemanın Id'si için

// Sayfa yüklendiği anda render fonksiyonunu çalıştır
document.addEventListener("DOMContentLoaded", renderNotes(notes));

// * note içerisindeki menüyü aktif edecek fonksiyon
function showMenu(item) {
  // Tıklanılan ... elemanının kapsam elemanına eriş

  // ! Bir Html elemanının kapsam elemanına erişmek için parentElement metodu kullanılır.
  const parentElement = item.parentElement;

  // parentElement' e show class'ı ekle
  parentElement.classList.add("show");

  // show class'ı eklenerek aktif edilen menüyü pasife çek

  document.addEventListener("click", (e) => {
    // Tıklanılan eleman ... haricinde ve kapsam haricinde bir elemansa show class'ını kaldır
    if (e.target.tagName != "I" || e.target != item) {
      parentElement.classList.remove("show");
    }
  });
}

// * Note Elemanını Silecek Fonksiyon
function deleteNote(item) {
  // Kullanıcıdan silme işlemi için onay iste
  const response = confirm("Bu notu silmek istediğinize emin misiniz?");

  // Eğer silme iişlemi onaylandıysa
  if (response) {
    // Tıklanılan deleteIcon'ın kapsayıcısına eriş
    const noteItem = item.closest(".note");

    // erişilen noteItem'ın içerisindeki data-id değerine eriş
    const noteId = Number(noteItem.dataset.id);

    // ID' si bilinen notu notes dizisinden kaldır
    notes = notes.filter((note) => note.id != noteId);

    // Güncel notes dizisine göre localstorage' ı güncelle
    localStorage.setItem("notes", JSON.stringify(notes));

    // notes dizisinin final haline göre notları render et
    renderNotes(notes);
  } else {
    console.log("Silme işlemi onaylanmadı");
  }
}

// * Note elemanını güncelleyecek fonksiyon
function editNote(item) {
  // Tıklanılan not elemanına eriş
  const note = item.closest(".note");

  // Note'un id'sine eriş
  const noteId = parseInt(note.dataset.id);

  // Id'si bilinen notu notes dizisinde bul
  const foundedNote = notes.find((note) => note.id == noteId);

  // Popup'ı aktif etmek için popup ve popupBox'a show class' ekle
  popupBox.classList.add("show");
  popup.classList.add("show");

  // Popup aktifken arka planda yer alan elemanların kaydırılmasını engelle
  document.body.style.overflow = "hidden";

  // Form içerisindeki elemanlara note'un değerlerini ata
  form[0].value = foundedNote.title;
  form[1].value = foundedNote.description;

  // Güncelleme modu için gerekli değişkenlere atama yap
  (isUpdate = true), (updateId = noteId);

  // popup içerisindeki title ve button' içeriklerini güncelle
  popupTitle.textContent = "Update Note";
  popupButton.textContent = "Update";
}

// * Wrapper elemanına bir olay izleyicisi ekle
wrapper.addEventListener("click", (e) => {
  if (e.target.classList.contains("bx-dots-horizontal-rounded")) {
    showMenu(e.target);
  }

  // delete-icon class'ına sahip elemana tıklandıysa
  else if (e.target.classList.contains("delete-icon")) {
    deleteNote(e.target);
  }

  // editi-icon class'ına sahip elemana tıklandıysa
  else if (e.target.classList.contains("edit-icon")) {
    editNote(e.target);
  }
});

// * Popup' ı aktif etmek için addBox elemanına bir olay izleyicisi ekle
addBox.addEventListener("click", () => {
  // Popup' ı aktif etmek için popup ve popup-box' a show class' ı ekle
  popupBox.classList.add("show");
  popup.classList.add("show");

  // Popup aktif edildiğinde arka planda yer alan elemanların kaydırılmasını engelle
  document.body.style.overflow = "hidden";
});

//* Popup' ı pasif etmek için closeBtn elemanına bir olay izleyicisi ekle
closeBtn.addEventListener("click", () => {
  // Popup' ı pasif etmek için popup ve popup-box' ından show class'ını kaldır
  popupBox.classList.remove("show");
  popup.classList.remove("show");

  // Popup pasif edildiğinde arka planda yer alan elemanların kaydırılmasını eski haline getir
  document.body.style.overflow = "auto";

  form.reset();

  // Popup'ı eski haline çevir
  popupTitle.textContent = "New Note";
  popupButton.textContent = "Add";
  isUpdate = false;
  updateId = null;
});

// * Formun gönderilmesini izle
form.addEventListener("submit", (e) => {
  // Formlar gödnerildiğinde default olarak sayfa yeniler. Bunu engellemek için event parametresi içerisindeki preventDefault() metodu kullanılır.
  e.preventDefault();

  // Form içerisindeki title ve description elemanlarına eriş

  const titleInput = e.target[0];
  const descriptionInput = e.target[1];

  // titleInput ve descriptionInput elemanlarının değerine eriş

  const title = titleInput.value;
  const description = descriptionInput.value;

  // Eğer title ve description yoksa kullanıcıya uyarı ver
  if (!title || !description) {
    alert("Title ve description değerleri boş bırakılamaz.");
    return;
  }

  // Notun gönderildiği güncel tarih verisine eriş
  const date = new Date();

  const day = date.getDate();
  const month = date.getMonth();
  const updateMonth = months[month];
  const year = date.getFullYear();
  const id = date.getTime();

  // ! Popup güncelleme modunda mı ekleme modunda mı?

  if (isUpdate) {
    // Notes dizisi içerisinde güncellencek elemanın sırasını bul
    const updateIndex = notes.findIndex((note) => note.id == updateId);

    // Bulunan indexdeki elemanı notes dizisi içerisinde güncelle
    notes[updateIndex] = {
      title,
      description,
      date: `${updateMonth} ${day}, ${year}`,
      id,
    };

    // Popup'ı eski haline çevir
    popupTitle.textContent = "New Note";
    popupButton.textContent = "Add";
    isUpdate = false;
    updateId = null;
  } else {
    // Popup içerisinde erişilen değerler ve tarih objesi içerisinden elde edilen değerler ile eklenecek note elemanı için bir obje oluştur
    let noteItem = {
      title,
      description,
      date: `${updateMonth} ${day}, ${year}`,
      id,
    };

    // Formun gönderilmesi ile oluşturulan noteItem' dizisine ekle
    notes.push(noteItem);
  }

  // LocalStorage' a kayıt yap
  localStorage.setItem("notes", JSON.stringify(notes));

  // Formu Temizle
  form.reset();

  // Popup' ı pasif etmek için popup ve popup-box' ından show class'ını kaldır
  popupBox.classList.remove("show");
  popup.classList.remove("show");

  // Popup pasif edildiğinde arka planda yer alan elemanların kaydırılmasını eski haline getir
  document.body.style.overflow = "auto";

  // notları renderlamak için rendernote fonksiyonunu çalıştır
  renderNotes(notes);
});

// Notları arayüze render edecek fonksiyon
function renderNotes(notes) {
  // Bu fonksiyon ne yapacak
  // Note dizisinde yer alan her not elemanı için bir arayüz elemanı render etmeli

  // ! renderNotes fonksiyonu her çalıştırıldığında bizim için her seferinde önce eklenen note'ları tekrar render ediyor. Bu durumu düzeltmek için her renderNotes fonksiyonu çalıştığında öncesinde oluşturulan noteHtml'lerini sıfırla

  document.querySelectorAll(".note").forEach((noteItem) => noteItem.remove());

  // ! Bir arayüz elemanını ekrandan kaldırmak için revome metodu kullanılır. Bu metot kaldırmak istenen elemanının ardından sonra remove() şeklinde kullanılır.

  notes.forEach((note) => {
    // notes dizisi içerisindeki her eleman için bir note html'i oluştur
    let noteHtml = `    <div class="note" data-id=${note.id}>

        <div class="details">
          <h2>${note.title}</h2>
          <p>${note.description}</p>
        </div>
        
        <div class="bottom">
         
          <p>${note.date}</p>

          
          <div class="settings">
          
            <i class="bx bx-dots-horizontal-rounded"></i>


            <ul class="menu">
              <li class="edit-icon">
                <i class="bx bx-edit"></i>
                Edit
              </li>
              <li class="delete-icon">
                <i class="bx bx-trash"></i>
                Delete
              </li>
            </ul>
          </div>
        </div>
      </div>`;

    // oluşturulan html elemanını arayüze ekle
    addBox.insertAdjacentHTML("afterend", noteHtml);
  });
}
