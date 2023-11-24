import Quotesshyari from "../modal/quotes&shayari.js";
import Category from "../modal/category.js";
import schedule from "node-schedule";
import axios from "axios";

export const manageQuotesShayari = async (request, response) => {
  try {
    const newItem = new Quotesshyari(request.body);
    await newItem.save();
    response.status(200).json(newItem);
  } catch (error) {
    console.log("error", error);
    response.status(500).json({ error: "Error creating the Quotes" });
  }
};

export const getallcontant = async (request, response) => {
  try {
    const content = await Quotesshyari.find().populate("category").exec();
    // Filter out quotes with categories that have isdisable: false
    const filteredcontent = content.filter(
      (quote) => quote.category.isdisable === true
    );
    response.status(200).json(filteredcontent);
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: "Error fetching Quotes" });
  }
};
export const getIdQuotes = async (request, response) => {
  try {
    const quotes = await Quotesshyari.findById(request.params.id);
    if (!quotes) {
      return response.status(404).json({ error: "quotes not found" });
    } else {
      return response.status(200).json(quotes);
    }
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: "Error fetching the quotes" });
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
      return response.status(404).json({ error: "content not found" });
    }
    response.status(200).json(update);
  } catch (error) {
    response.status(500).json({ error: "Error updating the content" });
  }
};

export const deleteQuotesshayari = async (request, response) => {
  try {
    const content = await Quotesshyari.deleteOne({ _id: request.params.id });
    if (!content) {
      return response.status(404).json({ error: "content not found" });
    }
    response.json(content);
  } catch (error) {
    response.status(500).json({ error: "Error delete the content" });
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
    const result = await random();
    const addQuoteResponse = await axios.post(
      "http://localhost:8001/dailycontent",
      {
        content: result.content,
        category: result.category,
      }
    );
    console.log("Daily quote added successfully:", addQuoteResponse.data);
  } catch (error) {
    console.error("Error adding daily quote:", error);
  }
});

export const dailyContentadd = async (request, response) => {
  try {
    const newItem = new Quotesshyari(request.body);
    await newItem.save();
    response.status(200).json({ message: "Daily quote added successfully " });
    return request.body;
  } catch (error) {
    response.status(500).json({ error: "Error adding daily quote:", error });
    
  }
};

export const dailyContentget = async (request, response) => {
  try {
    const content = dailyContentadd();
    console.log("dailycontentget", content);
    // response.status(200).json(content);
  } catch (error) {
    // response.status(500).json({ error: "Error adding daily quote:", error });
  }
};