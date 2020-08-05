const mongoose = require("mongoose");
const slugify = require("slugify");
const geocoder = require("../utils/geocoder");

const BootcampSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please add a name"],
    unique: true,
    trim: true,
    maxlength: [50, "Name cannot be more than 50 charcters"],
  },
  slug: String,
  description: {
    type: String,
    required: [true, "please add a description"],
    maxlength: [500, "description cannot be more than 500 characters"],
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      "please add a valid URL HTTP OR HTTPS",
    ],
  },
  phone: {
    type: String,
    maxlength: [20, "phone number cannot be more than 20 characters"],
  },
  email: {
    type: String,
    max: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "please enter a valid email",
    ],
  },
  address: {
    type: String,
    required: [true, "please add an address"],
  },
  location: {
    //GEOJSON POINT

    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
      index: "2dsphere",
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
  },
  careers: {
    //array of strings
    type: [String],
    required: true,
    enum: [
      "Web Development",
      "Mobile Development",
      "UI/UX",
      "Data Science",
      "Business",
      "Other",
    ],
  },
  averageRating: {
    type: Number,
    min: [1, "Rating must be atleast1"],
    max: [10, "Rating cannot be more than 10"],
  },

  averageCost: Number,
  photo: {
    type: String,
    default: "no-photo.jpg",
  },
  housing: {
    type: Boolean,
    default: false,
  },
  jobAssistance: {
    type: Boolean,
    default: false,
  },
  jobGuarantee: {
    type: Boolean,
    default: false,
  },

  acceptGi: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

///create middleware
BootcampSchema.pre("save", function (next) {
  console.log("slugify ran", this.name);
  next();
});

//geocode and create location fields
BootcampSchema.pre("save,", async function (next) {
  const loc = await geocoder.geocode(this.address);

  this.location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode,
  };

  //do not save adress in db

  this.address = undefined;

  next();
});

module.exports = mongoose.model("Bootcamp", BootcampSchema);
