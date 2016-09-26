var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');

router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        var method = req.body._method
        delete req.body._method
        return method
      }
}))

router.route('/')
    .get(function(req, res, next) {
        mongoose.model('Produto').find({}, function (err, produtos) {
              if (err) {
                  return console.error(err);
              } else {
                  res.format({
                    html: function(){
                        res.render('produtos/index', {
                              title: 'Todos os produtos',
                              "produtos" : produtos
                          });
                    },
                    json: function(){
                        res.json(produtos);
                    }
                });
              }     
        });
    })
    .post(function(req, res) {
        var nome = req.body.nome;
        var categoria = req.body.categoria;
        var data = req.body.data;
        var preco = req.body.preco;
        mongoose.model('Produto').create({
            nome : nome,
            categoria : categoria,
            preco : preco,
            data : data
        }, function (err, produto) {
              if (err) {
                  res.send("Problemas para adicionar à database.");
              } else {
                  console.log('POST criando novo produto: ' + produto);
                  res.format({
                    html: function(){
                        res.location("produtos");
                        res.redirect("/produtos");
                    },
                    json: function(){
                        res.json(produto);
                    }
                });
              }
        })
    });

router.get('/new', function(req, res) {
    res.render('produtos/new', { title: 'Adicionar novo produto' });
});

router.param('id', function(req, res, next, id) {
    mongoose.model('Produto').findById(id, function (err, produto) {
        if (err) {
            console.log(id + ' não foi encontrado');
            res.status(404)
            var err = new Error('Not Found');
            err.status = 404;
            res.format({
                html: function(){
                    next(err);
                 },
                json: function(){
                       res.json({message : err.status  + ' ' + err});
                 }
            });
        } else {
            req.id = id;
            next(); 
        } 
    });
});

router.route('/:id')
  .get(function(req, res) {
    mongoose.model('Produto').findById(req.id, function (err, produto) {
      if (err) {
        console.log('GET Error: problemas para recuperar: ' + err);
      } else {
        console.log('GET recuperando ID: ' + produto._id);
        //var produtodata = produto.data.toISOString();
        //produtodata = produtodata.substring(0, produtodata.indexOf('T'))
        res.format({
          html: function(){
              res.render('produtos/show', {
                //"data" : data,
                "produto" : produto
              });
          },
          json: function(){
              res.json(produto);
          }
        });
      }
    });
  });

router.route('/:id/edit')
	.get(function(req, res) {
	    mongoose.model('Produto').findById(req.id, function (err, produto) {
	        if (err) {
	            console.log('GET Error: ' + err);
	        } else {
	            console.log('GET retornando ID: ' + produto._id);
				//var produtodata = produto.data.toISOString();
				//produtodata = produtodata.substring(0, produtodata.indexOf('T'))
	            res.format({
	                html: function(){
	                       res.render('produtos/edit', {
	                          title: 'Produto' + produto._id,
                            //"data" : data,
	                          "produto" : produto
	                      });
	                 },
	                 //JSON response will return the JSON output
	                json: function(){
	                       res.json(produto);
	                 }
	            });
	        }
	    });
	})
	.put(function(req, res) {
        var nome = req.body.nome;
        var categoria = req.body.categoria;
        var data = req.body.data;
        var preco = req.body.preco;
	    mongoose.model('Produto').findById(req.id, function (err, produto) {
	        //update it
	        produto.update({
	            nome : nome,
	            categoria : categoria,
	            data : data,
	            preco : preco
	        }, function (err, produtoID) {
	          if (err) {
	              res.send("Problemas para atualizar: " + err);
	          } 
	          else {
				  res.format({
					  html: function(){
						   res.redirect("/produtos/" + produto._id);
					 },
					json: function(){
						   res.json(produto);
					 }
				  });
	           }
	        })
	    });
	})
	.delete(function (req, res){
	    mongoose.model('Produto').findById(req.id, function (err, produto) {
	        if (err) {
	            return console.error(err);
	        } else {
	            produto.remove(function (err, produto) {
	                if (err) {
	                    return console.error(err);
	                } else {
	                    console.log('DELETE removendo ID: ' + produto._id);
	                    res.format({
	                          html: function(){
	                               res.redirect("/produtos");
	                         },
	                        json: function(){
	                               res.json({message : 'deletado',
	                                   item : produto
	                               });
	                         }
	                      });
	                }
	            });
	        }
	    });
	});

module.exports = router;