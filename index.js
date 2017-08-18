// Helper for URL generator
function hex2a(hexx) {
  var hex = hexx.toString() //force conversion
  var str = ''
  for (var i = 0; i < hex.length; i += 2)
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16))
  return str
}

// URL generator logic
function generateProxyUrl(opts) {
  var encoded_url = btoa(opts.url).replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-')
  var path = "/" + opts.resize + "/" + opts.width + "/" + opts.height + "/" +
             opts.gravity + "/" + opts.enlarge + "/" + encoded_url + "." + opts.extension
  var shaObj = new jsSHA("SHA-256", "BYTES")
  shaObj.setHMACKey(opts.key, "HEX")
  shaObj.update(hex2a(opts.salt))
  shaObj.update(path)
  var hmac = shaObj.getHMAC("B64").replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-')
  return opts.proxy_url + "/" + hmac + path
}

// UX
var formValues = {}

$(function () {
  new Clipboard('.copy');

  $('#submit').click(function (e) {
    e.preventDefault()
    $('input, select').each(function () {
      var inputName = $(this).attr('id')
      if (inputName !== 'submit' && inputName !== 'enlarge') {
        formValues[inputName] = $(this).val()
      }
      if (inputName == 'enlarge') {
        if  ($(this).is(':checked')) {
          formValues[inputName] = 1
        } else {
          formValues[inputName] = 0
        }
      }
    })
    var proxyUrl = generateProxyUrl(formValues)
    $('#result').val(proxyUrl)
    formValues = {}
  })
})
