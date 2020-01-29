import sys
from PIL import Image
import cv2
from pdf2image import convert_from_path
import pytesseract

args = sys.argv[1:]

#images = convert_from_path('./files/' + args[0])
content = []
string = ''
img = cv2.imread(args[0], 0)

#for image in images:
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
gray = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY)[1]
gray = cv2.medianBlur(gray, 3)

text = pytesseract.image_to_string(gray)
content.extend(text)

for char in content:
    string = string + ' ' + char

print(string)