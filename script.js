
VK.init({
  apiId: 6462871
});

function auth(){
  return new Promise((resolve, reject) => {
    VK.Auth.login(data => {
      if(data.session) {
        resolve()
      } else {
        reject(new Error('Cannot authorization'));
      }
    }, 2);
  })
}

function callAPI(method, params) {
  params.v = 5.8;
  return new Promise((resolve, reject) => {
    VK.api(method, params, (response) => {
      if(response.error) {
        reject(response.error)
      } else {
        resolve(response);
      }
    })
  });
}

// auth().then(() => {
//   return callAPI('users.get', {fields: 'photo_100', v: 5.74, name_case: 'gen' })
//   })
//   .then((data) => {
//     const response = data.response;
//     const headerInfo = document.querySelector('#headerInfo');
//     headerInfo.textContent = `Friends on page ${response[0].first_name} ${response[0].last_name}`;
//   })
//   .catch((error) => {
//     console.log(error)
//   });

(async () => {
  try {
    await auth();
    const me = await callAPI('users.get', { name_case: 'gen' });
    const [response] = me.response;
    const headerInfo = document.querySelector('#headerInfo');
    headerInfo.textContent = `Friends on page ${response.first_name} ${response.last_name}`;

    const friends = await callAPI('friends.get', {fields: 'city, country, photo_100'});
    const friendsList = friends.response;
    const template = document.querySelector('#user-template').textContent;
    const render = Handlebars.compile(template);
    const html = render(friendsList);

    const results = document.querySelector('#results');
    results.innerHTML = html;
  } catch(e) {
    console.log(e)
  }


})();