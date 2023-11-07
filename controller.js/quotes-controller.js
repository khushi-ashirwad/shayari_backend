import { request, response } from "express";
import Quotes from "../modal/quotes.js";

export const manageQuotes = async (request, response) => {
  try {
    const newItem = new Quotes(request.body);
    await newItem.save();
    response.json(newItem);
  } catch (error) {
    response.status(500).json({ error: "Error creating the Quotes" });
  }
};

export const getallQuotes = async (request, response) => {
  try {
    const items = await Quotes.find();
    response.json(items);
  } catch (error) {
    response.status(500).json({ error: "Error fetching Quotes" });
  }
};

export const getIdQuotes = async (request, response) => {
  try {
    const quotes = await Quotes.findById(request.params.id);
    if (!quotes) {
      return response.status(404).json({ error: "Item not found" });
    } else {
      return response.json(quotes);
    }
  } catch (error) {
    response.status(500).json({ error: "Error fetching the item" });
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
      return response.status(404).json({ error: "Item not found" });
    }
    response.json(quotes); 
  } catch (error) {
    response.status(500).json({ error: "Error updating the item" });
  }
};

export const deleteQuotes = async (request, response) => {
  try {
    const quotes = await Quotes.deleteOne({_id:request.params.id});
    if (!quotes) {
      return response.status(404).json({ error: "Item not found" });
    }
    response.json(quotes);
  } catch (error) {
    response.status(500).json({ error: "Error updating the item" });
  }
};
