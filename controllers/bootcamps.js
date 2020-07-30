const ErorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlwares/async");
const Bootcamp = require("../models/Bootcamp");

//@desc: get all bootcamps,
//@method: get/api/v1/bootcamps
//@access: dont have to log in

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find();

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

//@desc: get one bootcamp
//@method get/api/v1/bootcamps/:id
//@access:dont have to log in
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    //return res.status(400).json({ msg: "no bootcamp found" });

    return;
    next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: bootcamp });
});

//} catch (err) {
//res.status(400).json({ success: false });
//error response
// next(
//   new ErrorResponse(`Bootcamp not found withid of ${req.params.id}`, 404)
// );
//}
//};

//@desc :update bootcamp
//method: put/api/bootcamps/:id
//access:private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootcamp) {
    return res.status(400).json({ msg: "bootcamp not found" });
  }
  res.status(200).json({ success: true, data: bootcamp });
});

//@desc:delete bootcamp
//route: delete/api/V1/:id
//accesss:private

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

  if (!bootcamp) {
    return res.status(401).json({ msg: "no bootcamp found" });
  }

  res.status(200).json({ success: true, data: {} });
});

//@des create  new bootcamp
//rouute post/api/v1/bootcamps
//access private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});
