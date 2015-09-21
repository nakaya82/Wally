#!/usr/local/bin/python3

from PIL import Image
from PIL import ImageDraw
import sys
import math
import os.path

def goSearch():
    argvs = sys.argv
    if (len(argvs) != 3):
        print 'Usage: # python %s canvas-Img target-Img ' % argvs[0]
        sys.exit()
    if (isntFile(argvs[1]) or isntFile(argvs[2])):
        quit()
        
    canvas = Image.open(argvs[1])
    target = Image.open(argvs[2])

    retImg, find = similSearch(canvas, target, 100000)
    retImg.save('ans_' + argvs[1])
    if (find): print 'find'
    else: print 'not find'

def isntFile(file):
    ret = not os.path.isfile(file)
    if(ret): print 'Error: It does not exist the \"%s\" file ' % file 
    return ret

def getGlayPxls(origin):
    pxls1 = origin.load()
    glay = Image.new('L',(origin.width,origin.height))
    pxls2 = glay.load()
    for i in range(glay.width):
        for l in range(glay.height):
           r, g, b = pxls1[i,l]
           pxls2[i,l] = int(0.299*r + 0.587*g + 0.114*b)
    return glay 
 
def similSearch(canvas, target, margin):
    canvasG = getGlayPxls(canvas)
    mateG = getGlayPxls(target)
    canvasP = canvasG.load()
    mateP = mateG.load()
    find = False
    ssd = 0
    for i in range(canvasG.width - mateG.width + 1):
        for l in range(canvasG.height - mateG.height + 1):
            ssd = 0
            for ii in range(mateG.width):
                for ll in range(mateG.height):
                    ssd += (canvasP[(i+ii),(l+ll)] - mateP[ii,ll])**2
            if ssd < margin:
                find = True
                canvas = drowPoint(canvas, i, l, mateG.width, mateG.height)
    return(canvas, find)

def drowPoint(image, x, y, sizeX, sizeY):
    dr = ImageDraw.Draw(image)
    dr.rectangle(((x,y),(x+sizeX-1,y+sizeY-1)),outline=(255,0,0))
    return image


if __name__ == '__main__':
    main()


