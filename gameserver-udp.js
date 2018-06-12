// udp server

"use strict"

// const
const THREE = require( "three" )

var PORT = 33333
var HOST = "127.0.0.1"

var dgram = require( "dgram" )
var server = dgram.createSocket( "udp4" )

const players = []

server.on( "listening", function () {
	var address = server.address()
	console.log( 'server up ' + address.address + ":" + address.port )
} )

server.on( "message", function ( message, remote ) {
	console.log( remote.address + ':' + remote.port + ' - ' + message )
	const args = message.toString().split( " " )
	const arg0 = args[ 0 ]
	const arg1 = args[ 1 ]
	switch ( arg0 ) {
		case "a":
			switch ( arg1 ) {
				case "up":
					break
				case "down":
					break
				case "left":
					break
				case "right":
					break
			}
			break
		case "j":
			addPlayer( arg1, remote.address )
			break
		case "d":
			removePlayer( arg1, remote.address )
			break
	}
} )

function Player( args ) {
	this.username = args.username
	this.ip = args.ip
	this.body = new Body()
}

function Body() {
	this.position = new THREE.Vector3( 0, 0, 0 )
	this.velocity = new THREE.Vector3( 0, 0, 0 )

}

Body.prototype.updatePhysics = function () {
	this.position.add( this.velocity )
}

setInterval( updatePhysics, 10 )
function updatePhysics() {

}

setInterval( updateNetwork, 100 )
function updateNetwork() {
	server.send( "update", PORT )
	server.send( "update", PORT )
}

new Body()

function addPlayer( username, ip ) {
	players.push( new Player( {
		ip: remote.address,
		username: "test",
	} ) )
}

function removePlayer( username, ip ) {
	var i = players.findIndex( e => {
		return e.username === username && e.ip === ip
	} )
	players.splice( i, 1 )
}

server.bind( PORT, HOST )
