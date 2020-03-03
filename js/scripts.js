var myHotel = 
{
    name: 'The Quay',
    totalRooms: 40,
    bookedRooms: 25,
    types: [
        'twin',
        'double',
        'suite'
    ],
    checkAvailability: function() 
    {
        console.log('Remaining Rooms: ' + (this.totalRooms - this.bookedRooms));
    }
}

myHotel.bookedRooms = 30;
myHotel.checkAvailability();