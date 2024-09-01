// biome-ignore lint/style/useNodejsImportProtocol: stupid strict lint.
import { Buffer } from "buffer";
import { useEffect, useState } from "react";
import {
	createThirdwebClient,
	getContract,
	prepareContractCall,
	readContract,
} from "thirdweb";
// We need this for our RPC. We have to tell our ThirdWeb SDK
// that our smart contracts are deployed to Hardhat testnet for our transactions
import { hardhat, sepolia } from "thirdweb/chains";
// This is needed, the ConnectEmbed has an embeeded Wallet Modal
import {
	ConnectEmbed,
	ThirdwebProvider,
	useActiveAccount,
	useSendAndConfirmTransaction,
} from "thirdweb/react";
// Used to define our wallets. Feel free to experiment after
// this
import { createWallet } from "thirdweb/wallets";
// We need this for our ABI so that it can be used
// for our getContract function to export our smart contracts
// to our JS code
import contractData from "./contracts/BookShelf.json";

// This is needed to use ThirdWeb SDK
const client = createThirdwebClient({
	// We will use the value from our `.env.local`
	clientId: process.env.REACT_APP_CLIENT_ID,
});

console.log("Client", client);

// Install this wallets later for experimental purposes
// We will be using Metamask for the most part
const wallets = [
	createWallet("io.metamask"),
	createWallet("app.phantom"),
	createWallet("me.rainbow"),
];

// Our first smart contract on the network
const contract1 = getContract({
	client,
	chain: hardhat,
	address: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
	abi: contractData.abi,
});

// Our second smart contract on the network
const contract2 = getContract({
	client,
	chain: hardhat,
	address: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
	abi: contractData.abi,
});

const BookList = ({ isPublishTransacted }) => {
	const [bookList, setBookList] = useState([]);

	useEffect(() => {
		if (isPublishTransacted) {
			const cleanBookList = [];
			const handleBookList = async () => {
				const books = await readContract({
					contract: contract1,
					method: "getAuthorBooks",
				});

				for (let book = 0; book < books.length; book++) {
					const title = Buffer.from(books[book].title.slice(2), "hex").toString();
					const content = Buffer.from(
						books[book].content.slice(2),
						"hex",
					).toString();
					const date = Buffer.from(
						books[book].published_date.slice(2),
						"hex",
					).toString();
					const price = books[book].price;

					cleanBookList.push(
						<li key={book}>
							<h2>{title}</h2>
							<details>
								<summary>Content</summary>
								<time dateTime={date}>Published on {date}</time>
								<p>Pricing: ${price}</p>
								<p>{content}</p>
							</details>
						</li>,
					);
				}
				setBookList(cleanBookList);
			};
			handleBookList();
		}
	}, [isPublishTransacted]);

	return (
		<div>
			<h1>Author's Published Titles</h1>
			<ul className="books">{bookList ? bookList : ""}</ul>
		</div>
	);
};

// This is to make sure you see which wallet
// is currently active
const AdditionalInfo = ({ author }) => {
	const activeAccount = useActiveAccount();
	if (activeAccount === undefined) {
		return <>
			<h2>Your wallet is not connected. Please connect.</h2>
			{author ? <h2>Author's address: {author}</h2> : ""}
			<h2>Smart Contract Address: {contract1.address}</h2>
		</>
	}
	return (
		<>
			<h2>Currently Connected Wallet Address: {activeAccount.address}</h2>
			{author ? <h2>Author's address: {author}</h2> : ""}
			<h2>Smart Contract Address: {contract1.address}</h2>
		</>

	);
};

// Just some fancy delay
async function submitFormDelay() {
	await new Promise((res) => setTimeout(res, 1000));
}

// We use this to perform the fancy delay and to check
// the state if the transaction is still transacting
const Submit = ({ isPending }) => {
	const [pending, setNoPending] = useState(false);

	async function handleSubmit() {
		setNoPending(isPending);
		console.log("Receipt", isPending);
		await submitFormDelay();
		setNoPending(false);
	}
	return (
		<button type="submit" onClick={handleSubmit}>
			{pending ? "Publishing..." : "Publish"}
		</button>
	);
};

const Status = ({ status }) => {
	if (status === undefined) {
		return "❎ Only author can publish books";
	}
	if (status.status === "success") {
		return "✅";
	}
	// else if "error"
	return "❎ Only author can publish books";
};

const PublishBook = ({ author }) => {
	// transactReceipt is used as a Context
	// sendAndConfirmTx causes this Context to change
	// 1. Either as an error e.g undefined; or
	// 2. Success
	const { mutate: sendAndConfirmTx, data: transactReceipt } =
		useSendAndConfirmTransaction();
	// This initialises the default using `useState`.
	const [formData, setFormData] = useState({
		title_: "",
		content_: "",
		authorname_: "",
		date_: "",
		purchase_counter_: 10,
		price_: 0,
		bookstatus_: 0,
	});

	// Let's check the active Account
	const activeAccount = useActiveAccount();
	// Let's check if the active Account is also the author
	const isAuthor = activeAccount?.address === author;

	// Let us handle the submission asynchronously
	// since a lot of the functions here are
	// a bunch of Promises
	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log("formData before submission", formData);

		let status = 0;
		// Remember the enum?
		// 0 - NotAvailable
		// 1 - Available
		if (formData.bookstatus_ !== "NotAvailable") {
			status = 1;
		}
		console.log("Contract1", contract1);
		console.log("Contract2", contract2);
		const transaction = prepareContractCall({
			contract: contract1,
			method: "publishBook",
			params: [
				formData.title_,
				formData.content_,
				formData.authorname_,
				formData.date_.toString(),
				Number.parseInt(formData.purchase_counter_),
				Number.parseInt(formData.price_),
				status,
			],
		});
		sendAndConfirmTx(transaction);
		setFormData({
			title_: "",
			content_: "",
			authorname_: "",
			date_: "",
			purchase_counter_: 10,
			price_: 0,
			bookstatus_: 0,
		});
	};
	if (!isAuthor) {
		return (
			<>
				<h1>Welcome to my humble abode!</h1>
				<BookList isPublishTransacted={true} />
			</>
		);
	}
	return (
		<>
			<BookList isPublishTransacted={transactReceipt?.status === "success"} />
			<h1>Publishing a new book? Go here!</h1>
			<h2>🥴 Requires author-ization. No pun intended 🤣</h2>
			<h2>
				Last Transaction Status: <Status status={transactReceipt} />
			</h2>
			{transactReceipt ? <h3>From: {transactReceipt.from}</h3> : ""}
			{transactReceipt ? <h3>To: {transactReceipt.to}</h3> : ""}
			{transactReceipt ? (
				<h3>Transaction Hash: {transactReceipt.transactionHash}</h3>
			) : (
				""
			)}
			{transactReceipt ? <h3>Block Hash: {transactReceipt.blockHash}</h3> : ""}
			<form
				className="form-container"
				onSubmit={(e) => {
					handleSubmit(e);
				}}
			>
				<label>
					Title:
					<input
						type="text"
						value={formData.title_}
						onChange={(e) =>
							setFormData({ ...formData, title_: e.target.value })
						}
						required
					/>
				</label>
				<label>
					Author name:
					<input
						type="text"
						value={formData.authorname_}
						onChange={(e) =>
							setFormData({ ...formData, authorname_: e.target.value })
						}
						required
					/>
				</label>
				<label>
					Date published:
					<input
						type="date"
						value={formData.date_}
						onChange={(e) =>
							setFormData({ ...formData, date_: e.target.value })
						}
						required
					/>
				</label>
				<label>
					Price in USD:
					<input
						type="number"
						value={formData.price_}
						onChange={(e) =>
							setFormData({ ...formData, price_: e.target.value })
						}
						required
					/>
				</label>
				<label>
					Number of copies:
					<input
						type="number"
						value={formData.purchase_counter_}
						onChange={(e) =>
							setFormData({ ...formData, purchase_counter_: e.target.value })
						}
						required
					/>
				</label>
				{/* biome-ignore lint/nursery/noLabelWithoutControl: <explanation> */}
				<label>Set Availability</label>
				<select
					value={formData.bookstatus_}
					onChange={(e) =>
						setFormData({ ...formData, bookstatus_: e.target.value })
					}
					required
				>
					<option value="Available">Available</option>
					<option value="Unavailable">Unavailable</option>
				</select>
				{/* biome-ignore lint/nursery/noLabelWithoutControl: <explanation> */}
				<label>Content</label>
				<label>
					<textarea
						value={formData.content_}
						onChange={(e) =>
							setFormData({ ...formData, content_: e.target.value })
						}
						rows={20}
						cols={100}
						required
					/>
				</label>
				<Submit isPending={transactReceipt} />
			</form>
		</>
	);
};

const AppBase = ({ author }) => {
	return (
		<>
			<h1>BookShelf</h1>
			<AdditionalInfo author={author} />
		</>
	);
};

const App = () => {
	// We also want to know who the author
	// of the contracts are
	const [author, setAuthor] = useState(undefined);

	useEffect(() => {
		const handleAuthor = async () => {
			const author = await readContract({
				contract: contract1,
				method: "author",
			});

			setAuthor(author);
		};
		handleAuthor();
	});

	// We need to pass the variables here for ConnectEmbed, otherwise, this will error.
	return (
		<div className="container">
			<ThirdwebProvider>
				<AppBase author={author} />
				<ConnectEmbed
					chain={hardhat}
					modalSize={"wide"}
					client={client}
					wallets={wallets}
				/>
				<PublishBook author={author} />
			</ThirdwebProvider>
		</div>
	);
};

export default App;