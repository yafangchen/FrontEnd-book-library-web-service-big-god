import React, { Component } from 'react';

class ListBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: props.userId,
      books: null,

      changeNoteId: null,
      changeNote: null,
      bookId: null,
      book: null,
      note: null,
      domain: "http://127.0.0.1:5000/"
    }
    this.bookNameRef = React.createRef();
    this.firstNameRef = React.createRef();
    this.lastNameRef = React.createRef();
    this.publishDateRef = React.createRef();
    this.loanedOutRef = React.createRef();
    this.listBooks();
  }
  clearAll = () => {
    this.setState({
      books: null,

      book: null,
      note: null,

      bookId: null,
      changeNote: null,
      changeNoteId: null,
    })
  }

  addBook = () => {
    this.clearAll();
    this.setState({
      book: this.bookDetail(null, true, null, null, null),
    })
  }
  createBook = () => {
    console.log("create books.")
  }
  noteDetail = (ownByUser, result, bookId) => {
    console.log("Notes");
  }
  
  bookDetail = (ownByUser, isCreate, result, bookId, ownerId) => {
      const saveBtn = (ownByUser && !isCreate)? <input type="submit" value="Save" onClick={() => this.editBook(bookId, ownerId)}/> : null;
      const delBtn = (ownByUser && !isCreate)? <input type="submit" value="Delete" onClick={() => this.deleteBook(bookId)}/> : null;
      const createBtn = isCreate? <input type="submit" value="Create" onClick={this.createBook}/> : null;
      if (isCreate) {
        ownByUser = true;
      }
      let bookName = "";
      let firstName = "";
      let lastName = "";
      let publishDate = "";
      let loanedOut = "";
      if (!isCreate) {
        bookName = result.BookName;
        firstName = result.FirstName;
        lastName = result.LastName;
        publishDate = result.PublishDate;
        loanedOut = result.LoanedOut === null? "No" : "Yes";
      }
      const book = <p>
        Book Name: <input readOnly={!ownByUser} ref={this.bookNameRef} defaultValue={bookName}></input> <br/>
        Author: <br/>
        First Name: <input readOnly={!ownByUser} ref={this.firstNameRef} defaultValue={firstName}></input> <br/>
        Last Name: <input readOnly={!ownByUser} ref={this.lastNameRef} defaultValue={lastName}></input> <br/>
        Publish Date: <input readOnly={!ownByUser} ref={this.publishDateRef} defaultValue={publishDate}></input> <br/>
        Loaned Out: <input readOnly={!ownByUser} ref={this.loanedOutRef} defaultValue={loanedOut}></input> <br/>
        {createBtn} {saveBtn} {delBtn}<br/>
      </p>
      return book;
  }

  editBook = (bookId, ownerId) => {
    console.log(bookId)
    console.log(ownerId)
    //console.log(this.bookForm);
    const title = this.bookNameRef.current.value;
    const publishDate = this.publishDateRef.current.value;
    // const loanedOut = this.loanedOutRef.current.value;
    const bookUrl = this.state.domain + "books/" + bookId + "?title=" + title + "&publish_date=" + publishDate;
    fetch(bookUrl, {method: "PUT"})
    .then(resp => resp.json())
    .then(result => {
      console.log(result);
      this.showBook(bookId, ownerId);
    })
    console.log(bookId);
  }

  deleteBook = (bookId) => {
    const book = this.state.domain + "books/" + bookId;
    fetch(book, {method: "DELETE"})
    .then(resp => resp.json())
    .then(result => {
      this.listBooks();
    })
  }

  showBook = (bookId, ownerId) => {
    this.clearAll();
    const bookUrl = this.state.domain + "books/" + bookId;
    const ownByUser = (this.state.userId == ownerId);
    this.setState({
      bookId: bookId,
    })
    fetch(bookUrl)
    .then(resp => resp.json())
    .then(result => {
      this.setState({
        book: this.bookDetail(ownByUser, false, result, bookId, ownerId),
      })
    })
    const noteUrl = this.state.domain + "notes/?book_id=" + bookId;
    fetch(noteUrl)
    .then(resp => resp.json())
    .then(result => {
      this.setState({
        note: this.noteDetail(ownByUser, result, bookId),
      })
    })
  }

  listBooks = (userId) => {
    this.clearAll();
    let url = this.state.domain + "books/"
    console.log(userId);
    if (userId !== undefined) {
      url = url + "?owner_id=" + userId;
    }
    console.log(url);
    fetch(url)
    .then(resp => resp.json())
    .then(result => {
      const books = <table>
        <thead>
        <tr><th colSpan="4">Books</th></tr>
        <tr>
        <th>Book Name</th>
        <th>Author</th>
        <th>Publish Date</th>
        <th>Loaned Out</th>
        </tr>
        </thead>
        <tbody>
        {result.map(rec =>
          <tr onClick={() => this.showBook(rec.BookId, rec.OwnerId)}>
            <td>{rec.BookName}</td>
            <td>{rec.FirstName} {rec.LastName}</td>
            <td>{rec.PublishDate}</td>
            <td>{rec.LoanedOut}</td>
          </tr>
        )}
        </tbody>
      </table>
      this.setState({
        books: books,
      })
    });
  }
  render() {
    const a = true;
    const b = false;
    return (
      <div>
      <button type="button" onClick={() => this.listBooks(undefined)}>List all books</button>
      <button type="button" onClick={() => this.listBooks(this.state.userId)}>List my books</button>
      <button type="button" onClick={() => this.addBook()}>Add Book</button>
      {this.state.books}
      {this.state.book}
      {this.state.note}
      </div>
    );
  }
}

export default ListBook;
