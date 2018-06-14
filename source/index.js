//

"use strict"

const qs = document.querySelector.bind( document )
const log = console.log

const PI = Math.PI

const UP = new THREE.Vector3( 0, 1, 0 )
const FORWARD = new THREE.Vector3( 1, 0, 0 )
const RIGHT = new THREE.Vector3( 0, 0, 1 )

const SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight
const FOV = 75
const ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT
const NEAR = 0.1, FAR = 100000

const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } )
renderer.setPixelRatio( window.devicePixelRatio )
renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT )
document.body.appendChild( renderer.domElement )
// renderer = new THREE.WebGLRenderer( { antialias: false, alpha : true } );
renderer.setClearColor( 0x000000, 0 )

const stats = new Stats()
stats.showPanel( 0 )
// document.body.appendChild( stats.dom )

var loader = new THREE.CubeTextureLoader()
loader.setPath( './assets/cube_textures/space-cube/' )

var textureCube = loader.load( [
	"l.png", "r.png", // 'px.png', 'nx.png',
	"t.png", "b.png", // 'py.png', 'ny.png',
	"rr.png", "c.png", // 'pz.png', 'nz.png',
] )

var material = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: textureCube } )
// scene.background = textureCube

var keyboardState = {}

document.addEventListener( "keydown", function ( e ) {
	keyboardState[e.key] = true
} )

document.addEventListener( "keyup", function ( e ) {
	keyboardState[e.key] = false
} )

var bindings = [
	{
		key: "w",
		action: "up",
	},
	{
		key: "s",
		action: "down",
	},
]

var objects = []

setInterval( function () {
	for ( let object of objects ) {
		object.update()
		object.updateControls()
	}
}, 10 )

var camera = new THREE.PerspectiveCamera( FOV, SCREEN_WIDTH / SCREEN_HEIGHT, NEAR, FAR )
camera.position.x = 0 // -50
camera.position.y = -10
camera.position.z = 30
camera.up.set( 0, 0, 1 )
	// // camera.position.fromArray( view.eye )
	// // camera.up.fromArray( view.up )
	// view.camera = camera

const controls = new THREE.OrbitControls( camera )

function sendUDP( message ) {
	function callback( err, bytes ) {
		if (err) throw err
		console.log( 'UDP message sent to ' + HOST + ':' + PORT )
	}
	client.send( message, PORT, HOST, callback )
	// client.send( message, 0, message.length, PORT, HOST, callback )
}

var PORT = 33333
var HOST = "127.0.0.1"

var dgram = require( "dgram" )
var message = new Buffer( "My KungFu is Good!" )

var client = dgram.createSocket( "udp4" )

client.on( "close", function ( x, y ) {
	log( "close", x )
} )

client.on( "error", function ( x, y ) {
	log( "error", x )
} )

client.on( "listening", function () {
	log( "listening" )
} )

client.on( "message", function ( x, y ) {
	log( "message", x )
} )

sendUDP( `j ${ "test" }` )

const entities = []

var ball = new Ball()
entities.push( ball )

function Ball() {
	this.mesh = new THREE.Mesh(
		new THREE.SphereGeometry( 0.5, 32, 32 ),
		new THREE.MeshLambertMaterial( {
			color: utils.randomColor(),
			// wireframe: true
		} ),
	)
	this.position = this.mesh.position
	this.velocity = new THREE.Vector3( 0, 0, 0 )
	this.velocity.x = [ -1, 1 ].choose() * 0.1
	this.velocity.y = [ -1, 1 ].choose() * 0.1
	// this.velocity.x = utils.random( -0.1, 0.1 )
	// this.velocity.z = utils.random( -0.1, 0.1 )
	scene.add( this.mesh )
}

Ball.prototype.updatePhysics = function () {
	this.position.add( this.velocity )
}

var ambientLight = new THREE.AmbientLight( 0x404040 )
scene.add( ambientLight )

var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 )
scene.add( directionalLight )
directionalLight.position.set( 100, 100, 100 )

var grassTexture = new THREE.TextureLoader().load( './assets/textures/grass.jpg' );
grassTexture.repeat.set( 100, 100 )
grassTexture.wrapS = THREE.RepeatWrapping
grassTexture.wrapT = THREE.RepeatWrapping

var ground = new THREE.Mesh(
	new THREE.PlaneGeometry( 100, 100, 10, 10 ),
	new THREE.MeshLambertMaterial( {
		// color: 0x00ff00,
		// opacity: 0.1,
		// transparent: false,
		// wireframe: true,
		map: grassTexture,
		side: THREE.DoubleSide,
	} ),
)
scene.add( ground )
ground.position.z = -0.1
// ground.rotation.x = Math.PI/2

// var axisHelper = new THREE.AxisHelper( 5 )
// scene.add( axisHelper )
// axisHelper.position.z = 5

var colorCenterLine = new THREE.Color( "rgba(255, 0, 255)" )
var colorGrid = new THREE.Color( "rgba(0, 255, 255)" )

// var gridHelper = new THREE.GridHelper( 100, 100, colorCenterLine, colorGrid )
// scene.add( gridHelper )
// gridHelper.rotation.x = Math.PI*0.5


// physics loop
setInterval( updatePhysics, 10 )
function updatePhysics() {
	for ( let entity of entities ) {
		entity.updatePhysics()
	}
}

// controls loop
setInterval( updateControls, 10 )
function updateControls() {
	for ( let binding of bindings ) {
		if ( keyboardState[ binding.key ] ) {
			switch ( binding.action ) {
				case "up":
					sendUDP( "u" )
					break
				case "down":
					sendUDP( "d" )
					break
			}
		}
	}
}

function render() {
	stats.begin()
	// const SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight

	// renderer.setViewport( left, top, width, height );
	// renderer.setClearColor( view.background );
	// renderer.setClearColor( new THREE.Color( "#000" ) )

	// camera.aspect = width / height
	// camera.updateProjectionMatrix()

	renderer.render( scene, camera )
	stats.end()
	// controls.update()
	requestAnimationFrame( render )
}
requestAnimationFrame( render )

function onWindowResize() {
	renderer.setSize( window.innerWidth, window.innerHeight )
}
window.addEventListener( 'resize', onWindowResize, false )
