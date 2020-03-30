function removeLeadingTrailing(n) {
	return n.replace(/(^0+(?=[0-9])|(\.0*$)|((?<=\.\d*)0+$))/g, "");
}