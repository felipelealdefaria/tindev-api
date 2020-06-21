const axios = require('axios');
const Dev = require('../models/Dev');

module.exports = {
  async index(req, res) {
    const { user } = req.headers;

    const loggedDev = await Dev.findById(user);

    const users = await Dev.find({
      // PARA RETORNAR UMA LISTA COM TODOS OS USUÁRIOS QUE
      // NAO SEJA O DA PROPRIA PESSOA E QUE NAO SEJA ALGUEM
      // QUE ELE JA DEU LIKE OU DISLIKE.
      $and: [
        // not equal
        { _id: { $ne: user } },
        // not in
        { _id: { $nin: loggedDev.likes } },
        { _id: { $nin: loggedDev.dislikes } }
      ],
    });

    return res.json(users);
  },

  async store(req, res) {
    const { username } = req.body;

    // PARA IMPEDIR QUE DUPLIQUE O MESMO USUÁRIO NA BASE DE DADOS
    const userExists = await Dev.findOne({ user: username });

    if(userExists) return res.json(userExists);

    const response = await axios.get(`https://api.github.com/users/${username}`);

    const { name, bio, avatar_url: avatar } = response.data;

    const dev = await Dev.create({
      name,
      user: username,
      bio,
      avatar
    });

    return res.json(dev);
  }
};