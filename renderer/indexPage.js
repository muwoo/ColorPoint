const { mutation, connect } = require('./store/index.js')
const { ipcRenderer, desktopCapturer } = require( "electron" );
const Keyboard = require('./home/keyboard')
const ColorHistory = require('./home/colorHistory')
const size = {width: screen.width, height: screen.height}


const beforeCapture = () => {
  ipcRenderer.send('hide-main', size)
}

const startCapture = ()=> {
  desktopCapturer.getSources({types: ['screen'], thumbnailSize: size}, function(error, sources) {
    if (error) throw error;
    mutation({
      type: 'PREVIEW_IMAGE',
      payload: sources[0].thumbnail.toDataURL(),
      arg: size
    })
  })
}

ipcRenderer.on('async-hided', startCapture)

ipcRenderer.on('shortcut-show', beforeCapture)

connect([{
  subs: ['DEFAULTE_KEYS'],
  object: new Keyboard({
    el: document.querySelector('.mixin-keyboard'),
    start: beforeCapture
  })
}, {
  subs: ['Color'],
  object: new ColorHistory({
    el: document.querySelector('.mixin-colors')
  })
}])