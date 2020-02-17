const isJSON = function (contentType) {
  return contentType === 'application/json; charset=utf-8';
};

const isOkStatus = function (status) {
  return status === 200;
};

const isValidResponse = function (res) {
  const isOk = isOkStatus(res.status);
  const isJSONContentType = isJSON(res.getResponseHeader('Content-Type'));
  return isOk && isJSONContentType;
};

const requestPost = (url, data, callBack) => {
  const req = new XMLHttpRequest();
  req.open('POST', url);
  req.onload = function () {
    if (isValidResponse(this)) {
      return callBack(JSON.parse(this.responseText));
    }
    location.reload();
  };
  req.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
  const requestBody = JSON.stringify(data);
  req.send(requestBody);
};

const requestGet = function (url, callBack) {
  const req = new XMLHttpRequest();
  req.open('GET', url);
  req.onload = function () {
    if (isValidResponse(this)) {
      return callBack(JSON.parse(this.responseText));
    }
    location.reload();
  };
  req.send();
};
