// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/// Function of the `BookShelf` smart contract
/// 1. Author publishes book and can add more books
/// Bounty (?)
/// 2. Author can sell books
/// 3. Author can receive funds from buyers of books
/// 4. There is a limit on how many books are available
/// 5. Buyers will lose the amount of ETH they have after buying
contract BookShelf {
    /// This represents the state
    /// of a book which will be part of
    /// a `BookMetadata` struct
    enum BookStatus {
        NotAvailable,
        Available
    }

    /// This represents a complex type which
    /// will be used for variables later.
    /// It will represent a single book.
    struct BookMetadata {
        address author;
        uint256 bookId;
        uint8 price;
        // Although we can change this to string,
        // it is best to know that strings are
        // computationally expensive in Solidity,
        // therefore, it is best practice to
        // convert it to bytes as much as possible
        bytes title;
        bytes author_name;
        bytes published_date;
        bytes content;
        BookStatus status;
        uint256 purchase_counter;
    }

    /// This mapping allows author to point to different books
    /// they own.
    /// Maybe author has multiple addresses? Who knows 🤷
    mapping(address => BookMetadata[]) private authorBooks;

    /// The address of the author with payable characteristic
    /// to allow ETH as payment
    address payable public author;

    /// A `constructor` is a special function that only runs once
    /// during contract deployment.
    constructor() payable {
        author = payable(msg.sender);
    }

    /// Very self-explanatory. The `publishBook` function
    /// allows the author of the smart contract to publish
    /// more books.
    function publishBook(
        string memory title_,
        // Content could be better. This can either
        // be some form of data such as a file
        // or an NFT. For now, this should suffice
        // for educative purposes of this quest.
        string memory content_,
        string memory authorname_,
        string memory date_,
        uint256 purchase_counter_,
        uint8 price_,
        BookStatus bookstatus_
    ) external {
        require(msg.sender == author, "Only author can publish books");
        uint256 next_book_id = 0;
        uint256 number_of_books = authorBooks[author].length;
        next_book_id = number_of_books + 1;

        /// This is obvious, why sell when you have zero books?
        if (purchase_counter_ == 0) {
            bookstatus_ = BookStatus.NotAvailable;
        }

        BookMetadata memory book = BookMetadata({
            title: bytes(title_),
            content: bytes(content_),
            author: author,
            author_name: bytes(authorname_),
            purchase_counter: purchase_counter_,
            published_date: bytes(date_),
            status: bookstatus_,
            bookId: next_book_id,
            price: price_
        });

        // Add new book to author
        authorBooks[author].push(book);
    }

    function getAuthorBooks() public view returns (BookMetadata[] memory) {
        return authorBooks[author];
    }
}