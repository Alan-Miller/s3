const users = [
  {
    id: 1,
    username: 'Ox',
    img: '',
    desc: 'Bright smile. Fun. Kind. Silly in a good way. Dear companion.'
  },
  {
    id: 2,
    username: 'Rooster',
    img: '',
    desc: 'Wakes up late. Sings badly. Cheerful and sad at the same time.'
  },
  {
    id: 3,
    username: 'Monkey',
    img: '',
    desc: 'Sweet and comforting. Wise. Excellent friend. Likes chocolate.'
  }
]

module.exports = {
  get_users() {
    return users;
  },

  get_user_by_id(id) {
    return users.find(user => user.id === id);
  },

  put_user_img(id, img) {
    const user = users.find(user => user.id === id);
    user.img = img;
    return user;
  }
}