//Read More Button
function myFunction() {
  var dots = document.getElementById("dots");
  var moreText = document.getElementById("more");
  var btnText = document.getElementById("myBtn");

  if (dots.style.display === "none") {
    dots.style.display = "inline";
    btnText.innerHTML = "Read more";
    moreText.style.display = "none";
  } else {
    dots.style.display = "none";
    btnText.innerHTML = "Read less";
    moreText.style.display = "inline";
  }
}

//File uploads
const dropArea = document.querySelector(".drop_box"),
  button = dropArea.querySelector("button"),
  dragText = dropArea.querySelector("header"),
  input = dropArea.querySelector("input");

button.onclick = () => {
  input.click();
};

input.addEventListener("change", function () {
  file = this.files[0];
  showFileName(file);
});

function showFileName(file) {
  if (file) {
    // Update the text to display the file name
    dragText.textContent = `${file.name}`;
  } else {
    // Reset the text if no file is selected
    dragText.textContent = "Select File here";
  }
}

// Sign Up Modal
const exampleModal = document.getElementById("signup");
if (exampleModal) {
  exampleModal.addEventListener("show.bs.modal", (event) => {
    // Button that triggered the modal
    const button = event.relatedTarget;
    // Extract info from data-bs-* attributes
    const recipient = button.getAttribute("data-bs-whatever");
    // If necessary, you could initiate an Ajax request here
    // and then do the updating in a callback.

    // Update the modal's content.
    const modalTitle = exampleModal.querySelector(".modal-title");
    const modalBodyInput = exampleModal.querySelector(".modal-body input");

    modalTitle.textContent = `Fill the form below to Sign up`;
  });
}

// Login Modal
const loginModal = document.getElementById("login");
if (loginModal) {
  loginModal.addEventListener("show.bs.modal", (event) => {
    // Button that triggered the modal
    const button = event.relatedTarget;
    // Extract info from data-bs-* attributes
    const recipient = button.getAttribute("data-bs-whatever");
    // If necessary, you could initiate an Ajax request here
    // and then do the updating in a callback.

    // Update the modal's content.
    const modalTitle = loginModal.querySelector(".modal-title");
    // Optionally, you can update the modal title here
    // modalTitle.textContent = `Login`;
  });
}

// Create Post Modal
const createPostModal = document.getElementById("createPost");
if (createPostModal) {
  createPostModal.addEventListener("show.bs.modal", (event) => {
    // Button that triggered the modal
    const button = event.relatedTarget;
    // Extract info from data-bs-* attributes
    const recipient = button.getAttribute("data-bs-whatever");
    // If necessary, you could initiate an Ajax request here
    // and then do the updating in a callback.

    // Update the modal's content.
    const modalTitle = createPostModal.querySelector(".modal-title");
    // Optionally, you can update the modal title here
    // modalTitle.textContent = `Create Post`;
  });
}
