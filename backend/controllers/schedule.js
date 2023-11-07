const Schedule = require("../models/schedule");
const User = require("../models/user");
const Unavailable = require("../models/unavailable.dates");
const CheckIn = require("../models/check-in");
const asyncHandler = require("express-async-handler");
const dbConnect = require("../utils/dbConnect");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

dbConnect();

//high risk function
const createSchedule = asyncHandler(async (req, res) => {
  const newSchedule = new Schedule(req.body);

  const previousSchedule = await Schedule.find({ userId: req.body.userId });
  const user = await User.findById(req.body.userId);

  let isTaken = false;

  previousSchedule?.map((p) => {
    const date1 = new Date(p.start)
      .toISOString()
      .slice(0, 10)
      .replace(/T/, " ")
      .replace(/\..+/, "");

    const date2 = new Date(p.end)
      .toISOString()
      .slice(0, 10)
      .replace(/T/, " ")
      .replace(/\..+/, "");

    const currentDateStart = new Date(req.body.start)
      .toISOString()
      .slice(0, 10)
      .replace(/T/, " ")
      .replace(/\..+/, "");

    if (currentDateStart >= date1 && currentDateStart <= date2) {
      isTaken = true;
    }
  });

  if (isTaken) {
    return res
      .status(400)
      .send({ msg: "the chosen dates were already taken by you" });
  }

  try {
    await user.updateOne({ $set: { hasSchedule: true } }, { new: true });
    const savedSchedule = await newSchedule.save();
    await user.updateOne(
      { $push: { activity: savedSchedule._id } },
      { new: true }
    );

    const begin = new Date(req.body.start)
      .toISOString()
      .slice(0, 10)
      .replace(/T/, " ")
      .replace(/\..+/, "");

    const finish = new Date(req.body.end)
      .toISOString()
      .slice(0, 10)
      .replace(/T/, " ")
      .replace(/\..+/, "");

    //messaging the admin
    client.messages
      .create({
        body: `GOMES DAYCARE: schedule created by client ${user.name} from ${begin} to ${finish}`,
        from: "+12515128063",
        to: `+15106305188`,
      })
      .then((message) => console.log(message.sid))
      .catch((err) => console.log(err));

    //messaging the client
    client.messages
      .create({
        body: `GOMES DAYCARE: schedule confirmation, dates:  from ${begin} to ${finish}`,
        from: "+12515128063",
        to: `${user.phoneNumber}`,
      })
      .then((message) => console.log(message.sid))
      .catch((err) => console.log(err));

    res.status(200).json(savedSchedule);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

const unavailableDates = asyncHandler(async (req, res) => {
  const newSchedule = new Unavailable(req.body);
  try {
    const savedSchedule = await newSchedule.save();

    res.status(200).json(savedSchedule);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

const getUnavailableDates = asyncHandler(async (req, res) => {
  try {
    const dates = await Unavailable.find();
    res.status(200).json(dates);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

// two payment options, make a schedule before hand and pay it all, or don't make an schedule at all and just pay for the days you get checked-in
const checkInUser = asyncHandler(async (req, res) => {
  const checkInClient = new CheckIn(req.body);
  const adminUser = await User.findById(req.body.userId);
  const clients = await User.findById(req.body.clientId);
  const clientHistory = await CheckIn.find({ clientId: clients._id });
  const ClientSchedule = await Schedule.find({ userId: req.body.clientId });

  let isTaken = false;

  clientHistory?.map((c) => {
    if (c.start.toString() === checkInClient.start.toString()) {
      isTaken = true;
    }
  });

  if (isTaken) {
    return res
      .status(400)
      .send({ msg: "client is already checked-in at this specific date" });
  }

  //create a schedule if it's not collapsing
  let isCollapsing = false;

  ClientSchedule.map((schedule) => {
    if (schedule.isPaid === false) {
      const date1 = new Date(schedule.start)
        .toISOString()
        .slice(0, 10)
        .replace(/T/, " ")
        .replace(/\..+/, "");

      const date2 = new Date(schedule.end)
        .toISOString()
        .slice(0, 10)
        .replace(/T/, " ")
        .replace(/\..+/, "");

      const currentDate = new Date(req.body.start)
        .toISOString()
        .slice(0, 10)
        .replace(/T/, " ")
        .replace(/\..+/, "");

      if (currentDate >= date1 && currentDate <= date2) {
        isCollapsing = true;
      }
    }
  });

  let currentDates = new Date();
  const times = currentDates
    .toLocaleString("en-US", { timeZone: "America/Los_Angeles" })
    .slice(10, 21);

  const dueDate = new Date(req.body.start);
  dueDate.setDate(dueDate.getDate() + 15);

  try {
    if (adminUser.isAdmin) {
      if (isCollapsing === false) {
        const order = new Schedule({
          userId: clients._id,
          start: req.body.start,
          end: req.body.start,
          days: 1,
          price: 35 * req.body.kids,
          kids: req.body.kids,
          isAdmin: true,
          dueDate: dueDate,
        });
        const savedClient = await checkInClient.save();
        await clients.updateOne({
          $set: { isCheckIn: true },
        });
        await order.save();

        // //messaging client
        client.messages
          .create({
            body: `Gomes Daycare: check-in confirmation date: ${req.body.start}, time: ${times}`,
            from: "+12515128063",
            to: `${clients.phoneNumber}`,
          })
          .then((message) => console.log(message.sid))
          .catch((err) => console.log(err));
        res.status(200).json(savedClient);
      } else {
        res.status(420).send({ msg: "schedule is already done" });
      }
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});

//high risk function

//set schedule as late if it's past 6:15
const checkOutUser = asyncHandler(async (req, res) => {
  const adminUser = await User.findById(req.body.userId);
  const clients = await User.findById(req.body.clientId);
  const lastCheckedInTime = await CheckIn.findOne({
    clientId: clients._id,
  }).sort({
    _id: -1,
  });

  try {
    if (adminUser.isAdmin === true) {
      await clients.updateOne({
        $set: { isCheckIn: false },
      });

      await lastCheckedInTime.updateOne(
        { $set: { end: req.body.end } },
        { new: true }
      );

      //messaging client
      client.messages
        .create({
          body: `Gomes Daycare: check-out confirmation date: ${req.body.end}`,
          from: "+12515128063",
          to: `${clients.phoneNumber}`,
        })
        .then((message) => console.log(message.sid))
        .catch((err) => console.log(err));
      res.status(200).json(lastCheckedInTime);
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});

const getAllSchedule = asyncHandler(async (req, res) => {
  const userSchedule = await Schedule.find({ userId: req.params.userId });

  try {
    res.status(200).json(userSchedule);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

const paidSchedules = asyncHandler(async (req, res) => {
  let paid = [];
  let unpaid = [];
  let revenue;
  let valueOfUnpaid;
  let lateSchedules = [];

  try {
    const schedules = await Schedule.find();

    schedules.map((s) => {
      if (s.isPaid === true) {
        paid.push(s.price);
      } else {
        unpaid.push(s.price);
      }

      if (s.isLate === true) {
        lateSchedules.push(s.price);
      }
    });

    revenue = paid.reduce((a, b) => a + b, 0);
    valueOfUnpaid = unpaid.reduce((a, b) => a + b, 0);

    res.status(200).json([
      {
        numberOfPaidSchedules: paid.length,
        revenue: revenue,
        numberOfUnpaidSchedules: unpaid.length,
        valueOfUnpaid: valueOfUnpaid,
        allSchedules: schedules.length,
        late: lateSchedules.length,
      },
    ]);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

const getUserData = asyncHandler(async (req, res) => {
  let totalUsers = [];
  let userScheduleOn = 0;

  try {
    const users = await User.find();
    users?.map((user) => {
      if (user.isAdmin === false) {
        totalUsers.push(user);
      }

      if (user.hasSchedule === true) {
        userScheduleOn += 1;
      }
    });
    res.status(200).json([
      {
        totalUsers: totalUsers.length,
        userScheduleOn: userScheduleOn,
      },
    ]);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

// here
// get paid and unpaid balance
const getBalance = asyncHandler(async (req, res) => {
  const paidBalance = [];
  let revenue;
  const unpaidBalance = [];
  let unpaid;

  try {
    const previousSchedule = await Schedule.find({ userId: req.params.id });
    const user = await User.findById(req.params.id);

    let isUserBlocked = false;
    let unblockUserValues = [];

    previousSchedule.map((p) => {
      if (p.isPaid === true) {
        paidBalance.push(p.price);
      }

      if (p.isPaid === false) {
        unpaidBalance.push(p.price);

        const date1 = new Date(p.dueDate)
          .toISOString()
          .slice(0, 10)
          .replace(/T/, " ")
          .replace(/\..+/, "");

        let currentDate = new Date();
        const time = currentDate
          .toLocaleString("en-US", {
            timeZone: "America/Los_Angeles",
          })
          .slice(0, 10)
          .replace(/T/, " ")
          .replace(/\..+/, "");

        const date2 = new Date(time)
          .toISOString()
          .slice(0, 10)
          .replace(/T/, " ")
          .replace(/\..+/, "");

        const blockUserOnDueDate = date2 === date1;
        unblockUserValues.push(blockUserOnDueDate);
        console.log(date1);

        if (blockUserOnDueDate === true) {
          isUserBlocked = true;
        }

        const warningDate = new Date(p.dueDate);
        warningDate.setDate(warningDate.getDate() - 5);

        const date3Warning = new Date(warningDate)
          .toISOString()
          .slice(0, 10)
          .replace(/T/, " ")
          .replace(/\..+/, "");

        if (date3Warning === date2) {
          //messaging client 5 days before account gets block for lack of payment
          client.messages
            .create({
              body: `GOMES DAYCARE: ${user.name} you have a pending balance of $${unpaid} for the past 10 days, in five days you won't be able to create a schedule, or to do the check in at the day care until the payment is done.`,
              from: "+12515128063",
              to: `${user.phoneNumber}`,
            })
            .then((message) => console.log(message.sid))
            .catch((err) => console.log(err));
        }
      }
    });

    revenue = paidBalance.reduce((a, b) => a + b, 0);
    unpaid = unpaidBalance.reduce((a, b) => a + b, 0);

    if (isUserBlocked === true) {
      client.messages
        .create({
          body: `GOMES DAYCARE: ${user.name} you have a pending balance of $${unpaid} for the past 15 days, you're not able to create schedules or to be checked-in at the day care until you pay your balance`,
          from: "+12515128063",
          to: `${user.phoneNumber}`,
        })
        .then((message) => console.log(message.sid))
        .catch((err) => console.log(err));
      await user.updateOne({ $set: { isBlocked: true } });
    }

    let checker = unblockUserValues.every((v) => v === false);

    if (checker === true) {
      await user.updateOne({ $set: { isBlocked: false } });
    }

    await user.updateOne({
      $set: { paidBalance: revenue, unpaidBalance: unpaid },
    });

    res.status(200).json([{ paidBalance: revenue, unpaidBalance: unpaid }]);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

const getCheckIn = asyncHandler(async (req, res) => {
  try {
    const checkin = await CheckIn.find();
    res.status(200).json(checkin);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

const updateClient = asyncHandler(async (req, res) => {
  const paidBalance = [];
  let revenue;
  const unpaidBalance = [];
  let unpaid;

  try {
    const previousSchedule = await Schedule.find({ userId: req.params.id });
    const user = await User.findById(req.params.id);

    let isUserBlocked = false;
    let unblockUserValues = [];

    previousSchedule.map((p) => {
      if (p.isPaid === true) {
        paidBalance.push(p.price);
      }

      if (p.isPaid === false) {
        unpaidBalance.push(p.price);

        const date1 = new Date(p.dueDate)
          .toISOString()
          .slice(0, 10)
          .replace(/T/, " ")
          .replace(/\..+/, "");

        let currentDate = new Date();
        const time = currentDate
          .toLocaleString("en-US", {
            timeZone: "America/Los_Angeles",
          })
          .slice(0, 10)
          .replace(/T/, " ")
          .replace(/\..+/, "");

        const date2 = new Date(time)
          .toISOString()
          .slice(0, 10)
          .replace(/T/, " ")
          .replace(/\..+/, "");

        const blockUserOnDueDate = date2 === date1;
        unblockUserValues.push(blockUserOnDueDate);

        if (blockUserOnDueDate === true) {
          isUserBlocked = true;
        }
      }
    });

    if (isUserBlocked === true) {
      await user.updateOne({ $set: { isBlocked: true } });
    }

    let checker = unblockUserValues.every((v) => v === false);

    if (checker === true) {
      await user.updateOne({ $set: { isBlocked: false } });
    }

    revenue = paidBalance.reduce((a, b) => a + b, 0);
    unpaid = unpaidBalance.reduce((a, b) => a + b, 0);

    await user.updateOne({
      $set: { paidBalance: revenue, unpaidBalance: unpaid },
    });

    res.status(200).json([{ paidBalance: revenue, unpaidBalance: unpaid }]);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

const lateClient = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  try {
    const order = new Schedule({
      userId: user._id,
      start: 0,
      end: 0,
      price: 15,
      isAdmin: true,
      dueDate: 0,
    });
    await order.save();

    client.messages
      .create({
        body: `GOMES DAYCARE: you were late for pick up, $15 were added to your balance`,
        from: "+12515128063",
        to: `${user.phoneNumber}`,
      })
      .then((message) => console.log(message.sid))
      .catch((err) => console.log(err));

    res.status(200).json(order);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = {
  createSchedule,
  unavailableDates,
  checkInUser,
  checkOutUser,
  getAllSchedule,
  paidSchedules,
  getUserData,
  getBalance,
  getCheckIn,
  getUnavailableDates,
  updateClient,
  lateClient,
};
