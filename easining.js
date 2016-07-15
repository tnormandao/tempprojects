function easingInOut( max, current ){
	return Math.sin( ((current/max) * Math.PI) + Math.PI/2);
}
