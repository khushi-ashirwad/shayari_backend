import Quotesshyari from "../modal/quotes&shayari.js";
import schedule from "node-schedule";
import axios from "axios";

export const manageQuotesShayari = async (request, response) => {
  try {
    const newItem = new Quotesshyari(request.body);
    await newItem.save();
    response.status(200).json({ message: "Conetent added successfully" });
  } catch (error) {
    response
      .status(500)
      .json({ message: `Error creating the Quotes:${error}` });
  }
};

export const getallcontant = async (request, response) => {
  try {
    const content = await Quotesshyari.find().populate("category").exec();
    // Filter out quotes with categories that have isdisable: false
    const filteredcontent = content.filter((quote) => {
      return quote.category && quote.category.isdisable === true;
    });
    response.status(200).json(filteredcontent);
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: `Error fetching Quotes:${error}` });
  }
};
export const getIdQuotes = async (request, response) => {
  try {
    const quotes = await Quotesshyari.findById(request.params.id);
    if (!quotes) {
      return response.status(404).json({ message: "quotes not found" });
    } else {
      return response.status(200).json(quotes);
    }
  } catch (error) {
    console.log(error);
    response
      .status(500)
      .json({ message: `Error fetching the quotes:${error}` });
  }
};

export const updateQuotesshayari = async (request, response) => {
  try {
    const update = await Quotesshyari.findByIdAndUpdate(
      request.params.id,
      request.body,
      {
        new: true,
      }
    );
    if (!update) {
      return response.status(404).json({ message: "content not found" });
    }
    response.status(200).json({ message: "Content updated successfully" });
  } catch (error) {
    response
      .status(500)
      .json({ message: `Error updating the content:${error}` });
  }
};

export const deleteQuotesshayari = async (request, response) => {
  try {
    const content = await Quotesshyari.deleteOne({ _id: request.params.id });
    if (!content) {
      return response.status(404).json({ message: "content not found" });
    }
    response.json({ message: "Content deleted successfully" });
  } catch (error) {
    response.status(500).json({ message: `Error delete the content:${error}` });
  }
};
const randomQuotes = async () => {
  const count = await Quotesshyari.countDocuments({
    "category.type": "quotes",
  });
  console.log("count", count);

  const random = Math.floor(Math.random() * count);
  console.log("random", random);

  const result = await Quotesshyari.findOne()
    .skip(random)
    .populate("category")
    .exec();

  console.log("Random Data:", result);
  return result;
};
const randomShayari = async () => {
  const count = await Quotesshyari.countDocuments({
    "category.type": { $eq: "shayari" },
  });
  console.log("count", count);

  if (count === 0) {
    console.log("No documents found for the given query.");
    return null;
  }

  const random = Math.floor(Math.random() * count);
  console.log("random", random);

  const result = await Quotesshyari.findOne()
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
    const userAddedQuotesToday = await Quotesshyari.find({
      $and: [{ createdAt: { $gte: today } }, { type: "dailycontent" }],
    })
      .populate("category")
      .exec();
    console.log("userAddedQuotesToday", userAddedQuotesToday);
    if (userAddedQuotesToday.length > 0) {
      console.log("User added quotes today:");
      const latestQuote = userAddedQuotesToday.filter(
        (value) =>
          value.category.type === "quotes" &&
          value.createdAt.toDateString() === today.toDateString()
      );
      console.log("latestQuote", latestQuote);
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
    } else {
      console.log("Daily quote added successfully:");
    }

    if (userAddedQuotesToday.length > 0) {
      console.log("User added shayari today:");
      const latestShayari = userAddedQuotesToday.filter(
        (value) =>
          value.category.type === "shayari" &&
          value.createdAt.toDateString() === today.toDateString()
      );
      console.log("latestShayari", latestShayari);
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
    } else {
      console.log("Daily quote added successfully:");
    }
  } catch (error) {
    console.error("Error processing scheduled job:", error);
  }
});

export const dailyquotesadd = async (request, response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const userAddedQuotesToday = await Quotesshyari.find({
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
      const newItem = new Quotesshyari(request.body);
      await newItem.save();
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
    const userAddedQuotesToday = await Quotesshyari.find({
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
      const newItem = new Quotesshyari(request.body);
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
    const userAddedQuotesToday = await Quotesshyari.find({
      $and: [{ createdAt: { $gte: today } }, { type: "dailycontent" }],
    })
      .populate("category")
      .exec();

    if (userAddedQuotesToday.length > 0) {
      // If the user has added a quote today, retrieve the latest one
      const latestQuote = userAddedQuotesToday.slice(-2);
      console.log("Latest user-added quote today:", latestQuote);
      response.status(200).json(latestQuote);
    } else {
      // If no user-added quote today, fetch a random quote
      const result = await random();
      console.log("Random quote:", result);
      response.status(200).json(result);
    }
  } catch (error) {
    response
      .status(500)
      .json({ error: "Error retrieving daily quote:", error });
  }
};
