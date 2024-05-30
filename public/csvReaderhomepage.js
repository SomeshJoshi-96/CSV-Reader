//Setting event listener for viewFile
const viewFiles = document.getElementsByClassName("viewFile");
const deleteFiles = document.getElementsByClassName("deleteFile");
const descriptionError = document.getElementById("descriptionError");
const nameError = document.getElementById("nameError");
const authorError = document.getElementById("authorError");
const fileError = document.getElementById("fileError");

Array.from(viewFiles).forEach((viewFile) => {
  viewFile.addEventListener("click", (event) => {
    console.log("View file clicked");
    const viewDiv = event.currentTarget;
    const row = viewDiv.closest("tr");
    console.log(row);
    const idDiv = row.querySelector(".id");
    console.log(idDiv);
    console.log(idDiv.textContent);
    const id = idDiv.textContent;
    window.location.href = "/api/csv/" + encodeURIComponent(id);
  });
});

Array.from(deleteFiles).forEach((deleteFile) => {
  deleteFile.addEventListener("click", (event) => {
    console.log("Delete file clicked");
    const viewDiv = event.currentTarget;
    const row = viewDiv.closest("tr");
    console.log(row);
    const idDiv = row.querySelector(".id");
    console.log(idDiv.textContent);
    const id = idDiv.textContent;
    deleteFilewithID(id);
  });
});

async function deleteFilewithID(id) {
  try {
    const response = await fetch(`http://localhost:8000/api/csv/delete/${id}`, {
      method: "delete",
    });

    if (!response.ok) {
      throw new Error(response.error);
    }
    console.log("File Deleted Sucessfully!");
    window.location.reload();
  } catch (err) {
    console.error(err);
  }
}

//Add csv form
const addCsvform = document.getElementById("addCsvform");
addCsvform.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    console.log("addCsvform");
    const formData = new FormData();
    addCsvform.querySelectorAll("input").forEach((input) => {
      formData.append(input.name, input.files ? input.files[0] : input.value);
    });
    const response = await fetch(addCsvform.action, {
      method: addCsvform.method,
      body: formData,
    });

    if (!response.ok) {
      const errorResponse = await response.json();

      if (errorResponse.error) {
        fileError.innerText = errorResponse.error;
        setTimeout(function () {
          descriptionError.innerText = "";
          nameError.innerText = "";
          authorError.innerText = "";
          fileError.innerText = "";
        }, 5000);

        throw new Error("Incomplete Form");
      } else {
        if (errorResponse.res.description) {
          console.log(errorResponse.res.description);
          descriptionError.innerText = errorResponse.res.description.message;
        }
        if (errorResponse.res.name) {
          console.log(errorResponse.res.name);
          nameError.innerText = errorResponse.res.name.message;
        }
        if (errorResponse.res.author) {
          console.log(errorResponse.res.author);
          authorError.innerText = errorResponse.res.author.message;
        }
        if (errorResponse.res.filename) {
          console.log(errorResponse.res.filename);
          fileError.innerText = errorResponse.res.filename.message;
        }

        setTimeout(function () {
          descriptionError.innerText = "";
          nameError.innerText = "";
          authorError.innerText = "";
          fileError.innerText = "";
        }, 5000);
        throw new Error("Incomplete Form");
      }
    }
    console.log("Form submitted successfully");
    window.location.reload();
  } catch (error) {
    // Handle errors here
    console.error("Error submitting form", error);
  }
});
