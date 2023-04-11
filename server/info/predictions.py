from info import mongo
import torch
from transformers import AutoImageProcessor, ResNetForImageClassification
# import uuid
# from PIL import Image
# from io import BytesIO

class Predictions():

    # def __init__(self):
        # self.mongoObj = mongo.MongoConnect('predictions')
        # self.db = self.mongoObj.data
        # print('db', self.db)

    # def saveImage(self, image):
    #     # convert image filename to unique code
    #     uid = uuid.uuid4().hex 
    #     self.db.insert_one({"image": image, "image_id": uid, "imageName": image.filename, "prediction": ""})
        

    # def getImage(self, image_id):

    def predict(self, image):
        processor = AutoImageProcessor.from_pretrained("microsoft/resnet-50")
        model = ResNetForImageClassification.from_pretrained("microsoft/resnet-50")
        inputs = processor(image, return_tensors="pt")
        with torch.no_grad():
            logits = model(**inputs).logits
            
        # model predicts one of the 1000 ImageNet classes 
        predicted_label = logits.argmax(-1).item()
        preds = model.config.id2label[predicted_label]

        # store the prediction in the database
        # self.db.insert_one({"image": image, "prediction": preds})

        return preds