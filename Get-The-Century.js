function century(year) {
	var year = Math.floor((year-1)/100) ;
	var suffix = year+1 > 20 ? 'st' : 'th';
	return `${year+1}${suffix} century`;
}