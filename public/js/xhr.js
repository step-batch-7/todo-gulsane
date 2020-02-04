const sendRequest = function() {
  const req = new XMLHttpRequest();
  req.open('POST', '/saveTitle');
  req.setRequestHeader('Content-Type', 'application/json');
  req.onload = function() {
    if (req.status === 201) {
      const titles = document.querySelector('.titles');
      console.log(titles);
      const title = JSON.parse(req.responseText).value;
      titles.innerText = title;
    }
  };
  const value = document.getElementById('titleInnerText').value;
  req.send(JSON.stringify({ value }));
};
