import os
from PIL import Image
import base64
from io import BytesIO
import json

def get_asl_images(input_text, folder_path='public/images/asl_alphabet'):
    input_text = input_text.lower()
    result = []

    for char in input_text:
        if char == ' ':
            result.append({
                'char': char,
                'image': None,  # Space doesn't have an image
                'type': 'space',
                'imagePath': '/images/asl_alphabet/space_test.jpg'
            })
        elif char.isalpha():
            filename = f'{char}_test.jpg'
            img_path = os.path.join(folder_path, filename)
            
            if os.path.exists(img_path):
                result.append({
                    'char': char,
                    'type': 'letter',
                    'imagePath': f'/images/asl_alphabet/{filename}'
                })
            else:
                result.append({
                    'char': char,
                    'type': 'missing',
                    'imagePath': None
                })
        else:
            # For non-alphabetic characters
            result.append({
                'char': char,
                'type': 'unsupported',
                'imagePath': None
            })

    return result

def process_text(text):
    # Process the text and return the result as JSON
    result = get_asl_images(text)
    return json.dumps({"result": result})
