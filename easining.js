function easingInOut( max, current, alpha ){
	var point = (current/max) * (alpha*Math.PI);
	return Math.sin( point + Math.PI/2);
}
