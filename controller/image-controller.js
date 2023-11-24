import image from "../modal/image.js";

export const addimage= async (request, response) => {
  try {
    if (!request.file) {
      return response.status(400).send("No file uploaded.");
    }
    const newImage = new image({
      name: request.body.name,
      description: request.body.description,
      file: `http://localhost:8001/${request.file.filename}`,
    });
    newImage
      .save()
      .then(() => response.status(200).json(newImage))
      .catch((error) =>
        response.status(500).json({ error: "Error creating the category" })
      );
  } catch (error) {
    response.status(500).json({ error: "Error creating the category", error });
  }
};

export const getimage = async (request, response) => {
  try {
    const category = await image.find();
    response.status(200).json(category);
  } catch (error) {
    response.status(500).json({ error: "Error get the category", error });
  }
};

export const updateimage = async (request, response) => {
  try {
    console.log("request body",request.body);
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
      return response.status(404).json({ error: "Category not found" });
    }
    response.status(200).json(category);
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: "Error update the category", error });
  }
};

export const deleteimage = async(request,response)=>{
    try{
        const category = await image.deleteOne({ _id: request.params.id });
        if (!category) {
          return response.status(404).json({ error: "category not found" });
        }
        response.status(200).json(category);
    }catch(error){
        response.status(500).json({ error: "Error update the category", error });
    }
}