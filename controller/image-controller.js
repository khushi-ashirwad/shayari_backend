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
      .then(() => response.status(200).json({message:"Image quotes added successfully"}))
      .catch((error) =>
        response.status(500).json({ message: "Error creating the image content" })
      );
  } catch (error) {
    response.status(500).json({ message: `Error creating the image content:${error}` });
  }
};

export const getimage = async (request, response) => {
  try {
    const category = await image.find().populate("category").exec();
    const filteredcategory = category.filter(
      (quote) => quote.category.isdisable === true
    );
    response.status(200).json(filteredcategory);
  } catch (error) {
    response.status(500).json({ message: `Error get the image content error:${error}` });
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
      return response.status(404).json({message: "Category not found" });
    }
    response.status(200).json({message:"Image quotes updated successfully"});
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: `Error update the image content:${error}`});
  }
};

export const deleteimage = async(request,response)=>{
    try{
        const category = await image.deleteOne({ _id: request.params.id });
        if (!category) {
          return response.status(404).json({ message: "Image quotes not found" });
        }
        response.status(200).json({message:"Image quotes deleted"});
    }catch(error){
        response.status(500).json({message: `Error update the image content:${error}` });
    }
}