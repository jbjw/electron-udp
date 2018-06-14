// udp server

"use strict"

const HOST_PORT = 4000
const DEST_PORT = 4001
const HOST_ADDRESS = "192.168.0.23" // "159.203.241.253"
const DEST_ADDRESS = ""
const MULTICAST_ADDRESS = "224.0.0.114" // "230.185.192.108" // "239.1.2.3"

const dgram = require( "dgram" )

const server = dgram.createSocket( "udp4" )

server.on( "close", function () {
	console.log( "close" )
} )

server.on( "error", function ( error ) {
	console.log( "error", error )
} )

server.on( "listening", function () {
	const address = server.address()
	console.log( 'listening ' + address.address + ":" + address.port )
} )

// server.on( "message", function ( message, remote ) {
// 	console.log( remote.address + ':' + remote.port + ' - ' + message )
// }

server.bind( HOST_PORT, function () {
	// server.addMembership( multicastAddress )
	// server.setBroadcast( true )
	// server.setMulticastTTL( 128 )
	setInterval( function () {
		server.send( "update from server", DEST_PORT, MULTICAST_ADDRESS )
	}, 1000 )

} )
