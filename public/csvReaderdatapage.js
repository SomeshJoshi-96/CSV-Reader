document.addEventListener("DOMContentLoaded", function () {
  const content = document.querySelector("#mainContainer");
  const itemsPerPage = 100;
  let currentPage = 0;
  const paginationContainer = document.createElement("div");
  const items = Array.from(content.getElementsByTagName("tr")).slice(1);
  var sortingOrders = [];
  var headers;

  console.log(items);

  let startIndex;
  let endIndex;

  function showPage(page) {
    startIndex = page * itemsPerPage;
    endIndex = startIndex + itemsPerPage;

    items.forEach((item, index) => {
      item.classList.toggle("hidden", index < startIndex || index >= endIndex);
    });
    updateActiveButtonStates();
  }

  function createPageButtons() {
    const totalPages = Math.ceil(items.length / itemsPerPage);
    paginationContainer.classList.add("pagination");

    // Add page buttons
    for (let i = 0; i < totalPages; i++) {
      const pageButton = document.createElement("button");
      pageButton.textContent = i + 1;
      pageButton.addEventListener("click", () => {
        currentPage = i;
        showPage(currentPage);
        updateActiveButtonStates();
      });

      paginationContainer.appendChild(pageButton);
    }
  }

  content.appendChild(paginationContainer);

  function updateActiveButtonStates() {
    const pageButtons = document.querySelectorAll(".pagination button");
    pageButtons.forEach((button, index) => {
      if (index === currentPage) {
        button.classList.add("active");
      } else {
        button.classList.remove("active");
      }
    });
  }

  createPageButtons();
  showPage(currentPage);

  //For sorting table
  const headersElements = document.getElementsByTagName("th");
  Array.from(headersElements).forEach((header) => {
    header.addEventListener("click", (event) => {
      console.log(header);
      var target = event.target;
      headers = target.parentNode.children;
      for (var i = 0; i < headers.length; i++) {
        if (headers[i] === target) {
          console.log(i);
          sortTable(i);
          break;
        }
      }
    });
  });

  function sortTable(columnIndex) {
    if (!sortingOrders[columnIndex]) {
      sortingOrders[columnIndex] = "asc";
    } else {
      sortingOrders[columnIndex] =
        sortingOrders[columnIndex] === "asc" ? "desc" : "asc";
    }

    var table, rows, switching, i, x, y, shouldSwitch, xContent, yContent;
    table = document.getElementById("csvdataTable");
    switching = true;

    while (switching) {
      switching = false;
      rows = table.rows;

      // Loop through all table rows (except the header)
      for (i = startIndex; i <= endIndex; i++) {
        if (i == 0) {
          continue;
        }
        shouldSwitch = false;

        // Get the two elements to compare
        x = rows[i].getElementsByTagName("TD")[columnIndex];
        y = rows[i + 1].getElementsByTagName("TD")[columnIndex];
        xContent = x.innerHTML.trim();
        yContent = y.innerHTML.trim();

        // Compare based on the sorting order
        if (sortingOrders[columnIndex] === "asc") {
          if (!isNaN(xContent) && !isNaN(yContent)) {
            if (parseFloat(xContent) > parseFloat(yContent)) {
              shouldSwitch = true;
              break;
            }
          } else {
            if (xContent.toLowerCase() > yContent.toLowerCase()) {
              shouldSwitch = true;
              break;
            }
          }
        } else {
          if (!isNaN(xContent) && !isNaN(yContent)) {
            if (parseFloat(xContent) < parseFloat(yContent)) {
              shouldSwitch = true;
              break;
            }
          } else {
            if (xContent.toLowerCase() < yContent.toLowerCase()) {
              shouldSwitch = true;
              break;
            }
          }
        }
      }

      // Perform the switch if shouldSwitch is true
      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
  }

  //eventlistener for dropdownItems
  const filterValue = document.getElementById("filterValue");
  const dropdownItems = document.getElementsByClassName("dropdown-item");
  Array.from(dropdownItems).forEach((dropdownItem) => {
    dropdownItem.addEventListener("click", () => {
      console.log(dropdownItem.innerText);
      filterValue.innerText = dropdownItem.innerText;
    });
  });

  //event listener for search input
  const searchBytextInput = document.getElementById("searchBytextInput");
  searchBytextInput.addEventListener("input", () => {
    console.log(searchBytextInput.value);
  });

  //event listener for search button
  const searchButton = document.getElementById("searchButton");
  searchButton.addEventListener("click", () => {
    const searchBytextInputvalue = searchBytextInput.value;
    const headerFiltervalue = filterValue.innerText;
    console.log(searchBytextInputvalue, headerFiltervalue);
    searchResults(headerFiltervalue, searchBytextInputvalue);
  });

  function searchResults(header, text) {
    if (!header) {
      return;
    }

    table = document.getElementById("csvdataTable");
    const rows = table.rows;
    console.log(header, text, rows.length);
    const headersElements = document.getElementsByTagName("th");

    console.log(headersElements);
    var searchIndex;
    for (var i = 0; i < headersElements.length; i++) {
      console.log(headersElements[i].innerText);
      if (headersElements[i].innerText === header) {
        console.log(i);
        searchIndex = i;
        break;
      }
    }

    for (i = startIndex; i <= endIndex; i++) {
      if (i == 0) {
        continue;
      }
      x = rows[i].getElementsByTagName("TD")[searchIndex].textContent;
      console.log(i, x);

      if (!x.toLowerCase().includes(text.toLowerCase())) {
        rows[i].classList.add("hidden");
      } else {
        if (rows[i].classList.contains("hidden")) {
          rows[i].classList.remove("hidden");
        }
      }
    }
  }
});
