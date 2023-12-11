document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const cardContainer = document.getElementById('cardContainer');
    const noBookFoundContainer = document.querySelector('.no-book-found-container');

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const cards = cardContainer.querySelectorAll('.col');

        let foundBooks = 0;

        cards.forEach(card => {
            const title = card.querySelector('.card-title').innerText.toLowerCase();
            const author = card.querySelector('.card-text:nth-child(2)').innerText.toLowerCase();
            const genre = card.querySelector('.card-text:nth-child(3)').innerText.toLowerCase();

            if (title.includes(searchTerm) || author.includes(searchTerm) || genre.includes(searchTerm)) {
                card.style.display = 'block';
                foundBooks++;
            } else {
                card.style.display = 'none';
            }
        });

        if (foundBooks === 0) {
            noBookFoundContainer.style.display = 'block';
        } else {
            noBookFoundContainer.style.display = 'none';
        }
    });
});








fetch("/showBook")
  .then((response) => response.json())
  .then((data) => {
    const cardContainer = document.getElementById("cardContainer");

    if (data.message === "No books found.") {
      const noBookFoundContainer = document.querySelector(".no-book-found-container");
      noBookFoundContainer.style.display = "block";
    } else {
      data.forEach((book) => {
        const cardHtml = `
        <div class="col ">
        <div class="card " style="width: 18rem;">
            <img src="${book.imageUrl}" class="card-img-top" alt="..." height="250px;">
            <div class="card-body" style="background-color:rgba(173, 216, 230, 0.5);">
                <h5 class="card-title text-danger">Title: ${book.title}</h5>
                <p class="card-text text-danger">Author: ${book.author}</p>
                <p class="card-text text-danger">Genre: ${book.genre}</p>
                <p class="card-text">
                    <a class="btn btn-primary" href="${book.url}" target="_blank">Start Reading</a>
                </p>
                <a href="${book.fileUrl}" target="_blank" download="${book.title}" style="text-decoration:none;">
                    <i class="fa-solid fa-download fa-lg"></i>
                </a>
    
                <a href="/edit/${book._id}" style="text-decoration:none; color: #001eff;">
                    <i class="fa-solid fa-pen-to-square fa-lg" data-bs-toggle="modal" data-bs-target="#exampleModal"></i>
                </a>
    
                <a href="/delete/${book._id}" style="text-decoration:none; color: #005eff;" class="delete-book">
                    <i class="fa-solid fa-trash fa-lg"></i>
                </a>
            </div>
        </div>
    </div>
    
        `;
        cardContainer.insertAdjacentHTML('beforeend', cardHtml);
      });
    }
  })
  .catch((error) => {
    console.log("Error fetching book data", error);
  });







  document.addEventListener('DOMContentLoaded', () => {
 
    const editButtons = document.querySelectorAll('.fa-pen-to-square');
  
    
    editButtons.forEach(editButton => {
      editButton.addEventListener('click', (event) => {
       
        const bookId = editButton.dataset.bookId; 
  
     
        window.location.href = `/edit/${bookId}`; 
       
      });
    });
  });






