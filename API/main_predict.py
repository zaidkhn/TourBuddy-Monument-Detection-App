import math
import tensorflow.keras
from PIL import Image, ImageOps
import numpy as np
import base64
from flask import Flask
from flask_cors import CORS
from flask import current_app, flash, jsonify, make_response, redirect, request, url_for
from flask_ngrok import run_with_ngrok
from flask import request


app = Flask(__name__)
CORS(app)
run_with_ngrok(app)


@app.route('/api', methods=['GET', 'POST'])
def find_monument():
    main_val = request.get_json()
    val = str(main_val['file'])
    # print(val)
    image_64_decode = base64.b64decode(val)
    # create a writable image and write the decoding result
    image_result = open('result_decode.jpg', 'wb')
    image_result.write(image_64_decode)

    # Disable scientific notation for clarity
    np.set_printoptions(suppress=True)

    # Load the model
    model = tensorflow.keras.models.load_model('keras_model.h5')


    classes = ["BIBI KA MAQBARA", "CHARMINAR", "GOL GUMBAZ", "HAWA MAHAL", "KANCH MAHAL",
              "LOTUS TEMPLE", "PARLIAMENT", "RED FORT", "TAJ MAHAL", "not detected","ad","sd"]

    # Create the array of the right shape to feed into the keras model
    # The 'length' or number of images you can put into the array is
    # determined by the first position in the shape tuple, in this case 1.
    data = np.ndarray(shape=(1, 224, 224, 3), dtype=np.float32)

    # Replace this with the path to your image
    image = Image.open('./result_decode.jpg')

    # resize the image to a 224x224 with the same strategy as in TM2:
    # resizing the image to be at least 224x224 and then cropping from the center
    size = (224, 224)
    image = ImageOps.fit(image, size, Image.ANTIALIAS)

    # turn the image into a numpy array
    image_array = np.asarray(image)

    # display the resized image
    image.show()

    # Normalize the image
    normalized_image_array = (image_array.astype(np.float32) / 127.0) - 1

    # Load the image into the array
    data[0] = normalized_image_array

    # run the inference
    prediction = model.predict(data)
    #print(prediction[0][0])
    #sval = str(prediction[0][0])
    #ival = math.ceil(float(sval[:3]))
    #print(ival)
    #print(type(prediction[0][0]))
    #print(classes[ival])
    #print(prediction)
    #print(round(2.3))
    #print("1 : "+str(prediction[0][0])+" 2 : "+str(prediction[0][1])+" 3 : "+str(prediction[0][2])+" 4 : "+str(prediction[0][3])+" 5 : "+str(prediction[0][4])+" 6 : "+str(prediction[0][5])+" 7 : "+str(prediction[0][6])+" 8 : "+str(prediction[0][7])+" 9 : "+str(prediction[0][8]))
    if(round(prediction[0][0])==1):
      print("bibi ka maqbara")
      response = make_response(jsonify({"title": "Bibi Ka Maqbara", "desc": "The Bibi Ka Maqbara is a tomb located in Aurangabad, Maharashtra, India. It was commissioned in 1660 by the Mughal emperor Aurangzeb in the memory of his first and chief wife Dilras Banu Begum and is considered to be a symbol of Aurangzeb's"}))

    if(round(prediction[0][1])==1):
      print("charminar")
      response = make_response(jsonify({"title": "Charminar", "desc": "The Charminar constructed in 1591, is a monument and mosque located in Hyderabad, Telangana, India. The landmark has become known globally as a symbol of Hyderabad and is listed among the most recognised structures in India."}))


    if(round(prediction[0][2])==1):
      print("gol gumbaz")
      response = make_response(jsonify({"title": "Gol Gumbaz", "desc": "Gol Gumbaz is the tomb of king Muhammad Adil Shah, Adil Shah Dynasty. Construction of the tomb, located in Bijapur, Karnataka, India, was started in 1626 and completed in 1656. The name is based on Gol Gumbadh derived from Gola Gummata meaning circular dome. It follows the style of Indo-Islamic architecture."}))


    if(round(prediction[0][3])==1):
      print("hawa mahal")
      response = make_response(jsonify({"title": "Hawa Mahal", "desc": "Hawa Mahal, also known as “Palace of Breeze”, was built in 1799 as an extension to the Royal City Palace of Jaipur.It allows the royal ladies who at the time strictly observed “pardah”, to be able to watch any processions and activities on the street without being seen by the public."}))


    if(round(prediction[0][4])==1):
      print("kanch mahal")
      response = make_response(jsonify({"title": "Kanch Mahal", "desc": "Situated close to Akbar’s tomb in Sikandra, the square-shaped Kanch Mahal is a testimony to the best features of domestic Mughal architecture. Records show that the mahal was built from 1605 to 1619. It is called Kanch Mahal because of the abundant use of tile work in its construction."}))

    if(round(prediction[0][5])==1):
      print("lotus temple")
      response = make_response(jsonify({"title": "Lotus Temple", "desc": "The Lotus Temple, located in Delhi, India, is a Baháʼí House of Worship that was dedicated in December 1986. Notable for its flowerlike shape, it has become a prominent attraction in the city. Like all Baháʼí Houses of Worship, the Lotus Temple is open to all, regardless of religion or any other qualification."}))

    if(round(prediction[0][6])==1):
      print("parliament")
      response = make_response(jsonify({"title": "Parliament", "desc": "In modern politics and history, a parliament is a legislative body of government. Generally, a modern parliament has three functions: representing the electorate, making laws, and overseeing the government via hearings and inquiries."}))

    if(round(prediction[0][7])==1):
      print("red fort")  
      response = make_response(jsonify({"title": "Red Fort", "desc": "The Red Fort is a historic fort in the city of Delhi (in Old Delhi) in India that served as the main residence of the Mughal Emperors. Emperor Shah Jahan commissioned construction of the Red Fort on 12 May 1638, when he decided to shift his capital from Agra to Delhi. Originally red and white, its painting is credited to architect Ustad Ahmad Lahori, who also constructed the Taj Mahal."}))

    if(round(prediction[0][8])==1):
      print("taj mahal")
      response = make_response(jsonify({"title": "Taj Mahal", "desc": "The Taj Mahal is located on the right bank of the Yamuna River in a vast Mughal garden that encompasses nearly 17 hectares, in the Agra District in Uttar Pradesh. It was built by Mughal Emperor Shah Jahan in memory of his wife Mumtaz Mahal with construction starting in 1632 AD and completed in 1648 AD, with the mosque, the guest house and the main gateway on the south, the outer courtyard and its cloisters were added subsequently and completed in 1653 AD."}))


    response.headers["Content-Type"] = "application/json"
    return response


app.run()      