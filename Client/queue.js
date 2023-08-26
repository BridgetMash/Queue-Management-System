document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:3003/queue')
        .then(response => response.json())
        .then(data => {
            let table = document.querySelector('table');
            let tbody = document.createElement('tbody');
            data.data.forEach((row) => {
                let tr = document.createElement('tr');
                for (let column in row) {
                    let td = document.createElement('td');
                    td.textContent = row[column];
                    tr.appendChild(td);
                }
                let moveUpButton = document.createElement('button');
                moveUpButton.textContent = '↑';
                moveUpButton.addEventListener('click', () => moveUp(row.unique_number));
                tr.appendChild(moveUpButton);
                tbody.appendChild(tr);
            });
            table.appendChild(tbody);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});

function moveUp(uniqueNumber) {
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
            console.error('Failed to move patient up the queue');
        }
    })
    .catch(error => console.error('Error:', error));
}