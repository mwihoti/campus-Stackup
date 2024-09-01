const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("BookShelfDapp", (m) => {
    const bookshelf = m.contract("BookShelf", []);

    // Making sure the order closely resembles to the
    // order of parameters from our smart contract
    // function `publishBook`.
    const title_ = "Introduction to StackUp";
    const content_ = "StackUp brings the awesomeness of Web3";
    const authorname_ = "StackUp";
    const date_ = "2024";
    const purchase_counter_ = 10;
    const price_ = 10;
    // Because book_status is an enum
    // 0 - NotAvailable
    // 1 - Available
    const book_status_ = 1;

    // We call the publishBook function
    // from our smart contract.
    m.call(bookshelf, "publishBook",
        [
            title_,
            content_,
            authorname_,
            date_,
            purchase_counter_,
            price_,
            book_status_
        ]
    );

    // Let's also deploy another smart contract
    // We also add an ID to identify it's a not the other one
    const newBookShelf = m.contract("BookShelf", [], { id: "newBookShelf" })

    // Let's call who's the author of this smart contract
    // but as a read because we don't really want to perform
    // a transaction. We should get the Account #0 as the
    // author
    m.staticCall(newBookShelf, "author", []);

    return { bookshelf, newBookShelf };
});