import Category from "../modal/category.js";

import Quotesshyari from "../modal/quotes&shayari.js";

export const addCategory = async (request, response) => {
  try {
    if (!request.file) {
      return response.status(400).send("No file uploaded.");
    }
    const newImage = new Category({
      name: request.body.name,
      description: request.body.description,
      file: `http://localhost:8001/${request.file.filename}`,
      type: request.body.type,
    });
    newImage
      .save()
      .then(() => response.status(200).json(newImage))
      .catch((error) => response.status(500).json({ message: `${error}` }));
  } catch (error) {
    response
      .status(500)
      .json({ message: `Error creating the category:${error} ` });
  }
};

export const updateCategory = async (request, response) => {
  try {
    const updatedData = request.file
      ? {
          ...request.body,
          file: `http://localhost:8001/${request.file.filename}`,
        }
      : request.body;

    const category = await Category.findByIdAndUpdate(
      request.params.id,
      updatedData,
      {
        new: true,
      }
    );
    if (!category) {
      return response.status(404).json({ message: "Category not found" });
    }
    response.status(200).json(category);
  } catch (error) {
    console.log(error);
    response
      .status(500)
      .json({ message: `Error update the category:${error}` });
  }
};

export const getCategory = async (request, response) => {
  try {
    // const category = await Category.find({isdisable: true});
    const category = await Category.find();
    response.status(201).json(category);
  } catch (error) {
    response.status(500).json({ message: `Error get the category:${error}` });
  }
};

export const deleteCategory = async (request, response) => {
  try {
    await Quotesshyari.deleteMany({ category: request.params.id });
    const category = await Category.deleteOne({ _id: request.params.id });

    if (!category) {
      return response.status(404).json({ message: "category not found" });
    }

    response.status(200).json(category);
  } catch (error) {
    response
      .status(500)
      .json({ message: `Error deleteing the category:${error}` });
  }
};
