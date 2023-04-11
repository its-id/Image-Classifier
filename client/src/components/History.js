import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { toast } from "react-toastify";
import { TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import moment from "moment";

const EditPredictionModal = ({ setEdit, prediction, setPrediction, imageId }) => {
  const [open, setOpen] = useState(true);
  const [tempPrediction, setTempPrediction] = useState(prediction);

  const handleEditPrediction = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image_id", imageId);
    formData.append("prediction", tempPrediction);

    await fetch(`${process.env.REACT_APP_BASE_URL}/edit`, {
      method: "POST",
      body: formData,
      headers: {
        enctype: "multipart/form-data",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("data", data);
        setPrediction(data?.prediction);
        toast.success("Prediction edited successfully");
      })
      .catch((err) => {
        toast.error("Error editing prediction");
      });
    setOpen(false);
    setEdit(false);
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                    onClick={() => {
                      setOpen(false);
                      setEdit(false);
                    }}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                      Edit Prediction
                    </Dialog.Title>
                    {/* <div className=" w-full h-full flex flex-col"> */}
                    {/* Edit Details */}
                    {/* <div className="mt-2 mb-5"> */}
                    <input
                      type="text"
                      name="name"
                      defaultValue={prediction}
                      onChange={(e) => setTempPrediction(e.target.value)}
                      id="name"
                      className="mt-2 mb-5 focus:ring-teal-500 focus:border-teal-500 w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                    {/* </div> */}
                    {/* </div> */}
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-teal-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleEditPrediction}
                  >
                    Update Prediction
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => {
                      setOpen(false);
                      setEdit(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

const History = () => {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState(null);
  const [imageId, setImageId] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [edit, setEdit] = useState(false);
  const [deleted, setDeleted] = useState();

  useEffect(async () => {
    await fetch(`${process.env.REACT_APP_BASE_URL}/history`)
      .then((res) => res.json())
      .then((data) => {
        setHistory(data);
        setLoading(false);
      });
  }, [prediction, deleted]);

  const handleUpdate = (image_id, image_prediction) => {
    setEdit(true);
    setImageId(image_id);
    setPrediction(image_prediction);
  };

  const handleDelete = async (id) => {
    const formData = new FormData();
    formData.append("image_id", id);

    await fetch(`${process.env.REACT_APP_BASE_URL}/delete`, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setDeleted(id);
        toast.success("Prediction Deleted successfully");
      })
      .catch((err) => {
        toast.error("Error deleting prediction");
      });
  };

  return (
    <>
      {edit && <EditPredictionModal setEdit={setEdit} prediction={prediction} setPrediction={setPrediction} imageId={imageId} />}
      {loading ? (
        <div className="w-full h-full flex item-center justify-center">Loading...</div>
      ) : (
        <>
          <div className="my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 text-left text-base font-semibold text-gray-900 sm:pl-6">
                        Predicted At
                      </th>
                      <th scope="col" className="py-3.5 text-left text-base font-semibold text-gray-900">
                        Prediction
                      </th>
                      <th scope="col" className="pl-4 py-3.5 text-left text-base font-semibold text-gray-900">
                        Image
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {history.map((item) => (
                      <tr key={item.image_id}>
                        <td className="max-w-[50px] py-4 pl-4 pr-8 text-base font-medium text-gray-900 sm:pl-6 truncate ">{item.date}</td>
                        <td className="max-w-[150px] py-4 pr-8 text-base text-gray-500 truncate">{item.prediction}</td>
                        <td className="whitespace-nowrap py-4 pl-4 text-sm">
                          <img src={item.imageURL} className="h-[50px] w-auto rounded-lg border-2 border-gray-300" />
                        </td>
                        <td className="w-auto flex items-center justify-around whitespace-nowrap py-4 text-right text-base font-medium ">
                          <button className="text-red-600 hover:text-red-900" onClick={() => handleDelete(item.image_id)}>
                            <TrashIcon className="cursor-pointer bg-red text-red-600 hover:text-red-900 w-5 h-5" />
                          </button>
                          <button className="text-indigo-600 hover:text-indigo-900" onClick={() => handleUpdate(item.image_id, item.prediction)}>
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default History;
