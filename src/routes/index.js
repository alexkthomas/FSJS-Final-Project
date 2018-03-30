// src/routes/index.js
const router = require('express').Router();
const mongoose = require('mongoose');

// Totally fake data
const FILES = [
  {name: 'banana', calories: '45', carbs: '11'},
  {name: 'ham sandwich', calories: '360', carbs: '40'},
  {name: 'coffee', calories: '5', carbs: '0'},
  {name: 'bagel', calories: '400', carbs: '100'},
];


router.use('/doc', function(req, res, next) {
  res.end(`Documentation http://expressjs.com/`);
});

/**
 * Get a list of all files in the DB
 */
router.get('/file', function(req, res, next) {
  const fileModel = mongoose.model('File');

  fileModel.find({deleted: {$ne: true}}, function(err, files) {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    res.json(files);
  });
});

/**
 * Get a single file by passing its id as a URL param
 */
router.get('/file/:fileId', function(req, res, next) {
  const {fileId} = req.params;
  // same as 'const fileId = req.params.fileId'

  const file = FILES.find(entry => entry.id === fileId);
  if (!file) {
    return res.status(404).end(`Could not find file '${fileId}'`);
  }

  res.json(file);
});

/**
 * Create a new file
 */
router.post('/file', function(req, res, next) {
  const File = mongoose.model('File');
  const fileData = {
    name: req.body.name,
    calories: req.body.calories,
    carbs: req.body.carbs,
  };
  console.log(req.body)

  File.create(fileData, function(err, newFile) {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    res.json(newFile);
  });
});

/**
 * Update an existing file
 */
router.put('/file/:fileId', function(req, res, next) {
  const File = mongoose.model('File');
  const fileId = req.params.fileId;

  File.findById(fileId, function(err, file) {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }
    if (!file) {
      return res.status(404).json({message: "File not found"});
    }

    file.name = req.body.name;
    file.calories = req.body.calories;
    file.carbs = req.body.carbs;

    file.save(function(err, savedFile) {
      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }
      res.json(savedFile);
    })

  })

});

/**
 * Delete a file
 */
 router.delete('/file/:fileId', function(req, res, next) {
   const File = mongoose.model('File');
   const fileId = req.params.fileId;

   File.findById(fileId, function(err, file) {
     if (err) {
       console.log(err);
       return res.status(500).json(err);
     }
     if (!file) {
       return res.status(404).json({message: "File not found"});
     }

     file.deleted = true;

     file.save(function(err, doomedFile) {
       res.json(doomedFile);
     })

   })
 });


module.exports = router;
