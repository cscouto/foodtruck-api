import mongoose from 'mongoose';
import { Router } from 'express';
import Restaurant from '../model/restaurant';
import Review from '../model/review';

import { authenticate } from '../middleware/authMiddleware';

export default({ config, db }) => {
  let api = Router();

  //Create
  api.post('/add', authenticate, (req, res) => {
    let newRest = new Restaurant();
    newRest.name = req.body.name;
    newRest.foodType = req.body.foodType;
    newRest.avgCost = req.body.avgCost;
    newRest.geometry = req.body.geometry;

    newRest.save(err => {
      if (err) {
        res.send(err);
      }
      res.json({ 'message': "Successful"});
    });
  });

  //Read
  api.get('/', (req, res) => {
    Restaurant.find({}, (err, restaurants) => {
      if (err) {
        res.send(err);
      }
      res.json(restaurants);
    });
  });

  //Read by id
  api.get('/:id', (req, res) => {
    Restaurant.findById(req.params.id, (err, restaurant) => {
      if (err) {
        res.send(err);
      }
      res.json(restaurant);
    });
  });

  //Update
  api.put('/:id', (req, res) => {
    Restaurant.findById(req.params.id, (err, restaurant) => {
      if (err) {
        res.send(err);
      }
      restaurant.name = req.body.name;
      restaurant.foodType = req.body.foodType;
      restaurant.avgCost = req.body.avgCost;
      restaurant.geometry = req.body.geometry;
      restaurant.save(err => {
        if (err) {
          res.send(err);
        }
        res.json({ 'message': "Restaurant info updated." });
      });
    });
  });

  //Delete
  api.delete('/:id', (req, res) => {
    Restaurant.remove({
      _id: req.params.id
    }, (err, restaurant) => {
      if (err) {
        res.send(err);
      }
      res.json({ message: "Restaurant successfully removed."});
    });
  });

  //add review for a specific food foodtruck
  api.post('/reviews/add/:id', (req, res) => {
    Restaurant.findById(req.params.id, (err, restaurant) => {
      if (err) {
        res.send(err);
      }
      let newReview = new Review();
      newReview.title = req.body.title;
      newReview.text = req.body.text;
      newReview.restaurant = restaurant._id;
      newReview.save((err, review) => {
        if (err) {
          res.send(err);
        }
        restaurant.reviews.push(newReview);
        restaurant.save(err => {
          if (err) {
            res.send(err);
          }
          res.json({ message: "Review added to the restaurant."});
        });
      });
    });
  });

  //get reviews for a specific foodtruck
  api.get('/reviews/:id', (req, res) => {
    Review.find({restaurant: req.params.id}, (err, reviews) => {
      if (err) {
        res.send(err);
      }
      res.json(reviews);
    })
  });

  return api;
}
