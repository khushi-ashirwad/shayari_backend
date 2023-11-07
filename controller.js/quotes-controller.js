import { request, response } from "express";
import Quotes from "../modal/quotes.js";

export const manageQuotes = async (request, response) => {
  try {
    const newItem = new Quotes(request.body);
    await newItem.save();
    response.status(200).json(newItem);
  } catch (error) {
    response.status(500).json({ error: "Error creating the Quotes" });
  }
};

export const getallQuotes = async (request, response) => {
  try {
    const quotes = await Quotes.find().populate("category").exec();
    // Filter out quotes with categories that have isdisable: false
    const filteredQuotes = quotes.filter(
      (quote) => quote.category.isdisable === true
    );
    response.status(200).json(filteredQuotes);
  } catch (error) {
    response.status(500).json({ error: "Error fetching Quotes" });
  }
};
export const getIdQuotes = async (request, response) => {
  try {
    const quotes = await Quotes.findById(request.params.id);
    if (!quotes) {
      return response.status(404).json({ error: "quotes not found" });
    } else {
      return response.status(200).json(quotes);
    }
  } catch (error) {
    response.status(500).json({ error: "Error fetching the quotes" });
  }
};

export const updateQuotes = async (request, response) => {
  try {
    const quotes = await Quotes.findByIdAndUpdate(
      request.params.id,
      request.body,
      {
        new: true,
      }
    );
    if (!quotes) {
      return response.status(404).json({ error: "quotes not found" });
    }
    response.status(200).json(quotes);
  } catch (error) {
    response.status(500).json({ error: "Error updating the quotes" });
  }
};

export const deleteQuotes = async (request, response) => {
  try {
    const quotes = await Quotes.deleteOne({ _id: request.params.id });
    if (!quotes) {
      return response.status(404).json({ error: "quotes not found" });
    }
    response.json(quotes);
  } catch (error) {
    response.status(500).json({ error: "Error delete the quotes" });
  }
};
