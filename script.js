// const clientId = "ca6139e49c5bf36";
const clientId = "cbfc1af475b63f4";
var defaultAlbumId = 'Jfni3';

function doXHR() {
  let albumId = document.getElementById("albumIdField").innerText;
  if (!albumId) {
    albumId = defaultAlbumId;
  }

  var req = new XMLHttpRequest();
  req.onreadystatechange = function () {
    if (req.readyState == 4 && req.status == 200) {
      processAlbumRequest(req.responseText);
    } else if (req.readyState == 4 && req.status != 200) {
      console.log(req.status + " Error with the imgur API: ", req.responseText);
    }
  };
  req.open("GET", "https://api.imgur.com/3/album/" + albumId + "/images", true); // true for asynchronous
  req.setRequestHeader("Authorization", "Client-ID " + clientId);
  req.send();
}

function processAlbumRequest(response_text) {
  var respObj = JSON.parse(response_text);
  for (item of respObj.data.slice(0, 10)) {
    console.log(item);
    requestImage(item.id);
  }
}

function requestImage(imageHash) {
  var req = new XMLHttpRequest();
  req.onreadystatechange = function () {
    if (req.readyState == 4 && req.status == 200) {
      processImageRequest(req.responseText);
    } else if (req.readyState == 4 && req.status != 200) {
      console.log("Error with the imgur API");
    }
  };
  req.open("GET", "https://api.imgur.com/3/image/" + imageHash, true); // true for asynchronous
  req.setRequestHeader("Authorization", "Client-ID " + clientId);
  req.send();
}

function processImageRequest(response_text) {
  var respObj = JSON.parse(response_text);
  let imgElem = document.createElement("img");
  imgElem.src = respObj.data.link;
  //imgElem.referrerpolicy="no-referrer";
  document.body.appendChild(imgElem);
}

function fetchWithPromises() {
  let albumId = document.getElementById("albumIdField").innerText;
  if (!albumId) {
    albumId = defaultAlbumId;
  }

  fetch("https://api.imgur.com/3/album/" + albumId + "/images", {
    headers: {
      Authorization: "Client-ID " + clientId,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      for (item of data.data.slice(0, 10)) {
        console.log(item);
        fetchImage(item.id);
      }
    })
    .catch((error) => {
      console.log("Error with the imgur API: ", error);
    });
}

function fetchImage(imageHash) {
  fetch("https://api.imgur.com/3/image/" + imageHash, {
    headers: {
      Authorization: "Client-ID " + clientId,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      let imgElem = document.createElement("img");
      imgElem.src = data.data.link;
      document.body.appendChild(imgElem);
    })
    .catch((error) => {
      console.log("Error with the imgur API: ", error);
    });
}

async function fetchWithAsyncAwait() {
  try {
    let albumId = document.getElementById("albumIdField").innerText;
    if (!albumId) {
      albumId = defaultAlbumId;
    }

    const response = await fetch("https://api.imgur.com/3/album/" + albumId + "/images", {
      headers: {
        Authorization: "Client-ID " + clientId,
      },
    });

    const data = await response.json();

    for (item of data.data.slice(0, 10)) {
      console.log(item);
      await fetchImage(item.id);
    }
  } catch (error) {
    console.log("Error with the imgur API: ", error);
  }
}

function fetchImage(imageHash) {
  return new Promise((resolve, reject) => {
    fetch("https://api.imgur.com/3/image/" + imageHash, {
      headers: {
        Authorization: "Client-ID " + clientId,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        let imgElem = document.createElement("img");
        imgElem.src = data.data.link;
        document.body.appendChild(imgElem);
        resolve();
      })
      .catch((error) => {
        console.log("Error with the imgur API: ", error);
        reject(error);
      });
  });
}