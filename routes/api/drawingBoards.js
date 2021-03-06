const express = require("express");
const router = express.Router();
const User = require('../../models/User');
const DrawingBoard = require('../../models/DrawingBoard');
const Easel = require('../../models/Easel');
const keys = require('../../config/keys');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const validateBoardInput = require('../../validation/drawingBoard');

//fetchDrawingBoards()
router.get('/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    DrawingBoard.find({ creator: req.user.id })
      .then(boards => res.json(boards))
      .catch(err => res.status(404).json({ error: 'No DrawingBoard found' }));
  })

router.get('/all',
  (req, res) => {
    DrawingBoard.find()
      .then(boards => res.json(boards))
      .catch(err => res.status(404).json({ error: 'No DrawingBoard found' }));
  })

// fetchDrawingBoard(drawingBoardId)
router.get('/:id', (req, res) => {
  DrawingBoard.findById(req.params.id)
    .then(board => res.json(board))
    .catch(err =>
      res.status(404).json({ error: `DrawingBoard ${req.params.id} doesn't exist` })
    );
});

//passport middleware reqObj will have req.user.id = currentUser
//createDrawingBoard(drawingBoard)
router.post('/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateBoardInput(req.body);
    if (!isValid) {
      return res.status(404).json(errors)
    }
    let newDrawingBoard = new DrawingBoard({
      name: req.body.name,
      creator: req.user.id,
    })
    newDrawingBoard.users.push(req.user.id);
    newDrawingBoard.save();
    User.findById(req.user.id)
      .then(user => {
        user.ownedDrawingBoards.push(newDrawingBoard.id)
        user.save();
      });
    res.json(newDrawingBoard.toObject());
  }
)


router.put('/:id',
  (req, res) => {
    DrawingBoard.findById(req.params.id)
      .then(board => {
        if (!board) {
          return res.status(404).send({ error: `DrawingBoard ${req.params.id} doesn't exist` })
        }
        Object.assign(board, req.body)
        let updatedBoard = new DrawingBoard(board);
        try {
          updatedBoard.save()
          res.json(updatedBoard)
        } catch (err) {
          res.status(500).send({ error: 'Cannot update this DrawingBoard' })
        }
      })
  }
)

// Finds a matching document, removes it, passing the found document (if any) to the callback.

router.delete('/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    DrawingBoard.findById(req.params.id)
      .then(board => {
        if (!board) {
          return res.status(404).send({ error: `DrawingBoard ${req.params.id} doesn't exist` })
        }
        Easel.remove({ "_id": { $in: board.easels } })
        board.users.forEach((userId) => {
          User.findById(userId).then(user => {
            if (userId == req.user.id) {
              let i = user.ownedDrawingBoards.indexOf(req.params.id);
              user.ownedDrawingBoards.splice(i, 1);
              user.save();
            } else {
              let i = user.joinedDrawingBoards.indexOf(req.params.id);
              user.joinedDrawingBoards.splice(i, 1);
              user.save();
            }
          })
        });
        board.remove();
        res.send({ drawingBoardId: req.params.id })
      })
  }
)

//new delte
// router.delete('/:id',
//   (req, res, next) => {
//     DrawingBoard.findById(req.params.id, function (err, board) {
//       Easel.remove({ "_id": { $in: board.easels } }, function (err) {
//         if (err) return next(err);
//         board.remove();
//         return
//       })
//     })
//   })

router.post(`/:drawingBoardsId/comments`, (req, res) => {
  let newComment = req.body;
  DrawingBoard.findById(req.params.drawingBoardsId)
    .then(board => {
      board.comments.push(newComment);
      board.save();
    })
  newComment['boardId'] = req.params.drawingBoardsId
  res.json(newComment)
})


/*=====================================//
//EASEL
//=====================================*/

// -fetchEasels()
router.get('/:id/easels', (req, res) => {
  Easel.find({ drawingBoard: req.params.id })
    .then(easel => res.json(easel))
    .catch(err => res.status(404).json({ error: 'No Easel found' }));
})


// - fetchEasel(EaselId)
// router.get('/:id', (req, res) => {
//   Easel.findById(req.params.id)
//     .then(easel => res.json(easel))
//     .catch(err =>
//       res.status(404).json({ error: `Easel ${req.params.id} doesn't exist` })
//     );
// });

// - createEasel(Easel)
router.post('/:id/easels', (req, res) => {
  const newEasel = new Easel({
    name: req.body.name,
    drawingBoard: req.params.id,
    image: req.body.image
  })

  DrawingBoard.findById(req.params.id)
    .then(board => {
      // res.json(board)
      if (!board) {
        return res.status(404).send({ error: `DrawingBoard ${req.params.id} doesn't exist` })
      }
      newEasel.save();
      board.easels.push(newEasel.id);
      board.save();
    })
  res.json(newEasel.toObject());
})


// - updateEasel(Easel)
router.patch('/:board_id/easels/:easel_id', (req, res) => {
  Easel.findById(req.params.easel_id)
    .then(easel => {
      if (!easel) {
        return res.status(404).send({ error: `Easel ${req.params.easel_id} doesn't exist` })
      }
      Object.assign(easel, req.body)
      let updatedEasel = new Easel(easel);
      try {
        updatedEasel.save()
        res.json(updatedEasel)
      } catch (err) {
        res.status(500).send({ error: 'Cannot update this Easel' })
      }
    })
})


// - deleteEasel(EaselId)
router.delete('/:board_id/easels/:easel_id', (req, res) => {
  Easel.findOneAndDelete({ _id: req.params.easel_id })
    .then(easel => {
      if (!easel) {
        return res.status(404).send({ error: `Easel ${req.params.easel_id} doesn't exist` })
      }
      DrawingBoard.findById(req.params.board_id)
        .then(board => {
          const index = board.easels.indexOf(req.params.easel_id);
          board.easels.splice(index, 1);
          board.save()
        })
      return res.json(easel.toObject())
    })
    .catch(err => {
      return res.status(500).send({ error: 'Cannot delete this Easel' })
    })
})

module.exports = router;


// router.get('/creator/:creator_id', (req, res) => {
//   DrawingBoard.find({ user: req.params.creator_id })
//     .then(boards => res.json(boards))
//     .catch(err => res.status(404).json({ error: 'No DrawingBoards created from the user' }));
// })