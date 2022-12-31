const mongoose = require('mongoose'); //importing mongoose
const slugify = require('slugify');
// const User = require('./userModel');
//creating schema
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must be at most 40 characters'],
      minlength: [10, 'A tour name must be at least 10 characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy,medium, or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1'],
      max: [5, 'Rating must be below 5'],
      set: (val) => Math.round(val * 10) / 10, //setter function for getting the rounded value of ratings avg
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      //custom validation
      validate: {
        validator: function (value) {
          //this only points to current doc on NEW document creation
          return value < this.price;
        },
        message: 'Discount price ({VALUE}) must be less than the regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a Cover Image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      //GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    //to create embedded document, use array
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    //for virtual properties
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// tourSchema.index({ price: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });
//virtual properties are not stores in database, but can be viewed if required
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour', //this is like the name of foreign key in other schema
  localField: '_id', //this is like the foreign key
});
//////////////////////////////////////////////////////////////////////////////////////
//DOCUMENT Middleware: runs before .save() and .create() and not for insertMany() (save and create are called hooks, that makes pre-hooks and post-hooks)
//pre-hooks callback function only have access to the next(), and you can work with this keyword
tourSchema.pre('save', function (next) {
  // console.log(this);
  this.slug = slugify(this.name, { lower: true });
  // console.log(this.slug);
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'reviews',
    select: '-__v -passwordChangedAt',
  }).populate({
    path: 'guides',
  });
  next();
});
//EMBEDDING
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

//document middleware: runs after.save() and.create()(we can have multiple prehooks and posthooks)
//posthooks callback function have access to saved document and next function
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });
////////////////////////////////////////////////////////////////////
//QUERY Middleware:
//pre middleware(does not have access to the document, only to next function)
tourSchema.pre(/^find/, function (next) {
  // /^find/ is a regular expression
  // tourSchema.pre('find', function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});
//post middleware(has access to document, next function)
tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start}ms`);
  // console.log(docs);
  next();
});
////////////////////////////////////////////////////////////////////////////////
//AGGREGATION Middleware:
// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   // console.log(this.pipeline());
//   next();
// });
////////////////////////////////////////////////////////////////////////////////
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
