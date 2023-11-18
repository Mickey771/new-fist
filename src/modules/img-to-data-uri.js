// Courtesy of
// https://github.com/HenrikJoreteg/image-to-data-uri.js/blob/master/image-to-data-uri.js

function imgToDataUri(url, cb) {
    // Create an empty canvas and image elements
    var canvas = document.createElement('canvas')
    var img = document.createElement('img')
  
    img.onload = function () {
      var ctx = canvas.getContext('2d')
  
      // match size of image
      canvas.width = img.width
      canvas.height = img.height
  
      // Copy the image contents to the canvas
      ctx.drawImage(img, 0, 0)
  
      // Get the data-URI formatted image
      cb(null, canvas.toDataURL('image/png'))
    }
  
    img.ononerror = function () {
      cb(new Error('FailedToLoadImage'))
    }
  
    // canvas is not supported
    if (!canvas.getContext) {
      setTimeout(cb, 0, new Error('CanvasIsNotSupported'))
    } else {
      img.setAttribute('crossOrigin', 'anonymous')
      img.src = url
    }
}

export default function imgToDataUriPromise(url) {
    return new Promise(function(resolve, reject) {
        imgToDataUri(url, function(error,uri) {
            if (error !== null) reject(error);
            resolve(uri);
        })
    })
}