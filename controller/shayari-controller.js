import Shayari from "../modal/shayari.js";
import schedule from "node-schedule";
import axios from "axios";

export const addShayari = async (request, response) => {
  try {
    const newItem = new Shayari(request.body);
    await newItem.save();
    response.status(200).json({ message: "Shayari added successfully" });
  } catch (error) {
    response
      .status(500)
      .json({ message: `Error creating the Shayari:${error}` });
  }
};

export const getShayari = async (request, response) => {
  try {
    const content = await Shayari.find().populate("category").exec();
    const filteredcontent = content.filter((shayari) => {
      return shayari.category && shayari.category.isdisable === true;
    });
    response.status(200).json(filteredcontent);
  } catch (error) {
    response.status(500).json({ message: `Error fetching Shayari:${error}` });
  }
};

export const getIdShayari = async (request, response) => {
  try {
    const quotes = await Shayari.findById(request.params.id)
      .populate("category")
      .exec();
    if (!quotes) {
      return response.status(404).json({ message: "Shayari not found" });
    } else {
      return response.status(200).json(quotes);
    }
  } catch (error) {
    response
      .status(500)
      .json({ message: `Error fetching the shayari:${error}` });
  }
};

export const updateShayari = async (request, response) => {
  try {
    const update = await Shayari.findByIdAndUpdate(
      request.params.id,
      request.body,
      {
        new: true,
      }
    );
    if (!update) {
      return response.status(404).json({ message: "Shayari not found" });
    }
    response.status(200).json({ message: "Shayari updated successfully" });
  } catch (error) {
    response
      .status(500)
      .json({ message: `Error updating the shayari:${error}` });
  }
};

export const deleteShayari = async (request, response) => {
  try {
    const content = await Shayari.deleteOne({ _id: request.params.id });
    if (!content) {
      return response.status(404).json({ message: "Shayari not found" });
    }
    response.json({ message: "Shayari deleted successfully" });
  } catch (error) {
    response.status(500).json({ message: `Error delete the shayari:${error}` });
  }
};

const random = async () => {
  const content = await Shayari.countDocuments();

  const random = Math.floor(Math.random() * content.length);
  console.log("random", random);

  const result = await Shayari.findOne()
    .skip(random)
    .populate("category")
    .exec();

  console.log("Random Data:", result);
  return result;
};

random()
schedule.scheduleJob("0 0 * * *", async () => {
    try{
        const today = new Date();
        today.setHours(0, 0, 0, 0);
    }catch{
 console.error("Error processing scheduled job:", error);
    }
});
