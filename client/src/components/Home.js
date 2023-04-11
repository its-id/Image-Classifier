import React, { useState } from "react";
import { toast } from "react-toastify";

const Home = () => {
  const [image, setImage] = useState(null);
  const [imageShowable, setImageShowable] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);

  const handleCompressedUpload = (e) => {
    setImageShowable(URL.createObjectURL(e.target.files[0]));
    setImage(e.target.files[0]);
    // new Compressor(image, {
    //   quality: 0.8,
    //   success: (compressedResult) => {
    //     console.log("compressedresult", compressedResult);
    //     setImage(compressedResult);
    //   },
    // });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (image === null) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);

    setLoading(true);

    await fetch(`${process.env.REACT_APP_BASE_URL}/predict`, {
      method: "POST",
      body: formData,
      headers: {
        enctype: "multipart/form-data",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        setPrediction(data?.prediction);
        toast.success("Prediction successful");
      })
      .catch((err) => {
        setLoading(false);
        toast.error("Error predicting image");
      });
  };

  return (
    <>
      <div className="my-5">Upload a Photo of any animal and the image classification [RESNET-50] model will predict its class or species</div>
      {/* <div className="sm:grid sm:grid-cols-4 sm:items-start sm:gap-4 sm:border-gray-200 sm:pt-5"> */}
      {imageShowable ? (
        <div className="mt-1 sm:mt-0">
          <img src={imageShowable} className="border rounded-lg border-gray-600 w-[30%]" />
        </div>
      ) : (
        <>
          <div className="flex max-w-full justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
            <div className="space-y-1 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="imageFile"
                  className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                >
                  <span>Upload a Photo</span>
                  <input id="imageFile" name="imageFile" type="file" className="sr-only" onChange={handleCompressedUpload} />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
            </div>
          </div>
        </>
      )}
      {prediction === null ? (
        <label htmlFor="cover-photo">
          <button
            type="submit"
            className="mt-5 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-6 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={handleSubmit}
          >
            {loading ? "Loading.." : "Predict Class"}
          </button>
        </label>
      ) : (
        <h2 className="text-lg font-bold mt-5">Predicted Class : {prediction}</h2>
      )}

      {/* </div> */}
    </>
  );
};

export default Home;
