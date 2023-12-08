import Quotes from "../modal/quotes.js";
import schedule from "node-schedule";
import axios from "axios";

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
    const quotes = await Quotes.findById(request.params.id).populate("category").exec();
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
const randomQuotes = async () => {
  const content = await Quotes.find().populate("category").exec();
  // Filter out quotes with categories that have isdisable: false
  const filteredcontent = content.filter((quote) => {
    return quote.category && quote.category.type === "quotes";
  });
  console.log("filteredcontent", filteredcontent.length);

  const random = Math.floor(Math.random() * filteredcontent.length);
  console.log("random", random);

  const result = await Quotes.findOne()
    .skip(random)
    .populate("category")
    .exec();

  console.log("Random Data:", result);
  return result;
};
const randomShayari = async () => {
  const content = await Quotes.find().populate("category").exec();
  // Filter out quotes with categories that have isdisable: false
  const filteredcontent = content.filter((quote) => {
    return quote.category && quote.category.type === "shayari";
  });
  console.log("filteredcontent", filteredcontent.length);

  const random = Math.floor(Math.random() * filteredcontent.length);
  console.log("random", random);

  const result = await Quotes.findOne()
    .skip(random)
    .populate("category")
    .exec();

  console.log("Random Data:", result);
  return result;
};

schedule.scheduleJob("0 0 * * *", async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Check if a user has added quotes today
    const userAddedQuotesToday = await Quotes.find({
      $and: [{ createdAt: { $gte: today } }, { type: "dailycontent" }],
    })
      .populate("category")
      .exec();
    const latestQuote = userAddedQuotesToday.filter(
      (value) =>
        value.category.type === "quotes" &&
        value.createdAt.toDateString() === today.toDateString()
    );
    console.log("userAddedQuotesToday", latestQuote);
    if (latestQuote.length > 0) {
      console.log("Latest quote is in the 'quotes' category:");
    } else {
      const result = await randomQuotes();
      const addQuoteResponse = await axios.post(
        "http://localhost:8001/dailyquotes",
        {
          type: "dailycontent",
          content: result.content,
          category: result.category,
        }
      );
      console.log("result", result);
      console.log("Daily quote added successfully:", addQuoteResponse.data);
    }
    const latestShayari = userAddedQuotesToday.filter(
      (value) =>
        value.category.type === "shayari" &&
        value.createdAt.toDateString() === today.toDateString()
    );
    if (latestShayari.length > 0) {
      console.log("Latest quote is in the 'shayari' category:");
    } else {
      const result = await randomShayari();
      const addQuoteResponse = await axios.post(
        "http://localhost:8001/dailyshayari",
        {
          type: "dailycontent",
          content: result.content,
          category: result.category,
        }
      );
      console.log("result", result);
      console.log("Daily shayari added successfully:", addQuoteResponse.data);
    }
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
        .status(400)
        .json({ message: "You can only add one quote per day" });
    } else {
      const newItem = new Quotes(request.body);
      // await newItem.save();
      response.status(200).json({ message: "Daily quote added successfully" });
    }
  } catch (error) {
    response
      .status(500)
      .json({ message: `Quote already added today:${error}` });
  }
};
export const dailyshayariadd = async (request, response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const userAddedQuotesToday = await Quotes.find({
      $and: [{ createdAt: { $gte: today } }, { type: "dailycontent" }],
    })
      .populate("category")
      .exec();
    const latestShayari = userAddedQuotesToday.filter(
      (value) =>
        value.category.type === "shayari" &&
        value.createdAt.toDateString() === today.toDateString()
    );
    if (latestShayari.length > 0) {
      response
        .status(400)
        .json({ message: "You can only add one quote per day" });
    } else {
      const newItem = new Quotes(request.body);
      // await newItem.save();
      response.status(200).json({ message: "Daily shayari added successfully" });
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
    const userAddedQuotesToday = await Quotes.find({
      $and: [{ createdAt: { $gte: today } }, { type: "dailycontent" }],
    })
      .populate("category")
      .exec();

    if (userAddedQuotesToday.length > 0) {
      // If the user has added a quote today, retrieve the latest one
      const latestQuote = userAddedQuotesToday.slice(-2);
      response.status(200).json(latestQuote);
    } else {
      response.status(200).json({ message: "yet today content not added" });
    }
  } catch (error) {
    response
      .status(500)
      .json({ error: "Error retrieving daily quote:", error });
  }
};
