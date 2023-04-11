# from application import app
from flask import Flask, render_template, request, jsonify
import os
from dotenv import load_dotenv
from flask_cors import CORS, cross_origin
from info import predictions
from PIL import Image
from pymongo import MongoClient
from datetime import datetime
import uuid
import cloudinary
from cloudinary.uploader import upload, destroy
from cloudinary.utils import cloudinary_url

app = Flask(__name__)
CORS(app, support_credentials=True)

load_dotenv()
cloudinary.config(cloud_name = os.getenv('CLOUD_NAME'), api_key=os.getenv('API_KEY'), 
    api_secret=os.getenv('API_SECRET'))


client = MongoClient(os.getenv('MONGO_URI'))
db = client.predictions
imagePredictions = db.imagePredictions

@app.route('/')
def main():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if(request.method == 'POST'):

        # get the image from the request
        image = request.files['file']
        image_location = './images/' + image.filename
        image_name = image.filename
        image.save(image_location)

         # create a unique id upto 8 characters
        image_id = uuid.uuid4().hex.split('-')[0]

        # upload the image in the database
        if image:
            upload(image_location, public_id=image_id)

        url, options = cloudinary_url(image_id, format="jpg")
        
        img = Image.open(image_location)
        pd = predictions.Predictions()
        res = pd.predict(img)

        # delete the imagefile from folder
        os.remove(image_location)

        # store the image information in the database
        imagePredictions.insert_one({"imageURL": url, "imageName": image_name, "prediction": res, "date": datetime.now(), "image_id": image_id})

        response = jsonify({"imageURL": url, "prediction": res, "image_id": image_id})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response


# update the image information in the database
@app.route('/edit', methods=['POST'])
def edit():
    if(request.method == 'POST'):
        image_id = request.form.get('image_id')
        prediction = request.form.get('prediction')
        imagePredictions.update_one({"image_id": image_id}, {"$set": {"prediction": prediction}})

        response = jsonify({"image_id": image_id, "prediction": prediction})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

# delete the image from the database
@app.route('/delete', methods=['POST'])
def delete():
    if(request.method == 'POST'):
        id = request.form.get('image_id')

        # delete the image from cloudinary
        destroy(id)

        # delete the complete element from database
        imagePredictions.delete_one({"image_id": id})

        response = jsonify({"image_id": id})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response


@app.route('/history', methods=['GET'])
def history():
    if(request.method == 'GET'):
        # sort the images by date in ascending order and convert to json array with objects containing only imageURL, prediction and date
        images = list(imagePredictions.find({}, {"_id": 0, "imageURL": 1, "prediction": 1, "date": 1, "image_id": 1}).sort("date", -1))

        response = jsonify(images)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

if __name__ == '__main__':
    app.run(debug=True)