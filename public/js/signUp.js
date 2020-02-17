const checkUsername = function () {
  const username = document.querySelector('input[name="username"]').value;
  const messageElement = document.querySelector('.message');

  if (username.length < 3) {
    messageElement.innerText = ' ';
    return;
  }

  requestPost('checkUsername', {username}, (responseText) => {
    const {isAvailable} = responseText;
    if (!isAvailable) {
      messageElement.innerText = 'username is not available';
    } else {
      messageElement.innerHTML = ' ';
    }
  });
};
