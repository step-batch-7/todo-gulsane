const addTitleCard = function(title) {
  const div = document.createElement('div');
  div.className = 'title';
  const h2 = document.createElement('h2');
  h2.innerText = title;
  div.appendChild(h2);
  const hr = document.createElement('hr');
  div.appendChild(hr);
  return div;
};

const saveTitle = function() {
  const req = new XMLHttpRequest();
  req.open('POST', '/saveTitle');
  req.setRequestHeader('Content-Type', 'application/json');
  req.onload = function() {
    if (req.status === 201) {
      const rightContainer = document.querySelector('.rightContainer');
      const title = JSON.parse(req.responseText).value;
      rightContainer.appendChild(addTitleCard(title));
    }
  };
  const value = document.getElementById('titleInnerText').value;
  req.send(JSON.stringify({ value }));
};
