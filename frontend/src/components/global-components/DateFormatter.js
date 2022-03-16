import React from 'react';

export default function DateFormatter(dateString: string) {
    return dateString.substr(0,10) + ", " + dateString.split("T")[1].toString().substr(0, 5)
}

