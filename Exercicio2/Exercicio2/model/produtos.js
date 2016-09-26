var mongoose = require('mongoose');  
var produtoSchema = new mongoose.Schema({  
  nome: String,
  categoria: String,
  preco: Number,
  data: { type: Date, default: Date.now }
});
mongoose.model('Produto', produtoSchema);