import { request } from "express";
import image from "../modal/image.js";

export const addimage= async (request, response) => {
  try {
    if (!request.file) {
      return response.status(400).json({message:"No file uploaded."});
    }
    const newImage = new image({
      ...request.body,
      file: `http://localhost:8001/${request.file.filename}`,
    });
    newImage
      .save()
      .then(() => response.status(200).json({message:"Image content added successfully"}))
      .catch((error) =>
     {
        response.status(500).json({ message: "Error creating the image content" })}
      );
  } catch (error) {
    response.status(500).json({ message: `Error creating the image content:${error}` });
  }
};

export const getimage = async (request, response) => {
  try {
    const category = await image.find().populate("category").exec();
    const filteredcontent = category.filter((quote) => {
      return quote.category && quote.category.isdisable === true;
    });
    response.status(200).json(filteredcontent);
  } catch (error) {
    response.status(500).json({ message: `Error get the image content error:${error}` });
  }
};

export const getIdimage = async(request,response)=>{
  try {
    const Image = await image.findById(request.params.id).populate("category").exec();
    if (!Image) {
      return response.status(404).json({ message: "image content not found" });
    } else {
      return response.status(200).json(Image);
    }
  } catch (error) {
    response
      .status(500)
      .json({ message: `Error fetching the quotes:${error}` });
  }
}
export const updateimage = async (request, response) => {
  try {
    const updatedData = request.file
      ? {
          ...request.body,
          file: `http://localhost:8001/${request.file.filename}`,
        }
      : request.body;

    const category = await image.findByIdAndUpdate(
      request.params.id,
      updatedData,
      {
        new: true,
      }
    );
    if (!category) {
      return response.status(404).json({message: "Category not found" });
    }
    response.status(200).json({message:"Image content updated successfully"});
  } catch (error) {
    response.status(500).json({ message: `Error update the image content:${error}`});
  }
};

export const deleteimage = async(request,response)=>{
    try{
        const category = await image.deleteOne({ _id: request.params.id });
        if (!category) {
          return response.status(404).json({ message: "Image content not found" });
        }
        response.status(200).json({message:"Image content deleted"});
    }catch(error){
        response.status(500).json({message: `Error update the image content:${error}` });
    }
}