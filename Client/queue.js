document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:3003/queue')
        .then(response => response.json())
        .then(data => {
            let table = document.querySelector('table');
            let tbody = document.createElement('tbody');
            // Use a for loop to have access to the index
            for (let i = 0; i < data.data.length; i++) {
                let row = data.data[i];
                let tr = document.createElement('tr');

                for (let column in row) {
                   

                    let td = document.createElement('td')
                        
                        if (column == "dob"){
                          td.textContent = moment(row[column]).format("MM Do YYYY")
                        }
                        else{ td.textContent = row[column]}
                        
                        tr.appendChild(td)
                        
                    /*
                    let td = document.createElement('td');
                    td.textContent = row[column];
                    tr.appendChild(td);
                    console.log(column)
                    */
                }
                
                let moveUpButton = document.createElement('button');
                moveUpButton.textContent = '↑';
                moveUpButton.addEventListener('click', () => moveUp(row.unique_number));

                // If it's the first row, disable the "Up" button
                if (i === 0) {
                    moveUpButton.disabled = true;
                }

                tr.appendChild(moveUpButton);

                let moveDownButton = document.createElement('button');
                moveDownButton.textContent = '↓';
                moveDownButton.addEventListener('click', () => moveDown(row.unique_number));

                // If it's the last row, disable the "Down" button
                if (i === data.data.length - 1) {
                    moveDownButton.disabled = true;
                }

                tr.appendChild(moveDownButton);

                let deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', () => {
                    if (confirm('Are you sure you want to delete this patient?')) {
                        deletePatient(row.unique_number);
                    }
                });
                tr.appendChild(deleteButton);

                tbody.appendChild(tr);
            }

            table.appendChild(tbody);

        })
        .catch((error) => {
            console.error('Error:', error);
        });
});

function moveUp(uniqueNumber) {
    fetch('http://localhost:3003/decreaseposition', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                unique_number: uniqueNumber
            }),
        })
        .then(response => {
            if (response.ok) {
                location.reload(); // reload the page to reflect the changes in the table
            } else {
                console.error('Failed to move patient up the queue');
            }
        })
        .catch(error => console.error('Error:', error));
}

function moveDown(uniqueNumber) {
    fetch('http://localhost:3003/increaseposition', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                unique_number: uniqueNumber
            }),
        })
        .then(response => {
            if (response.ok) {
                location.reload(); // reload the page to reflect the changes in the table
            } else {
                console.error('Failed to move patient down the queue');
            }
        })
        .catch(error => console.error('Error:', error));
}

function deletePatient(uniqueNumber) {
    fetch('http://localhost:3003/deletePatient', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                unique_number: uniqueNumber
            }),
        })
        .then(response => {
            if (response.ok) {
                location.reload(); // reload the page to reflect the changes in the table
            } else {
                console.error('Failed to delete patient from the queue');
            }
        })
        .catch(error => console.error('Error:', error));
}