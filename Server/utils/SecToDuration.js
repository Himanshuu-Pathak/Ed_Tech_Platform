function convertSecondsToDuration(totalSeconds){
    const hours = Math.floor(totalSeconds/3600);
    const minute = Math.floor((totalSeconds%3600)/60);
    const second = Math.floor((totalSeconds%3600)%60);

    if(hours >0) {
        return `${hours}h ${minutes}m`;

    }
    else if(minute>0){
        return `${minutes}m ${seconds}s`;
    }
    else{
        return `${seconds}s`;
    }
}

module.exports = {
    convertSecondsToDuration,
};