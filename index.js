// Open (or create) the database
let openRequest = indexedDB.open("myDatabase", 1);
/* const MAX_QUOTA = 50 * 1024 * 1024; // 50MB
 */

// Create the schema
openRequest.onupgradeneeded = function () {
	let db = openRequest.result;
	if (!db.objectStoreNames.contains('user_data')) { // if there's no "user_data" store
		db.createObjectStore('user_data', { keyPath: 'id', autoIncrement: true }); // create it
	}
};

openRequest.onerror = function () {
	console.error("Error", openRequest.error);
};

/* The `openRequest.onsuccess` function is called when the database is successfully opened or created.
Inside this function, we can perform operations on the database, such as saving form data,
retrieving data, and displaying it in a table. */
openRequest.onsuccess = function () {
	let db = openRequest.result;

	// Save form data to the database
	document.getElementById('myForm').addEventListener('submit', function (event) {
		event.preventDefault();

		var name = document.getElementById('name').value;
		var email = document.getElementById('email').value;

		let transaction = db.transaction("user_data", "readwrite");

		transaction.oncomplete = function () {
			console.log("Transaction completed");
		};

		transaction.onerror = function () {
			console.log("Transaction not completed", transaction.error);
		};

		let user_data = transaction.objectStore("user_data");
		let request = user_data.add({ name: name, email: email });


		request.onsuccess = function () {
			console.log("User data added to the database");

			// Clear the form
			document.getElementById('name').value = '';
			document.getElementById('email').value = '';

			// Display the data in a table
			let transaction = db.transaction("user_data", "readonly");
			let user_data = transaction.objectStore("user_data");
			let request = user_data.getAll();

			request.onsuccess = function () {
				let users = request.result;
				let table = document.getElementById('userTable');
				table.innerHTML = ''; // Clear the table

				// Create table headers
				let headerRow = document.createElement('tr');
				let nameHeader = document.createElement('th');
				let emailHeader = document.createElement('th');

				nameHeader.textContent = 'Name';
				emailHeader.textContent = 'Email';

				headerRow.appendChild(nameHeader);
				headerRow.appendChild(emailHeader);
				table.appendChild(headerRow);

				// Add a new row for each user
				users.forEach(user => {
					let row = document.createElement('tr');
					let nameCell = document.createElement('td');
					let emailCell = document.createElement('td');
					let deleteCell = document.createElement('td');
					let deleteButton = document.createElement('button');

					nameCell.textContent = user.name;
					emailCell.textContent = user.email;
					deleteButton.textContent = 'Delete';
					deleteButton.addEventListener('click', function () {
						let deleteTransaction = db.transaction("user_data", "readwrite");
						let user_data = deleteTransaction.objectStore("user_data");
						let deleteRequest = user_data.delete(user.id);

						deleteRequest.onsuccess = function () {
							console.log("User data deleted from the database");
							row.parentNode.removeChild(row); // Remove the row from the table
						};

						deleteRequest.onerror = function () {
							console.log("Error", deleteRequest.error);
						};
					});

					deleteCell.appendChild(deleteButton);
					row.appendChild(nameCell);
					row.appendChild(emailCell);
					row.appendChild(deleteCell);
					table.appendChild(row);
				});
			};
		};

		request.onerror = function () {
			console.log("Error", request.error);
		};
	});
	function displayData() {
		let transaction = db.transaction("user_data", "readonly");
		let user_data = transaction.objectStore("user_data");
		let request = user_data.getAll();

		request.onsuccess = function () {
			let users = request.result;
			let table = document.getElementById('userTable');
			table.innerHTML = ''; // Clear the table

			// Create table headers
			let headerRow = document.createElement('tr');
			let nameHeader = document.createElement('th');
			let emailHeader = document.createElement('th');
			let deleteHeader = document.createElement('th');

			nameHeader.textContent = 'Name';
			emailHeader.textContent = 'Email';
			deleteHeader.textContent = 'Delete';

			headerRow.appendChild(nameHeader);
			headerRow.appendChild(emailHeader);
			headerRow.appendChild(deleteHeader);
			table.appendChild(headerRow);

			// Add a new row for each user
			users.forEach(user => {
				let row = document.createElement('tr');
				let nameCell = document.createElement('td');
				let emailCell = document.createElement('td');
				let deleteCell = document.createElement('td');
				let deleteButton = document.createElement('button');

				nameCell.textContent = user.name;
				emailCell.textContent = user.email;
				deleteButton.textContent = 'Delete';
				deleteButton.addEventListener('click', function () {
					let deleteTransaction = db.transaction("user_data", "readwrite");
					let user_data = deleteTransaction.objectStore("user_data");
					let deleteRequest = user_data.delete(user.id);

					deleteRequest.onsuccess = function () {
						console.log("User data deleted from the database");
						row.parentNode.removeChild(row); // Remove the row from the table
					};

					deleteRequest.onerror = function () {
						console.log("Error", deleteRequest.error);
					};
				});

				deleteCell.appendChild(deleteButton);
				row.appendChild(nameCell);
				row.appendChild(emailCell);
				row.appendChild(deleteCell);
				table.appendChild(row);
			});
		};

		request.onerror = function () {
			console.log("Error", request.error);
		};
	}
	window.onload = displayData;
};

// Call the function when the page loads