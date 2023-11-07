
import Category from "../modal/category.js";

export const addCategory = async (request, response) => {
  try {
    const newImage = new Category({
      name: request.body.name,
      description: request.body.description,
      image: request.file.path,
    });
    newImage
      .save()
      .then(() => response.status(200).json(newImage))
      .catch((error) => response.status(500).json({ error: "Error creating the category" }));
  } catch (error) {
    response.status(500).json({ error: "Error creating the category" });
  }
};

export const updateCategory = async (request, response) => {
  try {
    const category = await Category.findByIdAndUpdate(
      request.params.id,
      request.body,
      {
        new: true,
      }
    );
    if (!category) {
      return response.status(404).json({ error: "Category not found" });
    }
    response.status(200).json(category);
  } catch (error) {
    response.status(500).json({ error: "Error update the category" });
  }
};

export const getCategory = async (request, response) => {
    try {
      const category = await Category.find({isdisable: true});
      response.status(201).json(category);
    } catch (error) {
        response.status(500).json({ error: "Error get the category" });
    }
  };

export const deleteCategory = async (request, response) => {
  try {
    const category = await Category.deleteOne({ _id: request.params.id });
    if (!category) {
      return response.status(404).json({ error: "category not found" });
    }
    response.status(200).json(category);
  } catch (error) {
    response.status(500).json({ error: "Error delete the category" });
  }
};

