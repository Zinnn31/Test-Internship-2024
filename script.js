document.addEventListener('DOMContentLoaded', () => {
    const categoryForm = document.getElementById('categoryForm');
    const bookForm = document.getElementById('bookForm');
    const categoryList = document.getElementById('categoryList');
    const bookList = document.getElementById('bookList');
    const searchButton = document.getElementById('searchButton');
    const searchText = document.getElementById('searchText');
    const searchDate = document.getElementById('searchDate');
    const bookCategory = document.getElementById('bookCategory');

    function fetchCategories() {
        fetch('categories.php?action=list')
            .then(response => response.json())
            .then(data => {
                categoryList.innerHTML = '';
                bookCategory.innerHTML = '<option value="">Select Category</option>';
                data.forEach(category => {
                    categoryList.innerHTML += `<li>${category.name} 
                        <button class="edit" data-id="${category.id}" data-name="${category.name}">Edit</button>
                        <button class="delete" data-id="${category.id}">Delete</button></li>`;
                    bookCategory.innerHTML += `<option value="${category.id}">${category.name}</option>`;
                });
            });
    }

    function fetchBooks() {
        fetch('books.php?action=list')
            .then(response => response.json())
            .then(data => {
                bookList.innerHTML = '';
                data.forEach(book => {
                    bookList.innerHTML += `<li>${book.title} by ${book.author} (${book.publisher}, ${book.publication_date}) 
                        <button class="edit" data-id="${book.id}" data-title="${book.title}" data-author="${book.author}" 
                        data-publication-date="${book.publication_date}" data-publisher="${book.publisher}" 
                        data-pages="${book.pages}" data-category-id="${book.category_id}">Edit</button>
                        <button class="delete" data-id="${book.id}">Delete</button></li>`;
                });
            });
    }

    categoryForm.addEventListener('submit', e => {
        e.preventDefault();
        const categoryId = document.getElementById('categoryId').value;
        const categoryName = document.getElementById('categoryName').value;
        const action = categoryId ? 'update' : 'create';
        fetch(`categories.php?action=${action}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: categoryId, name: categoryName })
        }).then(() => {
            fetchCategories();
            categoryForm.reset();
        });
    });

    bookForm.addEventListener('submit', e => {
        e.preventDefault();
        const bookId = document.getElementById('bookId').value;
        const bookTitle = document.getElementById('bookTitle').value;
        const bookAuthor = document.getElementById('bookAuthor').value;
        const bookPublicationDate = document.getElementById('bookPublicationDate').value;
        const bookPublisher = document.getElementById('bookPublisher').value;
        const bookPages = document.getElementById('bookPages').value;
        const bookCategoryValue = bookCategory.value;
        const action = bookId ? 'update' : 'create';
        fetch(`books.php?action=${action}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: bookId,
                title: bookTitle,
                author: bookAuthor,
                publication_date: bookPublicationDate,
                publisher: bookPublisher,
                pages: bookPages,
                category_id: bookCategoryValue
            })
        }).then(() => {
            fetchBooks();
            bookForm.reset();
        });
    });

    categoryList.addEventListener('click', e => {
        if (e.target.classList.contains('delete')) {
            const id = e.target.getAttribute('data-id');
            fetch(`categories.php?action=delete&id=${id}`)
                .then(() => fetchCategories());
        } else if (e.target.classList.contains('edit')) {
            const id = e.target.getAttribute('data-id');
            const name = e.target.getAttribute('data-name');
            document.getElementById('categoryId').value = id;
            document.getElementById('categoryName').value = name;
        }
    });

    bookList.addEventListener('click', e => {
        if (e.target.classList.contains('delete')) {
            const id = e.target.getAttribute('data-id');
            fetch(`books.php?action=delete&id=${id}`)
                .then(() => fetchBooks());
        } else if (e.target.classList.contains('edit')) {
            const id = e.target.getAttribute('data-id');
            const title = e.target.getAttribute('data-title');
            const author = e.target.getAttribute('data-author');
            const publicationDate = e.target.getAttribute('data-publication-date');
            const publisher = e.target.getAttribute('data-publisher');
            const pages = e.target.getAttribute('data-pages');
            const categoryId = e.target.getAttribute('data-category-id');

            document.getElementById('bookId').value = id;
            document.getElementById('bookTitle').value = title;
            document.getElementById('bookAuthor').value = author;
            document.getElementById('bookPublicationDate').value = publicationDate;
            document.getElementById('bookPublisher').value = publisher;
            document.getElementById('bookPages').value = pages;
            document.getElementById('bookCategory').value = categoryId;
        }
    });

    searchButton.addEventListener('click', () => {
        const text = searchText.value;
        const date = searchDate.value;
        fetch(`books.php?action=search&text=${text}&date=${date}`)
            .then(response => response.json())
            .then(data => {
                bookList.innerHTML = '';
                data.forEach(book => {
                    bookList.innerHTML += `<li>${book.title} by ${book.author} (${book.publisher}, ${book.publication_date}) <button class="delete" data-id="${book.id}">Delete</button></li>`;
                });
            });
    });

    fetchCategories();
    fetchBooks();
});
