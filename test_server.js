// udp server

"use strict"

var SRC_PORT = 4000
var PORT = 4001
var HOST = "159.203.241.253"
var multicastAddress = "230.185.192.108" // "239.1.2.3"

var dgram = require( "dgram" )
var server = dgram.createSocket( "udp4" )

server.on( "close", function () {
	console.log( "close" )
} )

server.on( "error", function ( error ) {
	console.log( "error", error )
} )

server.on( "listening", function () {
	var address = server.address()
	console.log( 'listening ' + address.address + ":" + address.port )
} )

server.on( "message", function ( message, remote ) {
	// server.address.address
	// server.address.port
	if ( message == "update" ) {

	} else {
		console.log( remote.address + ':' + remote.port + ' - ' + message )
	}
}


server.send( "update from server", PORT, multicastAddress )


server.bind( SRC_PORT, HOST, function () {
	server.addMembership( multicastAddress )
	server.setBroadcast( true )
	server.setMulticastTTL( 128 )
} )
