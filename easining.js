function easingInOut( max, current ){
	return Math.abs( Math.sin( ((current/max) * Math.PI) + Math.PI/2) );
}
