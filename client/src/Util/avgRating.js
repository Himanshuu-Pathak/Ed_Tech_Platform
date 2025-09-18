export default function GetAvgRating(ratingArr){
    if(ratingArr?.length === 0) return 0;
    const totalReviewCount = ratingArr?.reduce((acc,curr) =>{
        acc += curr.rating;
        return acc;
    },0); // 0 is a initial val;ue of accumulator and reduce method is used to iterate over all values

    const multiplier = Math.pow(10,1);
    const avgReviewCount = Math.round((totalReviewCount/ratingArr?.length)*multiplier)/multiplier;

    return avgReviewCount;
}