function makeUrl(path) {
  return `http://${window.location.hostname}:5000${path}`;
}

function get(path) {
  return new Promise((resolve, reject) => {
    fetch(makeUrl(path))
      .then((res) => {
        if (res.ok) resolve(res.json());
        else reject(res.statusText);
      })
      .catch((err) => reject(err));
  });
}

function post(path, data) {
  return new Promise((resolve, reject) => {
    fetch(makeUrl(path), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.status === 204) { // 204 = no content
          return resolve();
        }
        return res.json();
      })
      .then((json) => {
        if (json.error) {
          return reject(json.error);
        }
        return resolve(json);
      })
      .catch((err) => reject(err));
  });
}

export { get, post };
