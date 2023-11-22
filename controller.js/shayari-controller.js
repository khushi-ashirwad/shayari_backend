import { response } from "express";
import Shayari from "../modal/shayari.js";

export const addShayari = async (request, response) => {
  try {
    const newItem = new Shayari(request.body);
    await newItem.save();
    response.status(200).json(newItem);
  } catch (error) {
    response.status(500).json({ error: "Error creating the Shayari" });
  }
};

export const getAllshayari = async (request, response) => {
  try {
    const shayari = await Shayari.find().populate("category").exec();
    // Filter out quotes with categories that have isdisable: false
    const filteredshayari = shayari.filter(
      (shayari) => shayari.category.isdisable === true
    );
    response.status(200).json(filteredshayari);
  } catch (error) {
    response.status(500).json({ error: "Error fetching Quotes" });
  }
};

export const getIdshayari = async (request, response) => {
  try {
    const shayari = await Shayari.findById(request.params.id);
    if (!shayari) {
      return response.status(404).json({ error: "Shayari not found" });
    } else {
      return response.status(200).json(shayari);
    }
  } catch (error) {
    response.status(500).json({ error: "Error fetching the shayari" });
  }
};

export const updateShyari = async (request, response) => {
  try {
    const shayari = await Shayari.findByIdAndUpdate(
      request.params.id,
      request.body,
      {
        new: true,
      }
    );
    if (!shayari) {
      return response.status(404).json({ error: "quotes not found" });
    }
    response.status(200).json(shayari);
  } catch (error) {
    response.status(500).json({ error: "Error updating the shayari" });
  }
};

export const deleteShyari = async(request,response)=>{
    try{
        const shayari = await Shayari.deleteOne({ _id: request.params.id });
        if (!shayari) {
          return response.status(404).json({ error: "quotes not found" });
        }
        response.json(shayari);
    }catch(error){
        response.status(500).json({ error: "Error delete the shayari" });
    }
}
