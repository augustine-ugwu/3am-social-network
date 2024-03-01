//Modal Popup

// Get the modals
var signUpModal = document.getElementById("signUpModal");
var loginModal = document.getElementById("loginModal");

// Function to open a modal
function openModal(modalId) {
  if (modalId === "signUpModal") {
    signUpModal.style.display = "block";
  } else if (modalId === "loginModal") {
    loginModal.style.display = "block";
  }
}

// Function to close a modal
function closeModal(modalId) {
  if (modalId === "signUpModal") {
    signUpModal.style.display = "none";
  } else if (modalId === "loginModal") {
    loginModal.style.display = "none";
  }
}

// Close the modal when clicking outside of it
window.onclick = function (event) {
  if (event.target === signUpModal) {
    signUpModal.style.display = "none";
  } else if (event.target === loginModal) {
    loginModal.style.display = "none";
  }
};

//File uploads

const dropArea = document.querySelector(".drop_box"),
  button = dropArea.querySelector("button"),
  dragText = dropArea.querySelector("header"),
  input = dropArea.querySelector("input");
let file;
var filename;

button.onclick = () => {
  input.click();
};
