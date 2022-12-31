const dotenv = require('dotenv');
const mongoose = require('mongoose'); //importing mongoose
dotenv.config({ path: './config.env' });
const app = require('./app');

/////////////////////////////////////////////////////////////////////
//connecting to database

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((con) => {
    console.log('connection successfully established');
  });

//////////////////////////////////////////////
//test code
// const testTour = new Tour({
//   name: 'The Park Camper',
//   rating: 4.8,
//   price: 497,
// });

// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => console.log('Error', err));
//test code end
////////////////////////////////////////////////////////////
// console.log(process.env);
app.listen(process.env.PORT || 3000, () => {
  console.log('app listening on 3000');
});
