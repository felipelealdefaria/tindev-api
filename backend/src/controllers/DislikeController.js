const Dev = require('../models/Dev');

module.exports = {
  async store(req, res) {
    // .headers PARA PEGAR O ID DE QUEM ESTÁ DANDO O LIKE
    const { user } = req.headers;
    // .params PARA PEGAR O ID DE QUEM ESTÁ RECEBENDO O LIKE    
    const { devId } = req.params;

    const loggedDev = await Dev.findById(user);
    const targetDev = await Dev.findById(devId);
    
    if(!targetDev) return res.status(400).json({ error: 'Dev not exists' });

    loggedDev.dislikes.push(targetDev._id);

    await loggedDev.save();

    return res.json(loggedDev);
  }
};