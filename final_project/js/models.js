/**
 * @author Haotian Wang
 * @email hautian@umich.edu
 */

class Item {
    /**
     * Cell phone object model
     * @param {string[]} item
     */
    constructor(item) {
        this.asin = item[0];
        this.brand = item[1];
        this.title = item[2];
        this.url = item[3];
        this.image = item[4];
        this.rating = parseFloat(item[5]);
        this.reviewUrl = item[6];
        this.totalReviews = parseInt(item[7]);
        this.prices = item[8].split(',').filter(x => x).map(price => parseFloat(price.replace('$', '')));
    }
}

class Review {
    /**
     * Cell phone review object model
     * @param {string[]} review
     */
    constructor(review) {
        this.asin = review[0];
        this.name = review[1];
        this.rating = parseInt(review[2]);
        //this.date = Date.parse(review[3]);
        this.date = review[3];
        this.verified = review[4] === "TRUE";
        this.title = review[5];
        this.body = review[6];
        this.helpfulVotes = parseInt(review[7]);
    }
}
