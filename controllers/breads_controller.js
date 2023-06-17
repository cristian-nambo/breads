const express = require('express')
const breads = express.Router()
const Bread = require('../models/bread.js')
const Baker = require('../models/baker.js')

// Index:
breads.get('/', (req, res) => {
  Baker.find()
    .then(foundBakers => {
      Bread.find()
      .then(foundBreads => {
          res.render('index', {
              breads: foundBreads,
              bakers: foundBakers,
              title: 'Index Page'
          })
      })
    })
})


 



breads.get('/new', (req, res) => {
    Baker.find()
        .then(foundBakers => {
            res.render('new', {
                bakers: foundBakers
            })
      })
})


// EDIT
breads.get('/:id/edit', (req, res) => {
  Baker.find()
    .then(foundBakers => {
        Bread.findById(req.params.id)
          .then(foundBread => {
            res.render('edit', {
                bread: foundBread, 
                bakers: foundBakers 
            })
          })
    })
})



// SHOW Route
breads.get('/:id', (req, res) => {
  Bread.findById(req.params.id)
      .populate('baker')
      .then(foundBread => {
        const bakedBy =foundBread.getBakedBy()
        console.log(bakedBy)
          res.render('show', {
              bread: foundBread
          })
      })
      .catch(err => {
        res.send('404')
      })
})


// CREATE
breads.post('/', express.urlencoded({ extended: true }), (req, res) => {
  if (!req.body.image) {
    req.body.image = undefined;
  }
  if (req.body.hasGluten === 'on') {
    req.body.hasGluten = 'true';
  } else {
    req.body.hasGluten = 'false';
  }

  Bread.create(req.body)
    .then(() => {
      res.redirect('/breads');
    })
    .catch((error) => {
      console.error('Error creating bread:', error);
      res.status(404).send('Validation failed. this bread could not be created.');
    });
});



// DELETE
breads.delete('/:id', (req, res) => {
  Bread.findByIdAndDelete(req.params.id) 
    .then(deletedBread => { 
      res.status(303).redirect('/breads')
    })
})


// UPDATE
breads.put('/:id', (req, res) => {
  if(req.body.hasGluten === 'on'){
    req.body.hasGluten = true
  } else {
    req.body.hasGluten = false
  }
  Bread.findByIdAndUpdate(req.params.id, req.body, { new: true }) 
    .then(updatedBread => {
      console.log(updatedBread) 
      res.redirect(`/breads/${req.params.id}`) 
    })
})

// //Data/seeds Route


breads.get('/data/seed', (req, res) => {
  Bread.insertMany([
    {
      name: 'Rye',
      hasGluten: true,
      image: 'https://images.unsplash.com/photo-1595535873420-a599195b3f4a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
    },
    {
      name: 'French',
      hasGluten: true,
      image: 'https://images.unsplash.com/photo-1534620808146-d33bb39128b2?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    },
    {
      name: 'Gluten Free',
      hasGluten: false,
      image: 'https://images.unsplash.com/photo-1546538490-0fe0a8eba4e6?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1050&q=80',
    },
    {
      name: 'Pumpernickel',
      hasGluten: true,
      image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1050&q=80',
    }
  ])
    .then(createdBreads => {
      res.redirect('/breads')
    })
})


// //Data/seeds Route 2 update


breads.get('/data/seed2', (req, res) => {
  const validatedBakers = ['Monica', 'Rachel', 'Phoebe', 'Joey', 'Chandler', 'Ross'];


  Bread.find()
    .then(breads => {
      breads.forEach(async (bread) => {
        const randomIndex = Math.floor(Math.random() * validatedBakers.length);
        const randomBaker = validatedBakers[randomIndex];

        bread.baker = randomBaker;

        try {
          await bread.save();
        } catch (error) {
          console.error('Error updating bread:', error);
          res.status(500).send('An error occurred while updating the breads.');
          return;
        }
      });

      res.redirect('/breads');
    })
    .catch(error => {
      console.error('Error retrieving breads:', error);
      res.status(500).send('An error occurred while retrieving the breads.');
    });
});

// STATIC HELPER BONUS


module.exports=breads