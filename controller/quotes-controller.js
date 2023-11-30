import Quotesshyari from "../modal/quotes&shayari.js";
import schedule from "node-schedule";
import axios from "axios";

export const manageQuotesShayari = async (request, response) => {
  try {
    const newItem = new Quotesshyari(request.body);
    console.log(newItem);
    await newItem.save();
    response.status(200).json(newItem);
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
    response.status(200).json(update);
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
    response.json(content);
  } catch (error) {
    response.status(500).json({ message: `Error delete the content:${error}` });
  }
};
const random = async () => {
  const count = await Quotesshyari.countDocuments();
  console.log("count", count);

  const random = Math.floor(Math.random() * count);
  console.log("random", random);

  const result = await Quotesshyari.findOne().skip(random).exec();

  console.log("Random Data:", result);
  return result;
};

schedule.scheduleJob("0 0 * * *", async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if a user has added quotes today
    const userAddedQuotesToday = await Quotesshyari.find({
      createdAt: { $gte: today },
    });

    if (userAddedQuotesToday.length > 0) {
      console.log("User added quotes today:");
    } else {
      // If no user-added quote today, add a random quote
      const result = await random();
      const addQuoteResponse = await axios.post(
        "http://localhost:8001/dailycontent",
        {
          content: result.content,
          category: result.category,
        }
      );
      console.log("Daily quote added successfully:", addQuoteResponse.data);
    }
  } catch (error) {
    console.error("Error processing scheduled job:", error);
  }
});

// schedule.scheduleJob("*/1 * * * *", async () => {
//   try {
//     const fiveMinutesAgo = new Date();
//     fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 1);

//     // Check if a user has added quotes within the last 5 minutes
//     const userAddedQuotesLastFiveMinutes = await Quotesshyari.find({
//       createdAt: { $gte: fiveMinutesAgo },
//     });

//     if (userAddedQuotesLastFiveMinutes.length > 0) {
//       console.log("User added quotes within the last 5 minutes:", userAddedQuotesLastFiveMinutes);
//     } else {
//       // If no user-added quote in the last 5 minutes, add a random quote
//       const result = await random();
//       const addQuoteResponse = await axios.post(
//         "http://localhost:8001/dailycontent",
//         {
//           content: result.content,
//           category: result.category,
//         }
//       );
//       console.log("Daily quote added successfully:", addQuoteResponse.data);
//     }
//   } catch (error) {
//     console.error("Error processing scheduled job:", error);
//   }
// });
export const dailyContentadd = async (request, response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if a user has added quotes today
    const userAddedQuotesToday = await Quotesshyari.find({
      createdAt: { $gte: today },
    }).populate("category").exec();
    // console.log("useraddquotestoday", userAddedQuotesToday.category.type==="quotes");
    if (userAddedQuotesToday.length > 0) {
      // If user has already added a quote today, display an error
      response
        .status(400)
        .json({ message: "You can only add one quote per day" });
    } else {
      // If no user-added quote today, save the new quote
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
      createdAt: { $gte: today },
    });
  
    if (userAddedQuotesToday.length > 0) {
      // If the user has added a quote today, retrieve the latest one
      const latestQuote = userAddedQuotesToday[userAddedQuotesToday.length - 1];
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
