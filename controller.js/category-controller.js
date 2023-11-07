import Category from "../modal/category.js";

export const addCategory = async (request, response) => {
  try {
    const newImage = new Category({
      name: request.body.name,
      description: request.body.description,
      image: request.file.filename,
    });
    newImage
      .save()
      .then(() => response.send("successfully upload"))
      .catch((error) => console.log(error));
  } catch (error) {
    console.log(error);
  }
};
