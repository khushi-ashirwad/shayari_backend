import Quotes from "../modal/quotes.js";
import schedule from "node-schedule";
import axios from "axios";
import Shayari from "../modal/shayari.js";

export const manageQuotes = async (request, response) => {
  try {
    const newItem = new Quotes(request.body);
    await newItem.save();
    response.status(200).json({ message: "Quotes added successfully" });
  } catch (error) {
    response
      .status(500)
      .json({ message: `Error creating the Quotes:${error}` });
  }
};

export const getallquotes = async (request, response) => {
  try {
    const content = await Quotes.find().populate("category").exec();
    // Filter out quotes with categories that have isdisable: false
    const filteredcontent = content.filter((quote) => {
      return quote.category && quote.category.isdisable === true;
    });
    response.status(200).json(filteredcontent);
  } catch (error) {
    response.status(500).json({ message: `Error fetching Quotes:${error}` });
  }
};
export const getIdQuotes = async (request, response) => {
  try {
    const quotes = await Quotes.findById(request.params.id)
      .populate("category")
      .exec();
    if (!quotes) {
      return response.status(404).json({ message: "quotes not found" });
    } else {
      return response.status(200).json(quotes);
    }
  } catch (error) {
    response
      .status(500)
      .json({ message: `Error fetching the quotes:${error}` });
  }
};

export const updateQuotes = async (request, response) => {
  try {
    const update = await Quotes.findByIdAndUpdate(
      request.params.id,
      request.body,
      {
        new: true,
      }
    );
    if (!update) {
      return response.status(404).json({ message: "quotes not found" });
    }
    response.status(200).json({ message: "quotes updated successfully" });
  } catch (error) {
    response
      .status(500)
      .json({ message: `Error updating the quotes:${error}` });
  }
};

export const deleteQuotes = async (request, response) => {
  try {
    const content = await Quotes.deleteOne({ _id: request.params.id });
    if (!content) {
      return response.status(404).json({ message: "quotes not found" });
    }
    response.json({ message: "quotes deleted successfully" });
  } catch (error) {
    response.status(500).json({ message: `Error delete the quotes:${error}` });
  }
};
const random = async () => {
  const content = await Quotes.find().populate("category").exec();
  // Filter out quotes with categories that have isdisable: false
  const filteredcontent = content.filter((quote) => {
    return quote.category && quote.category.type === "quotes";
  });

  const random = Math.floor(Math.random() * filteredcontent.length);
  const result = await Quotes.findOne()
    .skip(random)
    .populate("category")
    .exec();

  return result;
};

schedule.scheduleJob("0 0 * * *", async () => {
  try {
    const result = await random();
    const addQuoteResponse = await axios.post(
      "http://localhost:8001/dailyquotes",
      {
        type: "dailycontent",
        content: result.content,
        category: result.category,
      }
    );
    console.log(addQuoteResponse.data);
  } catch (error) {
    console.error("Error processing scheduled job:", error);
  }
});

export const dailyquotesadd = async (request, response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const userAddedQuotesToday = await Quotes.find({
      $and: [{ createdAt: { $gte: today } }, { type: "dailycontent" }],
    })
      .populate("category")
      .exec();
    const latestQuotes = userAddedQuotesToday.filter(
      (value) =>
        value.category.type === "quotes" &&
        value.createdAt.toDateString() === today.toDateString()
    );
    if (latestQuotes.length > 0) {
      response
        .status(200)
        .json({ message: "You can only add one quote per day" });
    } else {
      const newItem = new Quotes(request.body);
      await newItem.save();
      response.status(200).json({ message: "Daily quote added successfully" });
    }
  } catch (error) {
    response
      .status(500)
      .json({ message: `Quote already added today:${error}` });
  }
};

export const dailyContentget = async (request, response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Check if a user has added quotes today
    const userAddedQuotesToday = await Quotes.findOne({
      $and: [{ createdAt: { $gte: today } }, { type: "dailycontent" }],
    })
      .populate("category")
      .exec();

    const userAddedShayaritoday = await Shayari.findOne({
      $and: [{ createdAt: { $gte: today } }, { type: "dailycontent" }],
    })
      .populate("category")
      .exec();

    const combinearray = [userAddedQuotesToday, userAddedShayaritoday];

    if (userAddedQuotesToday && userAddedShayaritoday) {
      response.status(200).json(combinearray);
    } else if (userAddedQuotesToday) {
      response.status(200).json(userAddedQuotesToday);
    } else if (userAddedShayaritoday) {
      response.status(200).json(userAddedShayaritoday);
    } else {
      response.status(200).json({ message: "yet today content not added" });
    }
  } catch (error) {
    response
      .status(500)
      .json({ error: "Error retrieving daily quote:", error });
  }
};
