import cv2 as cv
import numpy as np
import sys
from pathlib import Path

def edit_temp(img):
    gray_img = cv.cvtColor(img, cv.COLOR_BGR2GRAY)

    _, thresh = cv.threshold(gray_img, 0, 255, cv.THRESH_BINARY)

    mask = cv.morphologyEx(thresh, cv.MORPH_OPEN, cv.getStructuringElement(cv.MORPH_ELLIPSE, (3, 3)))

    canny = cv.Canny(mask, 30, 30)

    kernel = cv.getStructuringElement(cv.MORPH_ELLIPSE, (5,5))
    dilated = cv.dilate(canny, kernel)

    contours, _ = cv.findContours(dilated.copy(), cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)

    blank = np.zeros(img.shape, dtype='uint8')

    cv.drawContours(blank, contours, -1, (255,255,255), cv.FILLED)

    return blank

def resize_temp(img, scale):
    fixEdit = 0.01
    bScale = scale - fixEdit

    height, width  = img.shape[:2]

    bImg = cv.resize(img,  (int(width * bScale), int(height * bScale)), interpolation=cv.INTER_AREA)

    bHeight, bWidth = bImg.shape[:2]

    bY = (bHeight - height) // 2
    bX = (bWidth - width) // 2

    bCrop = bImg[bY : bY + height, bX : bX + width]

    sScale = 2 - scale + fixEdit

    sImg = cv.resize(img, (int(width * sScale), int(height * sScale)), interpolation=cv.INTER_AREA)

    sHeight, sWidth = sImg.shape[:2]

    sY = (height - sHeight) // 2
    sX = (width - sWidth) // 2

    blank = np.zeros(img.shape, dtype='uint8')

    blank[sY : sY + sHeight, sX : sX + sWidth] = sImg

    return bCrop, blank


ctr = 0
def make_temp(path):

    global ctr

    img = cv.imread(path)

    edited = edit_temp(img)

    #cv.imshow('edited', edited)

    big, small = resize_temp(edited, 1.07)

    # cv.imshow('big', big)
    # cv.imshow('small', small)

    # notcanny = cv.bitwise_not(canny)
    # compare = cv.bitwise_and(edited, edited, mask=notcanny)

    #cv.imshow('compare', compare)

    #compare2 = cv.bitwise_and(big, big, mask=notcanny)

    #cv.imshow('compare2', compare2)

    #compare3 = cv.bitwise_xor(compare2, small)

    #cv.imshow('compare3', compare3)

    finalTemp = cv.bitwise_xor(big, small)

    cv.imshow(f'fin{ctr}', finalTemp)
    ctr += 1

paths = open('C:/Users/gewes/Documents/jsProjekty/PIAserver-1.1/post_production/paths.txt', 'r', encoding='utf-8').read() #sys.argv[1]


print(paths)
# print(paths)
#img = cv.imread('../templates/\\xc3\\x85\\xc2\\xa0koda/KaroQ/Ambition.png'.encode('raw_unicode_escape').decode('utf-8'))
#cv.imshow('i', img)

# for i in range(0, len(paths), len(paths) // 5):
#     my_file = Path(paths[i])
#     if my_file.exists():
#         p = str(Path(paths[i]).resolve())
#         p = p.replace("\\", "/")
#         print(p)
#         make_temp(p)

# print('done')

# img = cv.imread('./temp.png', cv.IMREAD_UNCHANGED)

# width, height = img.shape[:2]


# for y in range(0, height):
#     for x in range(0, width):
#         if img[x,y,3] > 0:
#             img[x,y] = 255

# mask = cv.morphologyEx(img, cv.MORPH_OPEN, cv.getStructuringElement(cv.MORPH_ELLIPSE, (3, 3)))
# cv.imshow('img', mask)

# img2 = cv.imread('./temp.png')
# edited = edit_temp(img2)

# cv.imshow('2', edited)


"""
height, width  = img.shape[:2]
scale = 1.015
bMask = cv.resize(mask,  (int(width * scale), int(height * scale)), interpolation=cv.INTER_AREA)

#cv.imshow('bing', bigMask)

bigHeight, bigWidth = bigMask.shape[:2]

y = (bigWidth - width) // 2
x = (bigHeight - height) // 2

croped = bigMask[y : y + height, x : x + width]

#cv.imshow('croped', croped)
notCroped = cv.bitwise_not(croped)
mash = cv.bitwise_or(mask, notCroped)

#cv.imshow('mash', mash)

smallScale = 2 - scale
smallMask = cv.resize(mask,  (int(width * smallScale), int(height * smallScale)), interpolation=cv.INTER_AREA)

#cv.imshow('small', smallMask)

blank = np.zeros(img.shape[:2], dtype='uint8')

smallHeight, smallWidth = smallMask.shape[:2]
offsetY = (height - smallHeight) // 2
offsetX = (width - smallWidth) // 2

blank[offsetY : offsetY + smallHeight, offsetX : offsetX + smallWidth] = smallMask
# for y in range(0, smallHeight):
#     for x in range(0, smallWidth):
#        if smallMask[y, x] != 0:
#            blank[y + offsetY, x + offsetX] = smallMask[y, x]

#cv.imshow('blank', blank)
notBlank = cv.bitwise_not(blank)

mash2 = cv.bitwise_and(mash, notBlank)

cv.imshow('mash2', mash2)
# thresh = cv.adaptiveThreshold(gray_img, 255, cv.ADAPTIVE_THRESH_MEAN_C, cv.THRESH_BINARY_INV, 11, 3)

# cv.imshow('thresh', thresh)

# mask = np.zeros(img.shape[:2], dtype='uint8')

# white_mask = cv.bitwise_not(mask)

# car_xor = cv.bitwise_xor(thresh, white_mask)

# cv.imshow('xor', car_xor)

# car_and = cv.bitwise_or(thresh, car_xor)

# cv.imshow('and', car_and)
# width, height = img.shape[:2]
# for y in range(0, height):
#     for x in range(0, width):
#         if((img[x,y] != [0,0,0]).all()):
#             img[x,y] = 255

# cv.imshow('img', img)
"""
cv.waitKey(0)
cv.destroyAllWindows()